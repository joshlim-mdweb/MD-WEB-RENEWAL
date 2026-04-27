import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { tossApiHeaders, TOSS_API_BASE, MONTHLY_CREDITS, generateOrderId } from "@/lib/toss";
import type { SubscriptionPlan } from "@/lib/toss";

export const runtime = "nodejs";

// POST /api/internal/subscriptions/renew
// Vercel Cron이 매일 00:00에 호출한다.
// expires_at이 내일 이전인 active 구독을 자동갱신한다.
//
// 보안: CRON_SECRET 헤더로 인증. 외부 공개 엔드포인트가 아님.
export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: subs, error } = await admin
    .from("subscriptions")
    .select("id, user_id, plan, billing_key_id, expires_at")
    .eq("status", "active")
    .lte("expires_at", tomorrow);

  if (error) {
    console.error("[renew] subscriptions fetch failed", error);
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ renewed: 0, failed: 0 });
  }

  let renewed = 0;
  let failed = 0;

  for (const sub of subs) {
    try {
      const { data: bk } = await admin
        .from("billing_keys")
        .select("billing_key")
        .eq("id", sub.billing_key_id ?? "")
        .eq("is_active", true)
        .single();

      if (!bk?.billing_key) {
        console.error(`[renew] no active billing key for user ${sub.user_id}`);
        await markPastDue(admin, sub.id, sub.user_id);
        failed++;
        continue;
      }

      const plan = sub.plan as SubscriptionPlan;
      const { amount, orderName } = getPlanPrice(plan);
      const orderId = generateOrderId(sub.user_id);
      const now = new Date().toISOString();
      const orderType = plan === "pro" ? "subscription_pro" : "subscription_max";

      await admin.from("orders").insert({
        user_id: sub.user_id,
        order_type: orderType,
        amount,
        status: "pending",
        toss_order_id: orderId,
      });

      const payRes = await fetch(`${TOSS_API_BASE}/billing/${bk.billing_key}`, {
        method: "POST",
        headers: tossApiHeaders(),
        body: JSON.stringify({
          customerKey: sub.user_id,
          amount,
          orderId,
          orderName,
        }),
      });

      if (!payRes.ok) {
        const errBody = await payRes.json().catch(() => ({}));
        console.error(`[renew] billing failed for user ${sub.user_id}`, errBody);
        await admin
          .from("orders")
          .update({ status: "failed", updated_at: now })
          .eq("toss_order_id", orderId);
        await markPastDue(admin, sub.id, sub.user_id);
        failed++;
        continue;
      }

      const payment = await payRes.json();
      const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await Promise.all([
        admin
          .from("orders")
          .update({
            status: "paid",
            toss_payment_key: payment.paymentKey,
            toss_response: payment,
            updated_at: now,
          })
          .eq("toss_order_id", orderId),
        admin
          .from("subscriptions")
          .update({ expires_at: newExpiresAt, status: "active", updated_at: now })
          .eq("id", sub.id),
      ]);

      await grantCredits(
        admin,
        sub.user_id,
        MONTHLY_CREDITS[plan],
        "monthly_grant",
        "subscription"
      );
      renewed++;
    } catch (err) {
      console.error(`[renew] unexpected error for sub ${sub.id}`, err);
      await markPastDue(admin, sub.id, sub.user_id);
      failed++;
    }
  }

  return NextResponse.json({ renewed, failed, total: subs.length });
}

async function markPastDue(
  admin: ReturnType<typeof createAdminClient>,
  subId: string,
  userId: string
) {
  const now = new Date().toISOString();
  await Promise.all([
    admin.from("subscriptions").update({ status: "past_due", updated_at: now }).eq("id", subId),
    admin.from("profile").update({ plan: "free" }).eq("uuid", userId),
  ]);
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

function getPlanPrice(plan: SubscriptionPlan): { amount: number; orderName: string } {
  if (plan === "pro") return { amount: 19000, orderName: "OPINION Pro" };
  if (plan === "max") return { amount: 39000, orderName: "OPINION Max" };
  return { amount: 0, orderName: "" };
}
