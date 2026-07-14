-- poll_comments 테이블
CREATE TABLE poll_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id    uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id  uuid REFERENCES poll_comments(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (char_length(content) <= 500),
  upvotes    int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- poll_comment_votes 테이블 (중복 vote 방지)
CREATE TABLE poll_comment_votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES poll_comments(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote       smallint NOT NULL CHECK (vote IN (1, -1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);

-- 인덱스
CREATE INDEX idx_poll_comments_poll_id_created_at ON poll_comments (poll_id, created_at DESC);
CREATE INDEX idx_poll_comments_parent_id ON poll_comments (parent_id);
CREATE INDEX idx_poll_comment_votes_comment_id ON poll_comment_votes (comment_id);

-- updated_at 자동 갱신 (moddatetime extension 사용)
CREATE TRIGGER set_poll_comments_updated_at
  BEFORE UPDATE ON poll_comments
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- RLS 활성화
ALTER TABLE poll_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_comment_votes ENABLE ROW LEVEL SECURITY;

-- poll_comments RLS
CREATE POLICY "poll_comments_select_all"
  ON poll_comments FOR SELECT
  USING (true);

CREATE POLICY "poll_comments_insert_own"
  ON poll_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "poll_comments_delete_own"
  ON poll_comments FOR DELETE
  USING (auth.uid() = user_id);

-- poll_comment_votes RLS
CREATE POLICY "poll_comment_votes_select_all"
  ON poll_comment_votes FOR SELECT
  USING (true);

CREATE POLICY "poll_comment_votes_insert_own"
  ON poll_comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "poll_comment_votes_update_own"
  ON poll_comment_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "poll_comment_votes_delete_own"
  ON poll_comment_votes FOR DELETE
  USING (auth.uid() = user_id);
