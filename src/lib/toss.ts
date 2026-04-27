// TossPayments 설정 & 상수
// stripe.ts를 대체한다.

export type SubscriptionPlan = "free" | "pro" | "max";
export type SubscriptionStatus = "active" | "canceled" | "past_due";
export type OrderType = "subscription_pro" | "subscription_max" | "credits_pro" | "credits_max";
export type OrderStatus = "created" | "pending" | "paid" | "failed" | "canceled";

// ─── 플랜 구독 가격 ───────────────────────────────────────────────
// KRW 단가. 변경 시 여기만 수정.
export const PLAN_PRICES: Record<"pro" | "max", { amount: number; orderName: string }> = {
  pro: { amount: 19000, orderName: "OPINION Pro" },
  max: { amount: 39000, orderName: "OPINION Max" },
};

// ─── 크레딧 추가 구매 가격 ────────────────────────────────────────
export const CREDIT_PRICES: Record<"pro" | "max", { amount: number; credits: number }> = {
  pro: { amount: 8000, credits: 100 },
  max: { amount: 7000, credits: 100 },
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

// ─── TossPayments API 기본 요청 헬퍼 ─────────────────────────────
// 서버사이드 전용. TOSS_SECRET_KEY 필요.
export function tossApiHeaders(): HeadersInit {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new Error("TOSS_SECRET_KEY is not set");
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
    "Content-Type": "application/json",
  };
}

export const TOSS_API_BASE = "https://api.tosspayments.com/v1";

// ─── 크레딧 트랜잭션 타입 ─────────────────────────────────────────────────────
export type CreditTransactionType = "monthly_grant" | "purchase" | "usage";
export type CreditTransactionSource = "subscription" | "topup" | "survey_generation" | "analysis";
