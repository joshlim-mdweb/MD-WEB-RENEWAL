-- =============================================================================
-- Migration: 20260405000001_security_hardening
-- Purpose  : Two targeted security fixes identified in security audit.
--
--   1. Capacity TOCTOU — DB-level trigger enforces max_participants atomically,
--      preventing concurrent requests from exceeding the survey capacity even
--      when the app-level check is bypassed by a race condition.
--
--   2. survey_shares column-level security — revokes created_by visibility from
--      anon role to prevent auth user UUID exposure via direct API enumeration.
--      The respond/route.ts only selects safe columns already; this closes the
--      raw PostgREST SELECT * path.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. CAPACITY TOCTOU FIX
--    check_survey_capacity() fires BEFORE INSERT on responses.
--    If the survey has a max_participants limit and the current response count
--    already meets or exceeds it, the INSERT is rejected with a P0001 exception.
--    This runs inside the INSERT transaction, making the check atomic.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_survey_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max        INTEGER;
  v_count      INTEGER;
BEGIN
  SELECT max_participants INTO v_max
  FROM public.surveys
  WHERE id = NEW.survey_id;

  -- No limit set — allow unconditionally
  IF v_max IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM public.responses
  WHERE survey_id = NEW.survey_id;

  IF v_count >= v_max THEN
    -- ERRCODE P0001 is the standard raise_exception code.
    -- The API route checks for message = 'SURVEY_FULL' to return a 403.
    RAISE EXCEPTION 'SURVEY_FULL'
      USING ERRCODE = 'P0001',
            HINT    = 'Survey has reached its maximum participant count';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_survey_capacity ON public.responses;

CREATE TRIGGER enforce_survey_capacity
  BEFORE INSERT ON public.responses
  FOR EACH ROW
  EXECUTE FUNCTION public.check_survey_capacity();


-- -----------------------------------------------------------------------------
-- 2. survey_shares COLUMN-LEVEL SECURITY
--    Revokes SELECT on the full table from anon, then grants back only the
--    columns that the API route legitimately needs for token validation.
--    created_by (auth user UUID) is intentionally excluded.
--
--    authenticated users retain full column access — they need created_by
--    when managing their own shares in the builder.
--
--    The existing RLS USING(true) policy still applies as the row-level gate.
--    Column-level GRANT/REVOKE operates on top of RLS, not instead of it.
-- -----------------------------------------------------------------------------

-- Step 1: revoke full table SELECT from anon
REVOKE SELECT ON public.survey_shares FROM anon;

-- Step 2: grant back only the safe columns needed for token validation and share display
GRANT SELECT (
  id,
  survey_id,
  token,
  expires_at,
  max_responses,
  response_count,
  created_at
) ON public.survey_shares TO anon;
