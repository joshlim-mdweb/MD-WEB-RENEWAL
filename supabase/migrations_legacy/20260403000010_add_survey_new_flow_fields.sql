-- Migration: 20260403000010_add_survey_new_flow_fields
-- Purpose  : Support 3-step survey creation flow (survey/new page + CompensationPanel).
--
-- Fields added:
--   target_participant_count : goal respondent count — reward pays out when met (10 | 30 | 50)
--   thumbnail_url            : preset thumbnail path (e.g. /thumbnails/preset-1.svg)
--   reward_type              : 'none' | 'first_come' | 'random' (see API for combo rules)
--   reward_winner_count      : winners for random tier (10 or 5), null for first_come/none
--
-- Note: reward_amount already exists (migration 20260331000002).
--       max_responses does not exist yet — added here as well.

ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS target_participant_count integer
    CHECK (target_participant_count IS NULL OR target_participant_count IN (10, 30, 50)),
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS reward_type text
    CHECK (reward_type IS NULL OR reward_type IN ('none', 'first_come', 'random'))
    DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS reward_winner_count integer
    CHECK (reward_winner_count IS NULL OR reward_winner_count > 0),
  ADD COLUMN IF NOT EXISTS max_responses integer
    CHECK (max_responses IS NULL OR max_responses > 0);
