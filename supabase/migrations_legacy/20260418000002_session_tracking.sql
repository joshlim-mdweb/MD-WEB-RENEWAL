-- =============================================================================
-- Migration: 20260418000001_session_tracking
-- Purpose  : Add in-progress session tracking to responses table.
--
--   1. Add responses.status column ('in_progress' | 'completed').
--      Existing rows default to 'completed' — no data migration needed.
--
--   2. Update check_survey_capacity trigger:
--      - Unify to max_responses (canonical column; max_participants is legacy)
--      - Count active slots = completed + in_progress within 30-min TTL
--
--   3. Add cleanup_expired_sessions() utility function.
--      Called by session API (on-read) to purge stale in_progress rows.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. ADD status COLUMN TO responses
--    DEFAULT 'completed' backfills all existing rows without a migration scan.
--    CHECK constraint prevents any value outside the two allowed states.
-- -----------------------------------------------------------------------------

ALTER TABLE public.responses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed'
    CHECK (status IN ('in_progress', 'completed'));

-- Index for efficient TTL cleanup and available-slot counts
CREATE INDEX IF NOT EXISTS responses_status_started_at_idx
  ON public.responses (survey_id, status, started_at);


-- -----------------------------------------------------------------------------
-- 2. TTL CLEANUP FUNCTION
--    Deletes expired in_progress rows (started_at > 30 minutes ago).
--    Called from the session API on each session creation (on-read cleanup).
--    Can also be wired to pg_cron if available.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.responses
    WHERE status = 'in_progress'
      AND started_at < now() - INTERVAL '30 minutes';
END;
$$;


-- -----------------------------------------------------------------------------
-- 3. UPDATE check_survey_capacity TRIGGER FUNCTION
--    Key changes from the original (20260405000001_security_hardening):
--      a) Use max_responses instead of max_participants (canonical column)
--      b) Count only active slots: completed + in_progress within TTL
--         Expired in_progress rows are excluded — they no longer hold a slot.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_survey_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max   INTEGER;
  v_count INTEGER;
BEGIN
  -- max_responses is the canonical hard cap going forward.
  -- max_participants is legacy and no longer checked here.
  SELECT max_responses INTO v_max
    FROM public.surveys
    WHERE id = NEW.survey_id;

  -- No cap set — allow unconditionally
  IF v_max IS NULL THEN
    RETURN NEW;
  END IF;

  -- Active slots = completed responses + in_progress within 30-min TTL.
  -- Expired in_progress rows (started_at older than 30 min) are not counted
  -- because their TTL has lapsed and those slots are freed for new participants.
  SELECT COUNT(*) INTO v_count
    FROM public.responses
    WHERE survey_id = NEW.survey_id
      AND (
        status = 'completed'
        OR (status = 'in_progress' AND started_at > now() - INTERVAL '30 minutes')
      );

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'SURVEY_FULL'
      USING ERRCODE = 'P0001',
            HINT    = 'Survey has reached its maximum participant count';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger remains BEFORE INSERT only — UPDATE (in_progress → completed) does
-- not consume an additional slot, so no capacity re-check is needed.
DROP TRIGGER IF EXISTS enforce_survey_capacity ON public.responses;

CREATE TRIGGER enforce_survey_capacity
  BEFORE INSERT ON public.responses
  FOR EACH ROW
  EXECUTE FUNCTION public.check_survey_capacity();
