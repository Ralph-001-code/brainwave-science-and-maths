/*
# Add get_subscribed_emails helper function

## Summary
Creates a SECURITY DEFINER function that returns the email addresses of every
student who has opted in to email updates (profiles.email_updates = true).

## Why
The edge function that sends update emails needs to read emails from auth.users,
which is NOT exposed through the normal REST API and is protected by RLS.
A SECURITY DEFINER function with restricted access is the safe way to expose
just the subscribed emails to the service-role key used by the edge function.

## Security
- SECURITY DEFINER: runs with the function owner's privileges (bypasses RLS).
- Only returns the email column — no other auth.users data is exposed.
- Only returns rows where the matching profile has email_updates = true.
- Marked as LEAKPROOF-ish: only the service role calls it from the edge function.
- REVOKE from public/anon so only the service role (and authenticated, if desired)
  can call it. We GRANT EXECUTE to authenticated + service_role so the edge
  function (using the service role key) can call it.
*/

DROP FUNCTION IF EXISTS public.get_subscribed_emails();
CREATE OR REPLACE FUNCTION public.get_subscribed_emails()
RETURNS TABLE (email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.email
  FROM auth.users au
  JOIN public.profiles p ON p.id = au.id
  WHERE p.email_updates = true
    AND au.email IS NOT NULL;
$$;

REVOKE EXECUTE ON FUNCTION public.get_subscribed_emails() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_subscribed_emails() TO authenticated, service_role;
