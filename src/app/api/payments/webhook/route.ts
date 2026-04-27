import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { MONTHLY_CREDITS, tossApiHeaders, TOSS_API_BASE } from "@/lib/toss";
import type { SubscriptionPlan } from "@/lib/toss";

export const runtime = "nodejs";

// POST /api/payments/webhook
// TossPayments 웹훅 수신. 비동기 결제 상태 변화(가상계좌 등)를 처리한다.
// 멱등성 보장: 이미 처리된 주문은 200으로 무시.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { eventType, data } = body as {
    eventType?: string;
    data?: Record<string, unknown>;
  };

  if (!eventType || !data) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (eventType) {
      case "PAYMENT_STATUS_CHANGED":
        await handlePaymentStatusChanged(admin, data);
        break;
      case "VIRTUAL_ACCOUNT_DEPOSIT":
        await handleVirtualAccountDeposit(admin, data);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`[payments/webhook] handler error for ${eventType}:`, err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentStatusChanged(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>
) {
  const orderId = data.orderId as string | undefined;
  const status = data.status as string | undefined;
  if (!orderId || !status) return;

  const { data: order } = await admin
    .from("orders")
    .select("id, status, order_type, user_id, amount")
    .eq("toss_order_id", orderId)
    .maybeSingle();

  if (!order || order.status === "paid") return;

  if (status === "DONE") {
    const payRes = await fetch(`${TOSS_API_BASE}/payments/orders/${orderId}`, {
      headers: tossApiHeaders(),
    });
    if (!payRes.ok) return;
    const payment = await payRes.json();

    const now = new Date().toISOString();
    await admin
      .from("orders")
      .update({
        status: "paid",
        toss_payment_key: payment.paymentKey,
        toss_response: payment,
        updated_at: now,
      })
      .eq("id", order.id);

    if (order.order_type.startsWith("credits_")) {
      await grantCredits(admin, order.user_id, 100, "purchase", "topup");
    }

    if (order.order_type.startsWith("subscription_")) {
      const plan: SubscriptionPlan = order.order_type === "subscription_pro" ? "pro" : "max";
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await Promise.all([
        admin.from("subscriptions").upsert(
          {
            user_id: order.user_id,
            plan,
            status: "active",
            expires_at: expiresAt,
            updated_at: now,
          },
          { onConflict: "user_id" }
        ),
        admin.from("profile").update({ plan }).eq("uuid", order.user_id),
      ]);
      await grantCredits(
        admin,
        order.user_id,
        MONTHLY_CREDITS[plan],
        "monthly_grant",
        "subscription"
      );
    }
  } else if (status === "CANCELED" || status === "ABORTED") {
    await admin
      .from("orders")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("id", order.id);
  }
}

async function handleVirtualAccountDeposit(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>
) {
  await handlePaymentStatusChanged(admin, { ...data, status: "DONE" });
}

async function grantCredits(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  amount: number,
  type: "monthly_grant" | "purchase",
  source: "subscription" | "topup"
) {
  if (amount === 0) return;
  const { data: existing } = await admin
    .from("ai_credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();
  const newBalance = (existing?.balance ?? 0) + amount;
  const now = new Date().toISOString();
  await Promise.all([
    admin
      .from("ai_credits")
      .upsert({ user_id: userId, balance: newBalance, updated_at: now }, { onConflict: "user_id" }),
    admin.from("ai_credit_transactions").insert({ user_id: userId, amount, type, source }),
  ]);
}
