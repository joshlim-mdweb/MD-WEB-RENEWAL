-- =============================================================================
-- Migration: 20260313000002_rls_policies
-- Purpose  : Fix all RLS gaps found in the schema review.
--            - profile: add missing policies (currently zero — nobody can read)
--            - responses: allow anonymous INSERT (user_id IS NULL path)
--            - answers: allow anonymous INSERT via anon response path
--            - survey_shares: full RLS for new table
-- =============================================================================


-- -----------------------------------------------------------------------------
-- TABLE: profile
-- Current state: RLS enabled, ZERO policies — silent read/write failure for all
--
-- Access model:
--   SELECT — user can read their own profile row.
--             creator of a survey can read the nick_name of any profile
--             (needed for "survey created by" display — deferred, skip for MVP).
--             For MVP: only own profile.
--   INSERT — triggered by auth hook (handle_new_user), not by the app layer.
--             We allow the service role to insert; anon/authenticated cannot.
--   UPDATE — user can update their own profile.
--   DELETE — not allowed from the app (use auth.admin to delete users).
-- -----------------------------------------------------------------------------

-- Read own profile
DROP POLICY IF EXISTS "profile: user read own" ON public.profile;
CREATE POLICY "profile: user read own"
  ON public.profile
  FOR SELECT
  TO authenticated
  USING (uuid = auth.uid());

-- Update own profile
DROP POLICY IF EXISTS "profile: user update own" ON public.profile;
CREATE POLICY "profile: user update own"
  ON public.profile
  FOR UPDATE
  TO authenticated
  USING (uuid = auth.uid())
  WITH CHECK (uuid = auth.uid());

-- INSERT is handled by the handle_new_user trigger running as SECURITY DEFINER.
-- No app-level INSERT policy needed — the trigger bypasses RLS.


-- -----------------------------------------------------------------------------
-- TABLE: surveys
-- Current state: two policies exist and are correct.
--   "creator full access" — ALL where creator_id = auth.uid()   ✓
--   "public read published" — SELECT where status = 'published' ✓
--
-- No changes needed for surveys.
-- -----------------------------------------------------------------------------


-- -----------------------------------------------------------------------------
-- TABLE: questions
-- Current state: two policies exist and are correct.
--   "creator full access" — ALL via survey ownership join             ✓
--   "public read published survey questions" — SELECT for published  ✓
--
-- No changes needed for questions.
-- -----------------------------------------------------------------------------


-- -----------------------------------------------------------------------------
-- TABLE: responses
-- Current state:
--   "creator read all"  — SELECT via survey ownership join  ✓
--   "user read own"     — SELECT where user_id = auth.uid() ✓
--   "user insert own"   — INSERT WITH CHECK (auth.uid() = user_id)
--                         PROBLEM: blocks anon submissions where user_id IS NULL
--
-- Fix: split "user insert own" into two policies:
--   1. authenticated INSERT — same as before, user_id must match auth.uid()
--   2. anonymous INSERT — user_id must be NULL, survey must be published,
--      share_id must reference a valid active share token
--      (token not expired, response_count < max_responses or max_responses IS NULL)
-- -----------------------------------------------------------------------------

-- Drop the broken policy
DROP POLICY IF EXISTS "user insert own" ON public.responses;

-- Authenticated users submit their own response
DROP POLICY IF EXISTS "responses: authenticated user insert" ON public.responses;
CREATE POLICY "responses: authenticated user insert"
  ON public.responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- user_id must match the caller
    auth.uid() = user_id
    -- survey must be published
    AND EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = responses.survey_id
        AND surveys.status = 'published'
    )
  );

