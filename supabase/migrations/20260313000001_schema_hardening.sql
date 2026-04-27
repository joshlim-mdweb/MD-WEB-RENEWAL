-- =============================================================================
-- Migration: 20260313000001_schema_hardening
-- Purpose  : Close all gaps identified in the production schema review.
--            Covers: indexes, profile RLS, anon response path, survey_shares,
--            questions.updated_at, partial unique constraint for responses,
--            and profile table FK alignment.
-- Cost note: All changes are DDL — zero additional read/write cost at runtime.
--            Indexes add ~1 write overhead per INSERT/UPDATE, which is trivially
--            justified by the massive read savings on every survey load.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. INDEXES
--    All FK columns that are used in WHERE / JOIN clauses need btree indexes.
--    Without these, every survey load does a full seq-scan on `questions`,
--    every response submission does a full seq-scan on `answers`.
-- -----------------------------------------------------------------------------

-- questions.survey_id: used in every builder load and published survey render
CREATE INDEX IF NOT EXISTS idx_questions_survey_id
  ON public.questions (survey_id);

-- questions.order_index: used in ORDER BY on every survey load
CREATE INDEX IF NOT EXISTS idx_questions_survey_id_order
  ON public.questions (survey_id, order_index);

-- responses.survey_id: used when creator reads all responses for a survey
CREATE INDEX IF NOT EXISTS idx_responses_survey_id
  ON public.responses (survey_id);

-- responses.user_id: used in RLS policy evaluation (user reads own responses)
CREATE INDEX IF NOT EXISTS idx_responses_user_id
  ON public.responses (user_id)
  WHERE user_id IS NOT NULL;

-- answers.response_id: used in every answer fetch (joined from responses)
CREATE INDEX IF NOT EXISTS idx_answers_response_id
  ON public.answers (response_id);

-- answers.question_id: used in analytics — "all answers for question X"
CREATE INDEX IF NOT EXISTS idx_answers_question_id
  ON public.answers (question_id);

-- surveys.creator_id: used in every builder list page (GET /api/surveys)
CREATE INDEX IF NOT EXISTS idx_surveys_creator_id
  ON public.surveys (creator_id);

-- surveys.status: used in RLS "public read published" and analytics filters
CREATE INDEX IF NOT EXISTS idx_surveys_status
  ON public.surveys (status);


-- -----------------------------------------------------------------------------
-- 2. FIX: responses unique constraint
--    The existing `responses_user_id_survey_id_key` unique index fires even when
--    user_id IS NULL, causing a unique violation on the second anon submission
--    to the same survey (NULL = NULL in unique indexes).
--    Replace with a partial unique index that only enforces uniqueness for
--    authenticated users — one auth'd response per user per survey.
-- -----------------------------------------------------------------------------

ALTER TABLE public.responses
  DROP CONSTRAINT IF EXISTS responses_user_id_survey_id_key;

-- Drop the old unique index if it was created as an index (not a constraint)
DROP INDEX IF EXISTS public.responses_user_id_survey_id_key;

CREATE UNIQUE INDEX responses_auth_user_survey_unique
  ON public.responses (user_id, survey_id)
  WHERE user_id IS NOT NULL;


-- -----------------------------------------------------------------------------
-- 3. ADD: questions.updated_at
--    Required for cache invalidation, AI re-generation checks, and ETags.
--    Default to created_at so existing rows are valid.
-- -----------------------------------------------------------------------------

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Back-fill existing rows: set updated_at = created_at
UPDATE public.questions
  SET updated_at = created_at
  WHERE updated_at = now() AND created_at < now();

-- Trigger: keep updated_at current on every UPDATE (mirrors surveys behaviour)
CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_questions_updated_at ON public.questions;
CREATE TRIGGER trg_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Apply the same auto-update trigger to surveys (currently relies on app-level
-- manual updated_at writes — the trigger makes it reliable).
DROP TRIGGER IF EXISTS trg_surveys_updated_at ON public.surveys;
CREATE TRIGGER trg_surveys_updated_at
  BEFORE UPDATE ON public.surveys
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 4. ADD: profile FK to auth.users + constraint on status
--    The profile.uuid column is the bridge to auth.users but has no FK.
--    Adding the FK ensures orphan profiles cannot exist.
--    Also constrain profile.status to known values.
-- -----------------------------------------------------------------------------

