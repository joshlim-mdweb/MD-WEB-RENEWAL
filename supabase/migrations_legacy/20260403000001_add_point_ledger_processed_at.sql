ALTER TABLE point_ledger ADD COLUMN IF NOT EXISTS processed_at timestamptz;
