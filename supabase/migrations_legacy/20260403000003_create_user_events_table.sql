CREATE TABLE IF NOT EXISTS user_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_name ON user_events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert events" ON user_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Service role can read all events" ON user_events FOR SELECT TO service_role USING (true);
