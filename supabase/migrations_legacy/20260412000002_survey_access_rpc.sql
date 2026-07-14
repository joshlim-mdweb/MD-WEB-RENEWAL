-- Atomically enforces the "5 surveys/day free, then 500P per additional" policy.
-- Called inside the survey respond route before inserting a response row.
-- Raises INSUFFICIENT_POINTS so the API layer can return HTTP 402.
CREATE OR REPLACE FUNCTION spend_survey_access_points(
  p_user_id UUID,
  p_survey_id UUID
) RETURNS void AS $$
DECLARE
  v_today_count INTEGER;
  v_available_sum BIGINT;
BEGIN
  -- Count responses submitted today in KST (UTC+9)
  SELECT COUNT(*) INTO v_today_count
  FROM responses
  WHERE user_id = p_user_id
    AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::DATE
    AND created_at < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::DATE + INTERVAL '1 day';

  -- First 5 per day are free — no deduction
  IF v_today_count <= 4 THEN
    RETURN;
  END IF;

  -- Tally available balance
  SELECT COALESCE(SUM(amount), 0) INTO v_available_sum
  FROM point_ledger
  WHERE user_id = p_user_id AND status = 'available';

  IF v_available_sum < 500 THEN
    RAISE EXCEPTION 'INSUFFICIENT_POINTS';
  END IF;

  -- Deduct 500P as a spent entry
  INSERT INTO point_ledger (user_id, source_type, source_id, amount, status)
  VALUES (p_user_id, 'survey_access', p_survey_id, -500, 'spent');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
