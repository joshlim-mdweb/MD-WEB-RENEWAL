-- ─────────────────────────────────────────────────────────────────────────────
-- TossPayments 연동을 위한 Stripe → Toss 전환 마이그레이션
-- 2026-04-13
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── orders 테이블 신규 ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_type       TEXT NOT NULL CHECK (
                     order_type IN ('subscription_pro', 'subscription_max', 'credits_pro', 'credits_max')
                   ),
  amount           INTEGER NOT NULL CHECK (amount > 0),
  status           TEXT NOT NULL DEFAULT 'created' CHECK (
                     status IN ('created', 'pending', 'paid', 'failed', 'canceled')
                   ),
  toss_order_id    TEXT NOT NULL UNIQUE,   -- OPIN-XXXXXXXX-timestamp
  toss_payment_key TEXT,                  -- 토스 승인 후 발급
  toss_response    JSONB,                 -- 토스 Payment 객체 원본 보존
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_toss_order_id_idx ON orders (toss_order_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- updated_at 자동 갱신
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── billing_keys 테이블 신규 (자동갱신용 카드 등록) ────────────────────────
CREATE TABLE IF NOT EXISTS billing_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  billing_key  TEXT NOT NULL,
  card_company TEXT,
  card_number  TEXT,       -- 마스킹된 번호 (표시용: **** **** **** 1234)
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS billing_keys_user_id_idx ON billing_keys (user_id);
CREATE INDEX IF NOT EXISTS billing_keys_active_idx ON billing_keys (user_id, is_active);

ALTER TABLE billing_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can view own billing keys"
  ON billing_keys FOR SELECT USING (auth.uid() = user_id);

-- ─── subscriptions 테이블: Stripe 컬럼 제거 → Toss 컬럼 추가 ─────────────────
ALTER TABLE subscriptions
  DROP COLUMN IF EXISTS stripe_subscription_id,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS current_period_start,
  DROP COLUMN IF EXISTS current_period_end,
  ADD COLUMN IF NOT EXISTS billing_key_id UUID REFERENCES billing_keys(id),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
