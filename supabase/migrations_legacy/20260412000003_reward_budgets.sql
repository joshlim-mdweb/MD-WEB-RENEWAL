-- Stores the reward budget a survey creator configures before publishing.
-- One budget per survey (UNIQUE constraint enforced).
CREATE TABLE reward_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  per_response_amount INTEGER NOT NULL CHECK (per_response_amount >= 100),
  max_recipients INTEGER NOT NULL CHECK (max_recipients > 0),
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'payment_pending', 'paid', 'payment_failed', 'cancelled')),
  payment_ref TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(survey_id)
);

ALTER TABLE reward_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator can manage own budget"
  ON reward_budgets FOR ALL
  USING (creator_id = auth.uid());

CREATE TRIGGER set_reward_budgets_updated_at
  BEFORE UPDATE ON reward_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
