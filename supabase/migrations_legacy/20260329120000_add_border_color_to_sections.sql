-- Migration: add border_color to sections
ALTER TABLE sections
  ADD COLUMN IF NOT EXISTS border_color VARCHAR(7);
