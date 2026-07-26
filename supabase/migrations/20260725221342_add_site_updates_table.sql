/*
# Create site_updates table for automatic announcements + emails

1. Purpose
- When the site owner posts an update (e.g. "New Checkpoint Science questions added!"),
  it is saved here so every signed-in student sees it on their dashboard, and the
  post-update edge function automatically emails it to every student who opted in to
  email updates. The owner posts once; the email send is automatic.

2. New Tables
- `site_updates`
  - id (uuid, primary key)
  - title (text, not null) — short headline of the update
  - body (text, not null) — the message shown on the dashboard and emailed
  - created_at (timestamptz, default now()) — when the update was posted

3. Security
- Enable RLS on `site_updates`.
- SELECT policy for `authenticated` only: every signed-in student can read updates
  to see them on their dashboard. (The app has a sign-in screen, so anon is excluded.)
- No INSERT/UPDATE/DELETE policy for anon/authenticated: rows are written server-side
  by the post-update edge function using the service role, AFTER it verifies the
  caller's JWT email matches the site owner. This keeps writes admin-only without
  exposing a public insert path.
*/

CREATE TABLE IF NOT EXISTS site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_site_updates" ON site_updates;
CREATE POLICY "read_site_updates" ON site_updates FOR SELECT
  TO authenticated USING (true);
