-- ============================================================
-- Migration: Subscription, AI credits, and profile plan column
-- Tables: subscriptions, ai_credits, ai_credit_transactions
-- profile: add plan column
-- ============================================================

-- 1. profile 테이블에 plan 컬럼 추가
ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'max'));

-- 2. subscriptions 테이블
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'max')),
  status                 TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id     TEXT,
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON public.subscriptions(stripe_customer_id);

-- 3. ai_credits 테이블 (user 1행 = 잔량)
CREATE TABLE IF NOT EXISTS public.ai_credits (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance    INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ai_credit_transactions 테이블
CREATE TABLE IF NOT EXISTS public.ai_credit_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 양수: 지급/구매, 음수: 차감
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('monthly_grant', 'purchase', 'usage')),
  source     TEXT NOT NULL CHECK (source IN (
               'subscription', 'topup', 'survey_generation', 'analysis'
             )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_credit_transactions_user_id_idx
  ON public.ai_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS ai_credit_transactions_created_at_idx
  ON public.ai_credit_transactions(created_at DESC);

-- 5. updated_at 자동 갱신 트리거 (함수가 이미 있으면 재사용)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_ai_credits_updated_at ON public.ai_credits;
CREATE TRIGGER set_ai_credits_updated_at
  BEFORE UPDATE ON public.ai_credits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- RLS 정책
-- ============================================================

-- subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ai_credits
ALTER TABLE public.ai_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_credits_select_own"
  ON public.ai_credits FOR SELECT
  USING (auth.uid() = user_id);

-- ai_credit_transactions
ALTER TABLE public.ai_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_credit_transactions_select_own"
  ON public.ai_credit_transactions FOR SELECT
  USING (auth.uid() = user_id);
