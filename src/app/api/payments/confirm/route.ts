import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { tossApiHeaders, TOSS_API_BASE } from "@/lib/toss";

// POST /api/payments/confirm
// 일반 결제(크레딧 추가 구매) 서버사이드 승인.
// 성공 페이지에서 paymentKey·orderId·amount를 받아 Toss 승인 API를 호출한다.
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

  const { paymentKey, orderId, amount } = body as {
    paymentKey?: string;
    orderId?: string;
    amount?: number;
  };

  if (!paymentKey || !orderId || amount == null) {
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
  // 금액 불일치 방지 — 핵심 보안 검증
  if (order.amount !== amount) {
    return NextResponse.json({ error: "amount_mismatch" }, { status: 400 });
  }
  if (!order.order_type.startsWith("credits_")) {
    return NextResponse.json({ error: "invalid_order_type" }, { status: 422 });
  }

  await admin
    .from("orders")
    .update({ status: "pending", updated_at: new Date().toISOString() })
    .eq("id", order.id);

  // ─── Toss 승인 API 호출 ───────────────────────────────────────────────────
  let tossPayment: Record<string, unknown>;
  try {
    const confirmRes = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
      method: "POST",
      headers: tossApiHeaders(),
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!confirmRes.ok) {
      const errBody = await confirmRes.json().catch(() => ({}));
      await admin
        .from("orders")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", order.id);
      return NextResponse.json({ error: "payment_failed", detail: errBody }, { status: 400 });
    }

    tossPayment = await confirmRes.json();
  } catch (err) {
    console.error("[payments/confirm] fetch error", err);
    await admin
      .from("orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return NextResponse.json({ error: "payment_error" }, { status: 500 });
  }

  const now = new Date().toISOString();
  const credits = 100;

  await admin
    .from("orders")
    .update({
      status: "paid",
      toss_payment_key: paymentKey,
      toss_response: tossPayment as import("@/lib/types/database").Json,
      updated_at: now,
    })
    .eq("id", order.id);

  const { data: existing } = await admin
    .from("ai_credits")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle();

  const newBalance = (existing?.balance ?? 0) + credits;

  await Promise.all([
    admin
      .from("ai_credits")
      .upsert(
        { user_id: user.id, balance: newBalance, updated_at: now },
        { onConflict: "user_id" }
      ),
    admin.from("ai_credit_transactions").insert({
      user_id: user.id,
      amount: credits,
      type: "purchase",
      source: "topup",
    }),
  ]);

  return NextResponse.json({ success: true, credits, newBalance });
}
