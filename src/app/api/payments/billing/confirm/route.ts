import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { tossApiHeaders, TOSS_API_BASE, MONTHLY_CREDITS } from "@/lib/toss";
import type { SubscriptionPlan } from "@/lib/toss";

// POST /api/payments/billing/confirm
// TossPayments 빌링키 발급 후 즉시 첫 결제를 처리한다.
// 빌링키 방식 구독 흐름:
//   1. requestBillingAuth() → /payments/billing/success?authKey=xxx&customerKey=xxx
//   2. 이 엔드포인트에서 빌링키 발급 + 즉시 결제
//   3. subscriptions 생성, profile.plan 업데이트, 크레딧 첫 지급
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { authKey, customerKey, orderId } = body as {
    authKey?: string;
    customerKey?: string;
    orderId?: string;
  };

  if (!authKey || !customerKey || !orderId) {
    return NextResponse.json({ error: "missing_params" }, { status: 422 });
  }

  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, user_id, order_type, amount, status")
    .eq("toss_order_id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  }
  if (order.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (order.status !== "created") {
    return NextResponse.json({ error: "order_already_processed" }, { status: 409 });
  }
  if (!order.order_type.startsWith("subscription_")) {
    return NextResponse.json({ error: "invalid_order_type" }, { status: 422 });
  }

  await admin
    .from("orders")
    .update({ status: "pending", updated_at: new Date().toISOString() })
    .eq("id", order.id);

  // ─── Step 1: 빌링키 발급 ─────────────────────────────────────────────────
  let billingKey: string;
  let cardCompany: string | undefined;
  let cardNumber: string | undefined;

  try {
    const billingRes = await fetch(`${TOSS_API_BASE}/billing/authorizations/${authKey}`, {
      method: "POST",
      headers: tossApiHeaders(),
      body: JSON.stringify({ customerKey }),
    });

    if (!billingRes.ok) {
      const errBody = await billingRes.json().catch(() => ({}));
      await admin
        .from("orders")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", order.id);
      return NextResponse.json({ error: "billing_key_failed", detail: errBody }, { status: 400 });
    }

    const billingData = await billingRes.json();
    billingKey = billingData.billingKey;
    cardCompany = billingData.card?.company;
    cardNumber = billingData.card?.number;
  } catch (err) {
    console.error("[billing/confirm] billing key fetch error", err);
    await admin
      .from("orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return NextResponse.json({ error: "billing_key_error" }, { status: 500 });
  }

  // ─── Step 2: billing_keys 저장 ───────────────────────────────────────────
  const { data: billingKeyRow, error: bkError } = await admin
    .from("billing_keys")
    .insert({
      user_id: user.id,
      billing_key: billingKey,
      card_company: cardCompany,
      card_number: cardNumber,
    })
    .select("id")
    .single();

  if (bkError || !billingKeyRow) {
    await admin
      .from("orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return NextResponse.json({ error: "billing_key_save_failed" }, { status: 500 });
  }

  // ─── Step 3: 즉시 첫 결제 ────────────────────────────────────────────────
  let tossPayment: Record<string, unknown>;
  try {
    const payRes = await fetch(`${TOSS_API_BASE}/billing/${billingKey}`, {
      method: "POST",
      headers: tossApiHeaders(),
      body: JSON.stringify({
        customerKey,
        amount: order.amount,
        orderId,
        orderName: order.order_type === "subscription_pro" ? "OPINION Pro" : "OPINION Max",
        customerEmail: user.email,
      }),
    });

    if (!payRes.ok) {
      const errBody = await payRes.json().catch(() => ({}));
      await admin
        .from("orders")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", order.id);
      return NextResponse.json({ error: "payment_failed", detail: errBody }, { status: 400 });
    }

    tossPayment = await payRes.json();
  } catch (err) {
    console.error("[billing/confirm] payment fetch error", err);
    await admin
      .from("orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return NextResponse.json({ error: "payment_error" }, { status: 500 });
  }

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const plan: SubscriptionPlan = order.order_type === "subscription_pro" ? "pro" : "max";

  // ─── Step 4: DB 업데이트 ──────────────────────────────────────────────────
  await Promise.all([
    admin
      .from("orders")
      .update({
        status: "paid",
        toss_payment_key: tossPayment.paymentKey as string,
        toss_response: tossPayment as import("@/lib/types/database").Json,
        updated_at: now,
      })
      .eq("id", order.id),
    admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan,
        status: "active",
        billing_key_id: billingKeyRow.id,
        expires_at: expiresAt,
        updated_at: now,
      },
      { onConflict: "user_id" }
    ),
    admin.from("profile").update({ plan }).eq("uuid", user.id),
  ]);

  await grantCredits(admin, user.id, MONTHLY_CREDITS[plan], "monthly_grant", "subscription");

  return NextResponse.json({ success: true, plan, expiresAt, cardCompany, cardNumber });
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
