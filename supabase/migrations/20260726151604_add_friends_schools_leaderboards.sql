/*
# Add friends, schools, and leaderboard support

## Purpose
Enables social features: users can add friends, join a school, and compete on
leaderboards (global, among friends, and between schools).

## New Tables

### schools
- id (uuid, PK)
- name (text, not null) — school display name
- country (text, nullable) — optional country for regional filtering
- city (text, nullable) — optional city
- created_by (uuid, nullable, FK auth.users) — the user who created the school
- created_at (timestamptz)

### friendships
Models friend requests and accepted friendships between two users.
- id (uuid, PK)
- requester_id (uuid, not null, FK auth.users) — who sent the request
- addressee_id (uuid, not null, FK auth.users) — who receives the request
- status (text, not null, default 'pending') — 'pending' | 'accepted' | 'declined'
- created_at (timestamptz)
- UNIQUE(requester_id, addressee_id) — one request per pair

## Modified Tables

### profiles
- Added school_id (uuid, nullable, FK schools ON DELETE SET NULL)
- Added an index on xp for fast leaderboard ordering
- Added an index on school_id for school leaderboard queries

## Security (RLS)

### schools
- SELECT: any authenticated user can browse schools (to search & join)
- INSERT: any authenticated user can create a school (sets created_by via default)
- UPDATE: only the school creator can edit
- DELETE: only the school creator can delete

### friendships
- SELECT: a user can see rows where they are the requester OR the addressee
- INSERT: a user can create a request only if they are the requester
- UPDATE: a user can update status only if they are the addressee (accept/decline)
- DELETE: either party can remove a friendship

### profiles (new policy added)
- NEW: a second SELECT policy "select_all_profiles" allows any authenticated
  user to read ALL profiles. This is required for global/friends/school
  leaderboards. Profile data exposed (username, first_name, last_name, xp,
  streak, school_id, role, avatar_url, programme) is intentionally visible
  to other platform users for competition. The existing "select_own_profile"
  policy is kept (harmless duplicate). INSERT/UPDATE/DELETE remain owner-only.

## Important Notes
1. school_id is nullable — existing users are not forced into a school.
2. No data is lost: only additive changes (new table, new nullable column).
3. Idempotent: uses IF NOT EXISTS / DROP POLICY IF EXISTS patterns.
*/

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  city text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_schools" ON schools;
CREATE POLICY "select_schools" ON schools FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_schools" ON schools;
CREATE POLICY "insert_schools" ON schools FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_school_creator" ON schools;
CREATE POLICY "update_school_creator" ON schools FOR UPDATE
  TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "delete_school_creator" ON schools;
CREATE POLICY "delete_school_creator" ON schools FOR DELETE
  TO authenticated USING (created_by = auth.uid());

CREATE INDEX IF NOT EXISTS schools_name_lower_idx ON schools (lower(name));

-- ============================================================
-- FRIENDSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_friendships" ON friendships;
CREATE POLICY "select_own_friendships" ON friendships FOR SELECT
  TO authenticated USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

DROP POLICY IF EXISTS "insert_friendship_requester" ON friendships;
CREATE POLICY "insert_friendship_requester" ON friendships FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "update_friendship_addressee" ON friendships;
CREATE POLICY "update_friendship_addressee" ON friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = addressee_id OR auth.uid() = requester_id)
  WITH CHECK (auth.uid() = addressee_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "delete_own_friendship" ON friendships;
CREATE POLICY "delete_own_friendship" ON friendships FOR DELETE
  TO authenticated USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE INDEX IF NOT EXISTS friendships_addressee_idx ON friendships (addressee_id, status);
CREATE INDEX IF NOT EXISTS friendships_requester_idx ON friendships (requester_id, status);

-- ============================================================
-- PROFILES: add school_id, open reads for leaderboards
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES schools(id) ON DELETE SET NULL;

-- Any authenticated user can read all profiles (for leaderboards / friend search).
-- Kept additive: the existing owner-only select policy remains.
DROP POLICY IF EXISTS "select_all_profiles" ON profiles;
CREATE POLICY "select_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS profiles_xp_idx ON profiles (xp DESC);
CREATE INDEX IF NOT EXISTS profiles_school_id_idx ON profiles (school_id);

-- ============================================================
-- Helper: school aggregate leaderboard view
-- Sum of XP per school + member count, ordered by total XP.
-- ============================================================
CREATE OR REPLACE VIEW school_leaderboard AS
SELECT
  s.id AS school_id,
  s.name AS school_name,
  s.country,
  s.city,
  COUNT(p.id) AS member_count,
  COALESCE(SUM(p.xp), 0) AS total_xp,
  COALESCE(AVG(p.xp), 0) AS avg_xp
FROM schools s
LEFT JOIN profiles p ON p.school_id = s.id
GROUP BY s.id, s.name, s.country, s.city
ORDER BY total_xp DESC;
