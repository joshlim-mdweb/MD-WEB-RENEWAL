-- Tracks per-response reward eligibility after a survey closes.
-- Populated by the close-survey job; reviewed/confirmed by admin.
CREATE TABLE reward_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES reward_budgets(id),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  response_id UUID NOT NULL REFERENCES responses(id),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'disqualified', 'paid', 'failed')),
  disqualify_reason TEXT,
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reward_eligibility ENABLE ROW LEVEL SECURITY;

-- Only the service role (admin APIs) can read/write this table.
CREATE POLICY "service role only"
  ON reward_eligibility FOR ALL USING (false);

CREATE TRIGGER set_reward_eligibility_updated_at
  BEFORE UPDATE ON reward_eligibility
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
