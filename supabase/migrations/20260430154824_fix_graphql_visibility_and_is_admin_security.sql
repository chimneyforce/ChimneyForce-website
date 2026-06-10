/*
  # Fix GraphQL Schema Visibility and is_admin Security

  ## Changes

  1. Hide reviews and contact_submissions from GraphQL schema
     - Uses pg_graphql comment-based configuration to exclude tables
     - Does NOT touch grants or RLS — PostgREST (REST API) access is unaffected
     - The public review carousel and admin panel continue working normally

  2. Convert is_admin() from SECURITY DEFINER to SECURITY INVOKER
     - SECURITY DEFINER means the function runs with the owner's (postgres) privileges
     - SECURITY INVOKER means it runs as the calling user — safer, correct behavior
     - The function only reads auth.uid() and auth.jwt(), which work fine as invoker
     - Authenticated users can still call it via RPC but it will just return true/false
       based on their own JWT claims — no privilege escalation possible

  ## Notes
  - pg_graphql respects COMMENT ON TABLE with @graphql({"totalCount": {"enabled": false}})
    but table exclusion uses the `omit` directive via COMMENT
  - RLS policies that call is_admin() internally still work after the SECURITY INVOKER change
    because they execute in the context of the authenticated user, which is correct
*/

-- ============================================================
-- 1. Hide tables from GraphQL schema using pg_graphql directives
-- ============================================================

COMMENT ON TABLE public.reviews IS E'@graphql({"primary_key_columns": ["id"], "omit": true})';
COMMENT ON TABLE public.contact_submissions IS E'@graphql({"primary_key_columns": ["id"], "omit": true})';


-- ============================================================
-- 2. Recreate is_admin() as SECURITY INVOKER
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user has admin role in app_metadata
  IF (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin' THEN
    RETURN true;
  END IF;

  -- Check if user email is in admin list
  IF auth.jwt()->>'email' IN (
    'Chimneyforceinc@gmail.com',
    'admin@chimneyforce.com'
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Ensure authenticated retains EXECUTE for RLS policies and admin panel
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
-- Ensure anon cannot call it
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
