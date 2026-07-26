/*
# Add user role to profiles

1. Modified Tables
- `profiles`: adds `role` column (text) to distinguish students, teachers, and guardians.
  - Values: 'student' (default), 'teacher', 'guardian'.
  - Existing rows backfilled to 'student' so current users keep working.
  - A CHECK constraint keeps the column to the three allowed values.

2. Security
- No RLS policy changes. The profiles table already has owner-scoped CRUD;
  the new column is covered by the existing policies because users still
  only read/update their own row.

3. Important notes
- The column is nullable during the ADD COLUMN then set NOT NULL with a
  default of 'student' in a separate step so existing rows backfill safely.
- This is additive only — no data is lost.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';

UPDATE profiles SET role = 'student' WHERE role IS NULL;

ALTER TABLE profiles
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN role SET DEFAULT 'student';

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'guardian'));
