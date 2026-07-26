/*
# Switch from "levels" to "classes"

## Summary
This migration changes the Brainwave maths platform from a Bronze/Silver/Gold/Platinum
level system to a school-class system (Class 1 through Class 6). This makes the
questions age-appropriate: younger students get simpler questions.

## Changes

### profiles table
- Renamed column `level_tier` to `class_id` (type text).
  - Old values were: bronze, silver, gold, platinum.
  - New values are: class1, class2, class3, class4, class5, class6.
  - Existing bronze rows become class1 (the easiest class).
  - silver -> class3, gold -> class4, platinum -> class6 (best-effort mapping).
- Default changed from 'bronze' to 'class1'.

### quiz_attempts table
- Renamed column `level_tier` to `class_id` (type text).
- Existing rows are mapped using the same rule.

### level_progress table
- Renamed column `level_tier` to `class_id` (type text).
- Existing rows are mapped using the same rule.

## Security
- RLS already enabled on all three tables; policies are unchanged and still
  scope by auth.uid() = user_id. No policy changes needed.

## Notes
1. The data-mapping block is wrapped in a DO $$ ... END $$ PL/pgSQL block
   (this is allowed — it is NOT a transaction control statement).
2. We never DROP data rows. Only the column is renamed/relabelled.
3. Idempotent: re-running this migration is safe because the column is only
   renamed if it still has the old name, and the value remap only touches
   rows that still hold an old level name.
*/

-- 1) profiles: rename level_tier -> class_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'level_tier'
  ) THEN
    ALTER TABLE profiles RENAME COLUMN level_tier TO class_id;
  END IF;
END $$;

-- Remap old level names to class ids on profiles
UPDATE profiles SET class_id = 'class1' WHERE class_id = 'bronze';
UPDATE profiles SET class_id = 'class3' WHERE class_id = 'silver';
UPDATE profiles SET class_id = 'class4' WHERE class_id = 'gold';
UPDATE profiles SET class_id = 'class6' WHERE class_id = 'platinum';

-- Ensure default + not null on profiles.class_id
ALTER TABLE profiles ALTER COLUMN class_id SET DEFAULT 'class1';
ALTER TABLE profiles ALTER COLUMN class_id SET NOT NULL;

-- 2) quiz_attempts: rename level_tier -> class_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'level_tier'
  ) THEN
    ALTER TABLE quiz_attempts RENAME COLUMN level_tier TO class_id;
  END IF;
END $$;

UPDATE quiz_attempts SET class_id = 'class1' WHERE class_id = 'bronze';
UPDATE quiz_attempts SET class_id = 'class3' WHERE class_id = 'silver';
UPDATE quiz_attempts SET class_id = 'class4' WHERE class_id = 'gold';
UPDATE quiz_attempts SET class_id = 'class6' WHERE class_id = 'platinum';

-- 3) level_progress: rename level_tier -> class_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'level_progress' AND column_name = 'level_tier'
  ) THEN
    ALTER TABLE level_progress RENAME COLUMN level_tier TO class_id;
  END IF;
END $$;

UPDATE level_progress SET class_id = 'class1' WHERE class_id = 'bronze';
UPDATE level_progress SET class_id = 'class3' WHERE class_id = 'silver';
UPDATE level_progress SET class_id = 'class4' WHERE class_id = 'gold';
UPDATE level_progress SET class_id = 'class6' WHERE class_id = 'platinum';

-- Update the unique constraint on level_progress to use class_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'level_progress_user_id_level_tier_topic_key'
  ) THEN
    ALTER TABLE level_progress DROP CONSTRAINT level_progress_user_id_level_tier_topic_key;
    ALTER TABLE level_progress ADD CONSTRAINT level_progress_user_id_class_id_topic_key UNIQUE (user_id, class_id, topic);
  END IF;
END $$;
