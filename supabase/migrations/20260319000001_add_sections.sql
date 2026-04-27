-- Survey sections table
-- Sections group related questions within a survey.
-- A survey may have zero sections (flat question list) or multiple.
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow questions to be assigned to a section.
-- NULL means the question is not assigned to any section (backward-compatible).
ALTER TABLE questions ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES sections(id) ON DELETE SET NULL;

-- Index for efficient per-survey section queries
CREATE INDEX IF NOT EXISTS idx_sections_survey_id ON sections(survey_id);

-- Index for efficient per-section question queries
CREATE INDEX IF NOT EXISTS idx_questions_section_id ON questions(section_id);

-- RLS: only the survey creator can manage sections
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sections_owner_all" ON sections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = sections.survey_id
        AND surveys.creator_id = auth.uid()
    )
  );

-- Reuse the existing update_updated_at_column() function (defined in earlier migrations)
CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
