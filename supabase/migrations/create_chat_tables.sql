-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL
    CHECK (char_length(room_id) <= 64)
    CHECK (room_id ~ '^[a-z0-9_-]+$'),
  username TEXT NOT NULL
    CHECK (char_length(username) <= 64),
  message TEXT NOT NULL
    CHECK (char_length(message) <= 2000),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_moderated BOOLEAN DEFAULT FALSE NOT NULL
);

-- Index for fast room queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages" ON chat_messages
  FOR SELECT USING (true);

-- Allow authenticated or anonymous users to insert
CREATE POLICY "Anyone can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Enable Realtime (idempotent: only adds if not already in the publication)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END
$$;
