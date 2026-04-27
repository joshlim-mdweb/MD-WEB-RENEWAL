-- =============================================================================
-- Migration: 20260410000010_add_gifticon_products
-- Purpose  : 기프티콘 상품 목록 테이블 생성 + MVP 시드 데이터
--            플랫폼이 큐레이션한 상품 목록 — 관리자가 직접 관리.
--            RLS: 인증된 모든 유저 SELECT 가능, INSERT/UPDATE는 service_role만.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.gifticon_products (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text        NOT NULL,
  brand                text        NOT NULL,
  face_value           int         NOT NULL CHECK (face_value > 0),
  point_cost           int         NOT NULL CHECK (point_cost > 0),
  -- 센드비 B2B API 상품 코드 (계약 완료 후 채워넣음)
  sendbee_product_code text,
  is_active            boolean     NOT NULL DEFAULT true,
  image_url            text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gifticon_products_is_active
  ON public.gifticon_products (is_active)
  WHERE is_active = true;

-- RLS
ALTER TABLE public.gifticon_products ENABLE ROW LEVEL SECURITY;

-- 인증된 모든 유저가 활성 상품 목록 조회 가능
CREATE POLICY "gifticon_products: authenticated read active"
  ON public.gifticon_products FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 관리/배포는 service_role 전용
CREATE POLICY "gifticon_products: service role all"
  ON public.gifticon_products FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- =============================================================================
-- MVP 시드 데이터 (5개 큐레이션 상품)
-- face_value = 원화 금액, point_cost = 차감 포인트 (1:1 매핑)
-- =============================================================================

INSERT INTO public.gifticon_products (name, brand, face_value, point_cost, is_active)
VALUES
  ('GS25 금액권',         'GS25',   1000,  1000,  true),
  ('CU 금액권',           'CU',     1000,  1000,  true),
  ('배달의민족 금액권',   '배민',   5000,  5000,  true),
  ('배달의민족 금액권',   '배민',   10000, 10000, true),
  ('스타벅스 아메리카노', '스타벅스', 5500, 5500, true);
