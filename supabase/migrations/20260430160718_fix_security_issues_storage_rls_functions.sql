/*
  # Fix Security: Search Path, GraphQL Visibility, and Direct Table Access

  ## Changes

  1. is_admin() — Fix mutable search_path
     - Adds SET search_path = '' to prevent search_path injection attacks
     - All schema references are fully qualified (auth.uid, auth.jwt)

  2. public_reviews view — Safe anon read access
     - Creates a SECURITY DEFINER view exposing only featured, non-sensitive review columns
     - Grants SELECT on this view to anon (instead of the underlying table)
     - Revokes direct SELECT from anon on the reviews table
     - The carousel queries this view; the admin panel keeps direct table access as authenticated

  3. GraphQL visibility
     - Revoking anon SELECT on reviews removes it from the anon GraphQL schema
     - Revoking authenticated SELECT on reviews and contact_submissions removes them
       from the authenticated GraphQL schema
     - Admin panel access is restored via a SECURITY DEFINER function get_all_reviews()
       and get_contact_submissions() that bypass RLS and are only callable by authenticated admins

  ## Notes
  - PostgREST uses both grants AND RLS for access control
  - pg_graphql visibility is driven purely by grants, not RLS policies
  - SECURITY DEFINER views/functions run as the owner (postgres) so they bypass the grant check
    while still enforcing whatever logic we embed in them
*/

-- ============================================================
-- 1. Fix is_admin() mutable search_path
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  IF (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin' THEN
    RETURN true;
  END IF;

  IF auth.jwt()->>'email' IN (
    'Chimneyforceinc@gmail.com',
    'admin@chimneyforce.com'
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ============================================================
-- 2. Create public_reviews view for anon carousel access
-- ============================================================

CREATE OR REPLACE VIEW public.public_reviews
WITH (security_invoker = false)
AS
  SELECT
    id,
    customer_name,
    rating,
    review_text,
    location,
    service_type,
    created_at
  FROM public.reviews
  WHERE is_featured = true;

-- Make this view run as the owner (postgres) to bypass row-level grants
ALTER VIEW public.public_reviews OWNER TO postgres;

-- Grant anon SELECT on the view only (not the underlying table)
GRANT SELECT ON public.public_reviews TO anon;

-- Revoke direct table SELECT from anon on reviews
REVOKE SELECT ON public.reviews FROM anon;


-- ============================================================
-- 3. Revoke authenticated SELECT on reviews and contact_submissions
--    to hide them from the authenticated GraphQL schema
-- ============================================================

REVOKE SELECT ON public.reviews FROM authenticated;
REVOKE SELECT ON public.contact_submissions FROM authenticated;


-- ============================================================
-- 4. SECURITY DEFINER functions for admin access (bypasses grant check)
--    These replace the direct table queries in the admin panel
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_get_reviews()
RETURNS SETOF public.reviews
LANGUAGE plpgsql
SECURITY DEFINER
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
SECURITY DEFINER
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


-- ============================================================
-- 5. RLS: update reviews SELECT policy to work via view
--    (anon no longer needs a policy on the table itself)
-- ============================================================

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Admin-only SELECT on the underlying table
CREATE POLICY "Only admins can select reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
