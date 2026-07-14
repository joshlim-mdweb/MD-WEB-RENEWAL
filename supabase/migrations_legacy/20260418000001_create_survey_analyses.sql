-- survey_analyses: stores creator-initiated AI analysis results per survey
CREATE TABLE survey_analyses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id    uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  creator_id   uuid NOT NULL,
  prompt       text NOT NULL,
  sentence     text,
  data_point   jsonb,
  status       text NOT NULL DEFAULT 'processing'
                 CHECK (status IN ('processing', 'done', 'failed')),
  credit_tx_id uuid,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX survey_analyses_survey_id_idx ON survey_analyses(survey_id);
CREATE INDEX survey_analyses_creator_id_idx ON survey_analyses(creator_id);
CREATE INDEX survey_analyses_created_at_idx ON survey_analyses(created_at DESC);

ALTER TABLE survey_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator can manage own analyses"
  ON survey_analyses
  FOR ALL
  USING (creator_id = auth.uid());
