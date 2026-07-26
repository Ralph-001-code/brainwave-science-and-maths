/*
# Lock down get_subscribed_emails() to the service role only

## What changed
The `public.get_subscribed_emails()` function is `SECURITY DEFINER`, so it runs
with the privileges of its owner (postgres) and bypasses Row Level Security.
Because it was executable by the `authenticated` role, ANY signed-in student
could call it via the public REST endpoint
`/rest/v1/rpc/get_subscribed_emails` and retrieve the full list of subscriber
email addresses — a privacy leak of every student who opted in to email updates.

## Security change
- REVOKE EXECUTE on `public.get_subscribed_emails()` from `PUBLIC`, `anon`,
  and `authenticated`. After this, only roles that retain explicit EXECUTE
  (the function owner / `postgres` / `service_role`) can call it.
- The `post-update` edge function already calls this RPC using the
  `SUPABASE_SERVICE_ROLE_KEY`, which bypasses these grants, so the
  email-a-subscribers feature is unaffected and continues to work.
- No front-end code calls this function, so no UI behavior changes.

## Why REVOKE instead of SECURITY INVOKER
Switching to SECURITY INVOKER would make the function run as the caller, which
would then be filtered by Row Level Security on `auth.users` and `profiles`.
`auth.users` has no SELECT policy for `authenticated`, so the function would
return zero rows and the email feature would silently break. Revoking EXECUTE
is the correct fix: the function stays callable by the service role (used by
the edge function) and is blocked for everyone else.

## Notes
1. REVOKE is idempotent — re-running this migration is safe.
2. No data is modified or deleted.
3. No tables or columns are changed.
*/

REVOKE EXECUTE ON FUNCTION public.get_subscribed_emails() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_subscribed_emails() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_subscribed_emails() FROM authenticated;
