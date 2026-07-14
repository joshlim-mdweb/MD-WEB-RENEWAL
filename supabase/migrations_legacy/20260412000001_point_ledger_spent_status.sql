-- Replace 'withdrawn' with 'spent' in the point_ledger status constraint.
-- 'withdrawn' was a legacy status tied to cash withdrawal (deferred to Phase 2).
-- 'spent' covers both gifticon redemption and future access-fee deductions.
ALTER TABLE point_ledger DROP CONSTRAINT IF EXISTS point_ledger_status_check;
ALTER TABLE point_ledger ADD CONSTRAINT point_ledger_status_check
  CHECK (status IN ('earned', 'pending', 'available', 'spent', 'reversed'));
