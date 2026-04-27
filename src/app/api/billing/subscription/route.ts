import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { SubscriptionPlan } from "@/lib/stripe";
import { MONTHLY_CREDITS, WITHDRAWAL_FEE_RATE, SURVEY_LIMIT } from "@/lib/stripe";

// GET /api/billing/subscription
// 현재 로그인 사용자의 구독 상태 + 크레딧 잔량 반환.
//
// 구독 row가 없으면 free 플랜 기본값을 반환한다.
// Cost: 1 auth + 1 subscription read + 1 credits read = 3 reads
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [subscriptionResult, creditsResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, plan, status, expires_at, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("ai_credits").select("balance, updated_at").eq("user_id", user.id).maybeSingle(),
  ]);

  if (subscriptionResult.error) {
    return NextResponse.json({ error: "subscription_fetch_failed" }, { status: 500 });
  }

  if (creditsResult.error) {
    return NextResponse.json({ error: "credits_fetch_failed" }, { status: 500 });
  }

  const plan: SubscriptionPlan = (subscriptionResult.data?.plan as SubscriptionPlan) ?? "free";

  return NextResponse.json({
    subscription: subscriptionResult.data ?? null,
    plan,
    credits: {
      balance: creditsResult.data?.balance ?? 0,
      updatedAt: creditsResult.data?.updated_at ?? null,
    },
    limits: {
      surveyLimit: SURVEY_LIMIT[plan],
      monthlyCredits: MONTHLY_CREDITS[plan],
      withdrawalFeeRate: WITHDRAWAL_FEE_RATE[plan],
    },
  });
}
