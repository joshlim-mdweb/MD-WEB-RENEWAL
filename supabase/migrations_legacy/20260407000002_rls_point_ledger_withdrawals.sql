-- RLS for point_ledger and withdrawals
-- Security audit finding: both tables lacked row-level security
-- point_ledger.payout_info contains financial PII (bank account info)

ALTER TABLE public.point_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "point_ledger: user read own"
  ON public.point_ledger FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- service_role bypasses RLS by default, but explicit policy for clarity
CREATE POLICY "point_ledger: service role all"
  ON public.point_ledger FOR ALL TO service_role
  USING (true) WITH CHECK (true);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawals: user read own"
  ON public.withdrawals FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "withdrawals: user insert own"
  ON public.withdrawals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawals: service role all"
  ON public.withdrawals FOR ALL TO service_role
  USING (true) WITH CHECK (true);
