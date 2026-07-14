-- Groups confirmed reward_eligibility rows into a single payout batch
-- for bulk payment processing.
CREATE TABLE payout_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES reward_budgets(id),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  total_recipients INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ready', 'requested', 'partially_paid', 'paid', 'failed', 'closed')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;

-- Only the service role (admin APIs) can access this table.
CREATE POLICY "service role only"
  ON payout_batches FOR ALL USING (false);

CREATE TRIGGER set_payout_batches_updated_at
  BEFORE UPDATE ON payout_batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
