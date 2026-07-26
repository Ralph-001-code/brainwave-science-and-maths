/*
# Rename "class" to "year" + add email update preference

## Summary
Renames the class-based system to a year-based system (Year 1 through Year 6)
to match the UK/Cambridge school naming. Also adds an email_updates column to
profiles so students can opt into email notifications about new content.

## Changes

### profiles table
- Renamed column `class_id` -> `year_id` (type text).
  - Existing values class1..class6 become year1..year6.
  - Default changed from 'class1' to 'year1'.
- Added column `email_updates` (boolean, default false).
  - When true, the student has opted in to receive email notifications
    about new topics, quizzes and site updates.

### quiz_attempts table
- Renamed column `class_id` -> `year_id` (type text).
  - Existing values remapped class1..class6 -> year1..year6.

### level_progress table
- Renamed column `class_id` -> `year_id` (type text).
  - Existing values remapped class1..class6 -> year1..year6.
- Unique constraint updated to use year_id instead of class_id.

## Security
- RLS already enabled on all three tables; policies unchanged and still
  scope by auth.uid() = user_id. No policy changes needed.

## Notes
1. Data-mapping blocks are wrapped in DO $$ ... END $$ (allowed).
2. No rows are dropped. Only column rename + value relabel.
3. Idempotent: safe to re-run.
*/

-- 1) profiles: rename class_id -> year_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE profiles RENAME COLUMN class_id TO year_id;
  END IF;
END $$;

UPDATE profiles SET year_id = 'year1' WHERE year_id = 'class1';
UPDATE profiles SET year_id = 'year2' WHERE year_id = 'class2';
UPDATE profiles SET year_id = 'year3' WHERE year_id = 'class3';
UPDATE profiles SET year_id = 'year4' WHERE year_id = 'class4';
UPDATE profiles SET year_id = 'year5' WHERE year_id = 'class5';
UPDATE profiles SET year_id = 'year6' WHERE year_id = 'class6';

ALTER TABLE profiles ALTER COLUMN year_id SET DEFAULT 'year1';
ALTER TABLE profiles ALTER COLUMN year_id SET NOT NULL;

-- Add email_updates column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email_updates'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_updates boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- 2) quiz_attempts: rename class_id -> year_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE quiz_attempts RENAME COLUMN class_id TO year_id;
  END IF;
END $$;

UPDATE quiz_attempts SET year_id = 'year1' WHERE year_id = 'class1';
UPDATE quiz_attempts SET year_id = 'year2' WHERE year_id = 'class2';
UPDATE quiz_attempts SET year_id = 'year3' WHERE year_id = 'class3';
UPDATE quiz_attempts SET year_id = 'year4' WHERE year_id = 'class4';
UPDATE quiz_attempts SET year_id = 'year5' WHERE year_id = 'class5';
UPDATE quiz_attempts SET year_id = 'year6' WHERE year_id = 'class6';

-- 3) level_progress: rename class_id -> year_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'level_progress' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE level_progress RENAME COLUMN class_id TO year_id;
  END IF;
END $$;

UPDATE level_progress SET year_id = 'year1' WHERE year_id = 'class1';
UPDATE level_progress SET year_id = 'year2' WHERE year_id = 'class2';
UPDATE level_progress SET year_id = 'year3' WHERE year_id = 'class3';
UPDATE level_progress SET year_id = 'year4' WHERE year_id = 'class4';
UPDATE level_progress SET year_id = 'year5' WHERE year_id = 'class5';
UPDATE level_progress SET year_id = 'year6' WHERE year_id = 'class6';

-- Update unique constraint on level_progress
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'level_progress_user_id_class_id_topic_key'
  ) THEN
    ALTER TABLE level_progress DROP CONSTRAINT level_progress_user_id_class_id_topic_key;
    ALTER TABLE level_progress ADD CONSTRAINT level_progress_user_id_year_id_topic_key UNIQUE (user_id, year_id, topic);
  END IF;
END $$;
