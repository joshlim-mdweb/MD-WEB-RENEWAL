import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { PLAN_PRICES, CREDIT_PRICES, generateOrderId } from "@/lib/toss";
import type { SubscriptionPlan } from "@/lib/toss";

// POST /api/orders
// 결제 요청 전 주문을 DB에 미리 생성한다.
// 응답값의 orderId로 TossPayments requestPayment() / requestBillingAuth()를 호출한다.
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

  const { type, plan } = body as { type?: string; plan?: string };

  // ─── 구독 주문 ────────────────────────────────────────────────────────────
  if (type === "subscription") {
    if (plan !== "pro" && plan !== "max") {
      return NextResponse.json({ error: "invalid_plan" }, { status: 422 });
    }

    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id, plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existingSub) {
      return NextResponse.json(
        { error: "already_subscribed", current_plan: existingSub.plan },
        { status: 409 }
      );
    }

    const { amount, orderName } = PLAN_PRICES[plan as "pro" | "max"];
    const orderType = `subscription_${plan}` as const;
    const tossOrderId = generateOrderId(user.id);

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        order_type: orderType,
        amount,
        status: "created",
        toss_order_id: tossOrderId,
      })
      .select("id, toss_order_id, amount")
      .single();

    if (error || !order) {
      console.error("[orders] insert failed", error);
      return NextResponse.json({ error: "order_create_failed" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.toss_order_id,
      orderName,
      amount: order.amount,
      customerKey: user.id,
    });
  }

  // ─── 크레딧 추가 구매 ────────────────────────────────────────────────────
  if (type === "credits") {
    const { data: profile } = await supabase
      .from("profile")
      .select("plan")
      .eq("uuid", user.id)
      .single();

    const userPlan = (profile?.plan as SubscriptionPlan) ?? "free";
    if (userPlan === "free") {
      return NextResponse.json({ error: "plan_required" }, { status: 403 });
    }

    const creditPrice = CREDIT_PRICES[userPlan as "pro" | "max"];
    const orderType = `credits_${userPlan}` as "credits_pro" | "credits_max";
    const tossOrderId = generateOrderId(user.id);

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        order_type: orderType,
        amount: creditPrice.amount,
        status: "created",
        toss_order_id: tossOrderId,
      })
      .select("id, toss_order_id, amount")
      .single();

    if (error || !order) {
      console.error("[orders] credits insert failed", error);
      return NextResponse.json({ error: "order_create_failed" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.toss_order_id,
      orderName: `OPINION AI 크레딧 +${creditPrice.credits}`,
      amount: order.amount,
      credits: creditPrice.credits,
    });
  }

  return NextResponse.json({ error: "invalid_type" }, { status: 422 });
}