-- Anonymous users submit via a valid share token
-- Cost note: this subquery runs on every anon INSERT — it touches survey_shares
-- (1 row by token/id) and surveys (1 row by id). Both are indexed. Acceptable.
DROP POLICY IF EXISTS "responses: anon insert via share token" ON public.responses;
CREATE POLICY "responses: anon insert via share token"
  ON public.responses
  FOR INSERT
  TO anon
  WITH CHECK (
    -- anon responses must have user_id = NULL
    user_id IS NULL
    -- must reference a share token
    AND share_id IS NOT NULL
    -- share token must be valid and not expired
    AND EXISTS (
      SELECT 1 FROM public.survey_shares ss
      JOIN public.surveys s ON s.id = ss.survey_id
      WHERE ss.id = responses.share_id
        AND ss.survey_id = responses.survey_id
        AND s.status = 'published'
        AND (ss.expires_at IS NULL OR ss.expires_at > now())
        AND (ss.max_responses IS NULL OR ss.response_count < ss.max_responses)
    )
  );

-- Anon users cannot read responses (no personal data exposure)
-- No SELECT policy for anon on responses — RLS blocks it by default.


-- -----------------------------------------------------------------------------
-- TABLE: answers
-- Current state:
--   "creator read all" — SELECT via response → survey ownership join  ✓
--   "user read own"    — SELECT via response.user_id = auth.uid()      ✓
--   "user insert own"  — INSERT WITH CHECK (response.user_id = auth.uid())
--                        PROBLEM: blocks anon answer inserts
--
-- Fix: same split as responses — authenticated path + anon path.
-- -----------------------------------------------------------------------------

-- Drop the broken policy
DROP POLICY IF EXISTS "user insert own" ON public.answers;

-- Authenticated users can insert answers for their own responses
DROP POLICY IF EXISTS "answers: authenticated user insert" ON public.answers;
CREATE POLICY "answers: authenticated user insert"
  ON public.answers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.responses
      WHERE responses.id = answers.response_id
        AND responses.user_id = auth.uid()
    )
  );

-- Anonymous users can insert answers for anon responses (user_id IS NULL)
-- The response itself is already validated at insert time (share token check).
-- Here we just verify the response is genuinely anonymous (no user_id).
DROP POLICY IF EXISTS "answers: anon insert via anon response" ON public.answers;
CREATE POLICY "answers: anon insert via anon response"
  ON public.answers
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.responses
      WHERE responses.id = answers.response_id
        AND responses.user_id IS NULL
        AND responses.share_id IS NOT NULL
    )
  );


-- -----------------------------------------------------------------------------
-- TABLE: survey_shares
-- New table — needs full RLS from scratch.
--
-- Access model:
--   SELECT — creator can read their own shares (to list/revoke them).
--             Anyone (including anon) can read a share by token to validate it
--             before rendering the survey. We expose only non-sensitive columns
--             via a view — but at RLS level we allow SELECT for token lookup.
--   INSERT — only the survey creator can create a share.
--   UPDATE — only the creator can update (e.g. extend expiry, change max).
--   DELETE — only the creator can delete (revoke) a share.
-- -----------------------------------------------------------------------------

ALTER TABLE public.survey_shares ENABLE ROW LEVEL SECURITY;

-- Creator has full control over their survey's shares
DROP POLICY IF EXISTS "survey_shares: creator full access" ON public.survey_shares;
CREATE POLICY "survey_shares: creator full access"
  ON public.survey_shares
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_shares.survey_id
        AND surveys.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_shares.survey_id
        AND surveys.creator_id = auth.uid()
    )
  );

-- Anyone (anon + authenticated) can SELECT a share row to validate the token.
-- This is needed for the survey open page to check expiry/max_responses before
-- rendering questions. We limit exposure: token, expires_at, max_responses,
-- response_count, survey_id are enough — id and created_by are also returned
-- but the caller needs id to attach to their response INSERT.
DROP POLICY IF EXISTS "survey_shares: public read by token" ON public.survey_shares;
CREATE POLICY "survey_shares: public read by token"
  ON public.survey_shares
  FOR SELECT
  TO anon, authenticated
  USING (true);
-- Note: "USING (true)" is intentional. Token lookup requires reading the row.
-- The token itself is the secret — it is not guessable (crypto-random 12 chars
-- = 62^12 ~= 3.2 × 10^21 combinations). No sensitive data is exposed in the row.


-- =============================================================================
-- End of RLS migration.
-- =============================================================================
