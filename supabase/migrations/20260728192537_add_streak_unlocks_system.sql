/*
# Streak freezes + avatar unlock rewards

1. New Tables
- `avatar_unlocks`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users ON DELETE CASCADE)
  - `item_type` (text, not null) — category: "outfit", "accessory", "background", "pose", "hairStyle"
  - `item_id` (text, not null) — the avatar option id that was unlocked
  - `unlocked_at` (timestamptz, default now())
  - Unique constraint on (user_id, item_type, item_id) so each unlock is recorded once.

2. Modified Tables
- `profiles`
  - Adds `streak_freezes` (int, not null, default 0) — grace tokens that protect a streak
    when a day is missed. Each freeze auto-consumes to preserve the streak count.

3. Security
- `avatar_unlocks`: owner-scoped CRUD (authenticated, auth.uid() = user_id).
  Four policies: select / insert / update / delete.
- No RLS changes to `profiles` — existing owner-scoped policies already protect it.

4. Notes
- Idempotent: column addition uses DO $$ ... IF NOT EXISTS ... END $$.
- Policies use DROP POLICY IF EXISTS before CREATE for idempotency.
- The DEFAULT auth.uid() on avatar_unlocks.user_id lets the frontend insert
  without explicitly passing user_id.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_freezes'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_freezes int NOT NULL DEFAULT 0;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS avatar_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

ALTER TABLE avatar_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_unlocks" ON avatar_unlocks;
CREATE POLICY "select_own_unlocks" ON avatar_unlocks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_unlocks" ON avatar_unlocks;
CREATE POLICY "insert_own_unlocks" ON avatar_unlocks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_unlocks" ON avatar_unlocks;
CREATE POLICY "update_own_unlocks" ON avatar_unlocks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_unlocks" ON avatar_unlocks;
CREATE POLICY "delete_own_unlocks" ON avatar_unlocks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
