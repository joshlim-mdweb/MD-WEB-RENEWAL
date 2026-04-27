// Stripe 설정 & 상수
// toss.ts를 대체한다.

import Stripe from "stripe";

// 서버사이드 전용. 빌드 타임 초기화를 피하기 위해 getter 패턴 사용.
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  }
  return _stripe;
}

// 편의 alias — API route에서 직접 사용
export const stripe = {
  checkout: {
    sessions: {
      create: (...args: Parameters<Stripe["checkout"]["sessions"]["create"]>) =>
        getStripe().checkout.sessions.create(...args),
    },
  },
  subscriptions: {
    retrieve: (...args: Parameters<Stripe["subscriptions"]["retrieve"]>) =>
      getStripe().subscriptions.retrieve(...args),
  },
  billingPortal: {
    sessions: {
      create: (...args: Parameters<Stripe["billingPortal"]["sessions"]["create"]>) =>
        getStripe().billingPortal.sessions.create(...args),
    },
  },
  webhooks: {
    constructEvent: (...args: Parameters<Stripe["webhooks"]["constructEvent"]>) =>
      getStripe().webhooks.constructEvent(...args),
  },
};

export type SubscriptionPlan = "free" | "pro" | "max";
export type SubscriptionStatus = "active" | "canceled" | "past_due";
export type OrderType = "subscription_pro" | "subscription_max" | "credits_pro" | "credits_max";
export type OrderStatus = "created" | "pending" | "paid" | "failed" | "canceled";

// ─── 플랜 구독 가격 ───────────────────────────────────────────────
// 변경 시 Stripe 대시보드 Price ID도 함께 업데이트.
export const PLAN_PRICES: Record<
  "pro" | "max",
  { amount: number; orderName: string; priceId: string }
> = {
  pro: { amount: 19000, orderName: "OPINION Pro", priceId: process.env.STRIPE_PRO_PRICE_ID! },
  max: { amount: 39000, orderName: "OPINION Max", priceId: process.env.STRIPE_MAX_PRICE_ID! },
};

// ─── 크레딧 추가 구매 가격 ────────────────────────────────────────
export const CREDIT_PRICES: Record<
  "pro" | "max",
  { amount: number; credits: number; priceId: string }
> = {
  pro: { amount: 8000, credits: 100, priceId: process.env.STRIPE_CREDITS_PRO_PRICE_ID! },
  max: { amount: 7000, credits: 100, priceId: process.env.STRIPE_CREDITS_MAX_PRICE_ID! },
};

// ─── 플랜별 기능 제한 ─────────────────────────────────────────────
export const MONTHLY_CREDITS: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 200,
  max: 600,
};

export const WITHDRAWAL_FEE_RATE: Record<SubscriptionPlan, number> = {
  free: 0.1,
  pro: 0.08,
  max: 0.06,
};

export const SURVEY_LIMIT: Record<SubscriptionPlan, number | null> = {
  free: 3,
  pro: null,
  max: null,
};

// ─── 주문번호 생성 ────────────────────────────────────────────────
// 형식: OPIN-{userId 앞 8자}-{timestamp}
export function generateOrderId(userId: string): string {
  const prefix = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `OPIN-${prefix}-${Date.now()}`;
}

// ─── 크레딧 트랜잭션 타입 ─────────────────────────────────────────────────────
export type CreditTransactionType = "monthly_grant" | "purchase" | "usage";
export type CreditTransactionSource = "subscription" | "topup" | "survey_generation" | "analysis";
