/*
# Add avatar_config column to profiles

1. Changes
- Adds `avatar_config` (jsonb, nullable) to the `profiles` table.
  Stores the user's avatar customisation as a JSON object:
  { bodyType: "male"|"female", skinTone: "#hex", costume: "#hex",
    pose: "wave"|"stand"|"think"|"celebrate"|"read",
    accessory: "none"|"cap"|"crown"|"glasses"|"headband",
    eyeColor: "#hex" }
- The existing `avatar_url` column remains untouched.
2. Security
- No RLS changes. profiles already has owner-scoped policies (authenticated
  users can read/update only their own row), so avatar_config is protected
  by the same policies automatically.
3. Notes
- Idempotent: uses DO $$ ... IF NOT EXISTS ... END $$ so re-running is safe.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_config'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_config jsonb;
  END IF;
END $$;