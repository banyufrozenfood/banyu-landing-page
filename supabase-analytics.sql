-- Banyu Frozen Food — Analytics internal
-- Jalankan setelah supabase-schema.sql di Supabase SQL Editor.

-- Daftarkan email admin secara manual setelah membuat akun Supabase Auth.
-- Contoh: INSERT INTO public.admin_users (email) VALUES ('admin@contoh.com');
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY CHECK (email = lower(email))
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read own membership" ON admin_users;
CREATE POLICY "Admin read own membership" ON admin_users
  FOR SELECT TO authenticated
  USING (email = lower(auth.jwt() ->> 'email'));

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'channel_click')),
  event_name TEXT NOT NULL CHECK (
    char_length(event_name) BETWEEN 1 AND 120 AND
    ((event_type = 'page_view' AND event_name LIKE '/%') OR
     (event_type = 'channel_click' AND event_name IN ('whatsapp', 'gofood', 'grabmart')))
  ),
  page_path TEXT NOT NULL DEFAULT '/' CHECK (char_length(page_path) BETWEEN 1 AND 2048),
  visitor_id TEXT NOT NULL CHECK (visitor_id ~ '^[A-Za-z0-9-]{8,128}$'),
  session_id TEXT NOT NULL CHECK (session_id ~ '^[A-Za-z0-9-]{8,128}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_name_idx ON analytics_events (event_type, event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_idx ON analytics_events (visitor_id, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics events" ON analytics_events;
CREATE POLICY "Public insert analytics events" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    event_type IN ('page_view', 'channel_click') AND
    char_length(event_name) BETWEEN 1 AND 120 AND
    visitor_id ~ '^[A-Za-z0-9-]{8,128}$' AND
    session_id ~ '^[A-Za-z0-9-]{8,128}$' AND
    page_path LIKE '/%' AND char_length(page_path) BETWEEN 1 AND 2048 AND
    ((event_type = 'page_view' AND event_name LIKE '/%') OR
     (event_type = 'channel_click' AND event_name IN ('whatsapp', 'gofood', 'grabmart')))
  );

DROP POLICY IF EXISTS "Admin read analytics events" ON analytics_events;
CREATE POLICY "Admin read analytics events" ON analytics_events
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = lower(auth.jwt() ->> 'email')
  ));
