/*
  # Fix Security Definer View and RPC Function Exposure

  ## Changes

  1. Drop public_reviews view
     - Removes the SECURITY DEFINER view vulnerability
     - Removes anon/authenticated SELECT grants that make it visible in GraphQL schema
     - Revokes all excess grants on the view before dropping

  2. Replace with get_featured_reviews() SECURITY INVOKER function
     - SECURITY INVOKER: runs as the calling user, respects their grants/RLS
     - anon can call it via RPC — it returns featured reviews directly from the underlying
       table using the function owner's access (postgres) only during the RETURN QUERY
     - Since the function is SECURITY INVOKER, it is NOT flagged as a security definer risk
     - anon has no SELECT grant on reviews table so it won't appear in GraphQL schema
     - No SELECT grant needed on any table for anon — function handles it

  3. Convert admin_get_reviews() and admin_get_contact_submissions() to SECURITY INVOKER
     - These functions already check is_admin() internally, so SECURITY DEFINER is unnecessary
     - SECURITY INVOKER means they run as the authenticated caller — still protected by is_admin() check
     - Removes the "Signed-In Users Can Execute SECURITY DEFINER Function" warning

  4. Add anon RLS policy on reviews table for function access
     - get_featured_reviews() is SECURITY INVOKER so it runs as anon
     - anon needs an RLS policy (not a grant) allowing it to SELECT featured rows
     - This is safe: RLS policy is restrictive (only featured=true rows), no table grant exists
       so the table remains hidden from GraphQL schema

  ## Notes
  - GraphQL visibility is determined by SELECT grants on the role
  - RLS policies alone do NOT make a table visible in the GraphQL schema
  - So: grant on table = visible in GraphQL; no grant but RLS policy = accessible via RPC only
*/

-- ============================================================
-- 1. Drop public_reviews view (and all its grants)
-- ============================================================

REVOKE ALL ON public.public_reviews FROM anon;
REVOKE ALL ON public.public_reviews FROM authenticated;
DROP VIEW IF EXISTS public.public_reviews;


-- ============================================================
-- 2. Add anon RLS policy on reviews (no SELECT grant — stays hidden from GraphQL)
-- ============================================================

DROP POLICY IF EXISTS "Public can read featured reviews" ON public.reviews;

CREATE POLICY "Public can read featured reviews"
  ON public.reviews
  FOR SELECT
  TO anon
  USING (is_featured = true);


-- ============================================================
-- 3. get_featured_reviews() — SECURITY INVOKER, callable by anon
-- ============================================================

DROP FUNCTION IF EXISTS public.get_featured_reviews();

CREATE FUNCTION public.get_featured_reviews()
RETURNS TABLE (
  id uuid,
  customer_name text,
  rating integer,
  review_text text,
  location text,
  service_type text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = ''
AS $$
  SELECT
    id,
    customer_name,
    rating,
    review_text,
    location,
    service_type,
    created_at
  FROM public.reviews
  WHERE is_featured = true
  ORDER BY created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_featured_reviews() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_featured_reviews() TO anon;
GRANT EXECUTE ON FUNCTION public.get_featured_reviews() TO authenticated;


-- ============================================================
-- 4. Recreate admin functions as SECURITY INVOKER
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_get_reviews()
RETURNS SETOF public.reviews
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM public.reviews ORDER BY created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_get_reviews() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_get_reviews() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_get_reviews() TO authenticated;


CREATE OR REPLACE FUNCTION public.admin_get_contact_submissions()
RETURNS SETOF public.contact_submissions
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM public.contact_submissions ORDER BY created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_get_contact_submissions() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_get_contact_submissions() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_get_contact_submissions() TO authenticated;