-- FK: profile.uuid → auth.users.id
-- ON DELETE CASCADE: when the auth user is deleted, their profile row goes too.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profile_uuid_fkey'
      AND table_name = 'profile'
  ) THEN
    ALTER TABLE public.profile
      ADD CONSTRAINT profile_uuid_fkey
      FOREIGN KEY (uuid) REFERENCES auth.users (id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Constrain profile.status to known values
ALTER TABLE public.profile
  DROP CONSTRAINT IF EXISTS profile_status_check;

ALTER TABLE public.profile
  ADD CONSTRAINT profile_status_check
  CHECK (status IN ('active', 'suspended', 'deleted'));


-- -----------------------------------------------------------------------------
-- 5. NEW TABLE: survey_shares
--    Enables survey sharing via a short token — required for anonymous
--    respondents who arrive from a shared link (no auth required).
--
--    Design decisions:
--    - token is a random text slug (nanoid-style, 12 chars) — not the survey UUID.
--      Using a separate token means we can revoke/rotate the share link without
--      changing the survey id.
--    - expires_at is nullable — NULL means no expiry (simplest case for MVP).
--    - max_responses is nullable — NULL means unlimited.
--    - response_count is a denormalised counter maintained by trigger to avoid
--      COUNT(*) on every page load.
--
--    Cost note: 1 read on every survey open (to validate token is active).
--               The token lookup is indexed. Response count is maintained in-row
--               to avoid an aggregate read.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.survey_shares (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id       uuid        NOT NULL REFERENCES public.surveys (id) ON DELETE CASCADE,
  token           text        NOT NULL UNIQUE,
  -- Optional access controls
  expires_at      timestamptz,
  max_responses   integer     CHECK (max_responses IS NULL OR max_responses > 0),
  -- Denormalised counter — avoids COUNT(*) on responses for every share-link load
  response_count  integer     NOT NULL DEFAULT 0 CHECK (response_count >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  -- Only the survey creator creates shares — stored for auditing
  created_by      uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Index for token lookup (the hot path: every anonymous survey open)
CREATE INDEX IF NOT EXISTS idx_survey_shares_token
  ON public.survey_shares (token);

-- Index for creator listing all shares for their survey
CREATE INDEX IF NOT EXISTS idx_survey_shares_survey_id
  ON public.survey_shares (survey_id);

-- Trigger: increment response_count on survey_shares when a response is inserted
-- that was submitted via a share token. The share token is passed through the
-- responses.share_id column (added below).
--
-- This avoids a separate UPDATE round-trip from the application layer.
CREATE OR REPLACE FUNCTION public.increment_share_response_count()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.share_id IS NOT NULL THEN
    UPDATE public.survey_shares
      SET response_count = response_count + 1
      WHERE id = NEW.share_id;
  END IF;
  RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- 6. ADD: responses.share_id
--    Links an anonymous (or authenticated) response back to the share token
--    that was used to access the survey. Nullable — direct authenticated access
--    does not require a share token.
--    Also adds respondent_ip and respondent_ua for basic abuse prevention.
-- -----------------------------------------------------------------------------

ALTER TABLE public.responses
  ADD COLUMN IF NOT EXISTS share_id       uuid        REFERENCES public.survey_shares (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS respondent_ip  inet,
  ADD COLUMN IF NOT EXISTS respondent_ua  text;

-- Index for "all responses via a given share token" (creator analytics)
CREATE INDEX IF NOT EXISTS idx_responses_share_id
  ON public.responses (share_id)
  WHERE share_id IS NOT NULL;

-- Wire up the response_count trigger now that responses.share_id exists
DROP TRIGGER IF EXISTS trg_responses_share_count ON public.responses;
CREATE TRIGGER trg_responses_share_count
  AFTER INSERT ON public.responses
  FOR EACH ROW EXECUTE FUNCTION public.increment_share_response_count();


-- =============================================================================
-- End of structural changes.
-- RLS policies are in the next migration file (20260313000002_rls_policies.sql).
-- =============================================================================
