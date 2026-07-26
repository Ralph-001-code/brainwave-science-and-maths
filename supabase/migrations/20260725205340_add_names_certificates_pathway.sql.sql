/*
# Add student names, certificates, and learning pathway tables

1. Modified tables
- `profiles`: add `first_name` (text) and `last_name` (text) columns so we can display the student's real name instead of their email. Both default to empty string so existing rows don't break.

2. New tables
- `certificates`: stores certificates awarded to students when they complete a programme/stage.
  - `id` (uuid PK)
  - `user_id` (uuid, owner, defaults to auth.uid())
  - `programme` (text) — "primary", "checkpoint", or "igcse"
  - `stage` (text, nullable) — e.g. "stage6", "year6", or an IGCSE subject id
  - `title` (text) — the certificate title, e.g. "Cambridge Primary Checkpoint — Maths"
  - `student_name` (text) — first + last name at time of issue
  - `score` (int) — average percentage across completed topics
  - `issued_at` (timestamptz)

- `pathway_progress`: tracks which topics a student has completed as part of their learning pathway.
  - `id` (uuid PK)
  - `user_id` (uuid, owner, defaults to auth.uid())
  - `programme` (text)
  - `stage` (text, nullable)
  - `topic_id` (text)
  - `best_score` (int, default 0) — best percentage on that topic
  - `completed` (boolean, default false) — true once best_score >= 70
  - `updated_at` (timestamptz)

3. Security
- RLS enabled on both new tables.
- Owner-scoped CRUD (select/insert/update/delete) for authenticated users.
- No anon access (these tables require a signed-in user).
*/

-- Add name columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name text DEFAULT '';

-- certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  programme text NOT NULL,
  stage text,
  title text NOT NULL,
  student_name text NOT NULL DEFAULT '',
  score int NOT NULL DEFAULT 0,
  issued_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_certificates" ON certificates;
CREATE POLICY "select_own_certificates" ON certificates FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_certificates" ON certificates;
CREATE POLICY "insert_own_certificates" ON certificates FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_certificates" ON certificates;
CREATE POLICY "update_own_certificates" ON certificates FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_certificates" ON certificates;
CREATE POLICY "delete_own_certificates" ON certificates FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- pathway_progress table
CREATE TABLE IF NOT EXISTS pathway_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  programme text NOT NULL,
  stage text,
  topic_id text NOT NULL,
  best_score int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, programme, stage, topic_id)
);

ALTER TABLE pathway_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pathway" ON pathway_progress;
CREATE POLICY "select_own_pathway" ON pathway_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pathway" ON pathway_progress;
CREATE POLICY "insert_own_pathway" ON pathway_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pathway" ON pathway_progress;
CREATE POLICY "update_own_pathway" ON pathway_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pathway" ON pathway_progress;
CREATE POLICY "delete_own_pathway" ON pathway_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
