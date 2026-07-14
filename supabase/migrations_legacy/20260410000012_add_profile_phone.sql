-- =============================================================================
-- Migration: 20260410000012_add_profile_phone
-- Purpose  : profile 테이블에 phone 컬럼 추가
--            기프티콘 발송 대상 전화번호 (카카오톡 등록 번호)
--            형식: 010-XXXX-XXXX (검증은 앱 레이어에서 수행)
-- =============================================================================

ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS phone text;

-- 전화번호 형식 제약 (010-XXXX-XXXX)
-- NULL 허용 — 기프티콘 전환 시점에 입력 유도
ALTER TABLE public.profile
  ADD CONSTRAINT profile_phone_format_check
  CHECK (
    phone IS NULL
    OR phone ~ '^010-\d{4}-\d{4}$'
  );
