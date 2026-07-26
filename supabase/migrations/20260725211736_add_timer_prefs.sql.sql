/*
# Add timer preferences to profiles

1. Modified tables
- `profiles`: add `timer_enabled` (boolean, default true) and `timer_duration` (int, default 30)
  so each student's timer preference is remembered across sessions and quizzes.

2. Security
- No new tables. Existing owner-scoped update policy on `profiles` already covers these columns.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS timer_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS timer_duration int NOT NULL DEFAULT 30;
