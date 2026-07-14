-- =============================================================================
-- Migration: 20260410000011_add_gifticon_redemptions
-- Purpose  : 기프티콘 전환 내역 테이블 생성
--            - 포인트 차감(point_ledger) ↔ 전환 요청(gifticon_redemptions) 연결
--            - 센드비 발송 상태 추적 (pending → sent | failed)
--            - RLS: 본인(user_id = auth.uid()) 행만 SELECT/INSERT 가능
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.gifticon_redemptions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id       uuid        NOT NULL REFERENCES public.gifticon_products (id),
  -- 차감된 point_ledger 행 참조 — 롤백(reversed) 시 업데이트 대상
  point_ledger_id  uuid        REFERENCES public.point_ledger (id),
  phone            text        NOT NULL,
  sendbee_order_id text,
  -- pending: 센드비 호출 전 / sent: 발송 완료 / failed: 발송 실패
  status           text        NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at          timestamptz,
  failed_reason    text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- 사용자의 전환 내역 조회에 사용 (내림차순 정렬)
CREATE INDEX IF NOT EXISTS idx_gifticon_redemptions_user_id
  ON public.gifticon_redemptions (user_id, created_at DESC);

-- RLS
ALTER TABLE public.gifticon_redemptions ENABLE ROW LEVEL SECURITY;

-- 본인 행만 조회 가능
CREATE POLICY "gifticon_redemptions: user read own"
  ON public.gifticon_redemptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 본인 행만 INSERT 가능 (user_id가 auth.uid()여야 함)
CREATE POLICY "gifticon_redemptions: user insert own"
  ON public.gifticon_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 센드비 콜백/내부 상태 업데이트는 service_role 전용
CREATE POLICY "gifticon_redemptions: service role all"
  ON public.gifticon_redemptions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
