
/*
# Brainwave Science & Maths - Initial Schema

## Summary
Creates all tables needed to support the Brainwave maths learning platform for students.

## New Tables

### profiles
Stores each student's display name, level tier, XP points, and daily streak.
- id: matches auth.users id
- username: display name chosen on signup
- avatar_url: optional custom avatar
- level_tier: current level (bronze, silver, gold, platinum)
- xp: total experience points earned
- streak: current daily login/quiz streak
- last_active: date of last activity (used to calculate streak)

### quiz_attempts
Records every quiz a student completes.
- id: unique attempt ID
- user_id: which student took the quiz
- topic: the maths topic (e.g. "Fractions", "Algebra")
- level_tier: difficulty level the quiz was taken at
- score: number of correct answers
- total_questions: total questions in the quiz
- completed_at: when the quiz was finished

### level_progress
Tracks which topics a student has unlocked/completed per level tier.
- user_id: the student
- level_tier: bronze/silver/gold/platinum
- topic: the topic name
- completed: whether the topic is completed
- best_score: highest score achieved on this topic

## Security
- RLS enabled on all tables
- authenticated users can only read/write their own rows
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  avatar_url text,
  level_tier text NOT NULL DEFAULT 'bronze',
  xp integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  last_active date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  level_tier text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 10,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON quiz_attempts;
CREATE POLICY "select_own_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON quiz_attempts;
CREATE POLICY "insert_own_attempts" ON quiz_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_attempts" ON quiz_attempts;
CREATE POLICY "update_own_attempts" ON quiz_attempts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attempts" ON quiz_attempts;
CREATE POLICY "delete_own_attempts" ON quiz_attempts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- LEVEL PROGRESS
CREATE TABLE IF NOT EXISTS level_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  level_tier text NOT NULL,
  topic text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  best_score integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, level_tier, topic)
);

ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON level_progress;
CREATE POLICY "select_own_progress" ON level_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON level_progress;
CREATE POLICY "insert_own_progress" ON level_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON level_progress;
CREATE POLICY "update_own_progress" ON level_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON level_progress;
CREATE POLICY "delete_own_progress" ON level_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS quiz_attempts_user_id_idx ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_completed_at_idx ON quiz_attempts(completed_at);
CREATE INDEX IF NOT EXISTS level_progress_user_id_idx ON level_progress(user_id);
