-- Migration: 20260331000002_add_reward_amount_to_surveys
-- Purpose  : Add reward_amount to surveys so creators can attach a point reward
--            to survey completion. When a user submits a response and reward_amount > 0,
--            the API inserts a point_ledger row with status='pending'.
--
-- Cost note: 1 nullable integer column — zero impact on read performance.
--            No index needed; reward_amount is only read at response-submit time
--            (not used in WHERE clauses).

ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS reward_amount integer CHECK (reward_amount IS NULL OR reward_amount >= 0);

-- NULL means no reward. 0 is technically allowed but treated the same as NULL by the API.
-- Creators set this via the survey settings panel (not yet built — value defaults to NULL).
