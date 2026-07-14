-- Migration: add_participation_tracking
-- Adds started_at to responses for avg completion time tracking
-- Adds estimated_time and max_participants to surveys

ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS started_at timestamptz;

ALTER TABLE surveys
  ADD COLUMN IF NOT EXISTS estimated_time integer; -- minutes, nullable
ALTER TABLE surveys
  ADD COLUMN IF NOT EXISTS max_participants integer; -- nullable, null = unlimited
