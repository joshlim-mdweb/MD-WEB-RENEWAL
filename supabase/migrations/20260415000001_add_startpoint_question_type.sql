-- =============================================================================
-- Migration: 20260415000001_add_startpoint_question_type
-- Purpose  : Add 'startpoint' to the questions.type CHECK constraint.
--            startpoint is a pinned, non-deletable node that represents the
--            survey entry screen. section_id is NULL for these nodes.
-- =============================================================================

-- The original CHECK constraint on questions.type was added inline in the
-- CREATE TABLE statement (no named constraint).  We need to find the system-
-- generated name and drop it, then recreate with 'startpoint' included.
--
-- Strategy: drop the unnamed constraint by introspecting pg_constraint, then
-- add a new named constraint so future migrations can reference it by name.

DO $$
DECLARE
  v_constraint_name text;
BEGIN
  SELECT conname
    INTO v_constraint_name
    FROM pg_constraint
   WHERE conrelid = 'public.questions'::regclass
     AND contype = 'c'
     AND pg_get_constraintdef(oid) LIKE '%multiple_choice%'
  LIMIT 1;

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.questions DROP CONSTRAINT %I', v_constraint_name);
  END IF;
END $$;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_type_check
  CHECK (type IN (
    'multiple_choice',
    'short_text',
    'long_text',
    'scale',
    'grade',
    'checkbox',
    'dropdown',
    'ranking',
    'startpoint',
    'endpoint'
  ));
