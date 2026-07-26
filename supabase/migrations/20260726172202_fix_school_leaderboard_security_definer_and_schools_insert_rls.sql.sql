/*
# Fix security issues on school_leaderboard view and schools INSERT policy

## Background
Two security issues were flagged:
1. The `public.school_leaderboard` view was created with `SECURITY DEFINER`,
   meaning it executes with the privileges of the view owner (postgres),
   bypassing Row Level Security (RLS) on the underlying tables.
2. The `public.schools` table had an INSERT RLS policy (`insert_schools`)
   with `WITH CHECK (true)`, allowing any authenticated user to insert a
   school row with an arbitrary `created_by` value. This effectively bypasses
   RLS for INSERTs.

## Changes

### 1. school_leaderboard view — switch to SECURITY INVOKER
- Recreate the view with `SECURITY INVOKER` so it executes with the
  privileges of the querying user and respects RLS on the underlying
  `schools` and `profiles` tables.
- The view definition (select + join + aggregation) is unchanged.
- This is safe because:
  - `schools` has a `select_schools` policy allowing all authenticated
    users to read schools.
  - `profiles` has a `select_all_profiles` policy allowing all
    authenticated users to read profiles.
  - Therefore any authenticated user querying the view will still see
    the full leaderboard (every school + aggregated XP).

### 2. schools INSERT policy — require created_by = auth.uid()
- Drop the existing `insert_schools` policy (`WITH CHECK (true)`).
- Recreate it with `WITH CHECK (auth.uid() = created_by)` so a user can
  only create a school row whose `created_by` matches their own user id.
- This closes the unrestricted-insert hole while preserving the app's
  "create school" flow (AuthContext.createSchool inserts with
  `created_by: user.id`, which satisfies the new check).

## Notes
- No data is dropped or modified. The view is recreated (OR REPLACE) with
  identical output columns.
- The existing UPDATE/DELETE policies on schools already check
  `created_by = auth.uid()`, so the tightened INSERT policy is consistent
  with the table's existing ownership model.
*/

-- 1. Recreate the view with SECURITY INVOKER (respects caller's RLS)
CREATE OR REPLACE VIEW public.school_leaderboard
WITH (security_invoker = true) AS
SELECT
  s.id AS school_id,
  s.name AS school_name,
  s.country,
  s.city,
  count(p.id) AS member_count,
  COALESCE(sum(p.xp), 0) AS total_xp,
  COALESCE(avg(p.xp), 0) AS avg_xp
FROM public.schools s
LEFT JOIN public.profiles p ON p.school_id = s.id
GROUP BY s.id, s.name, s.country, s.city
ORDER BY COALESCE(sum(p.xp), 0) DESC;

-- 2. Tighten the INSERT policy on schools to require ownership
DROP POLICY IF EXISTS "insert_schools" ON public.schools;
CREATE POLICY "insert_schools"
ON public.schools FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
