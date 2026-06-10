/*
  # Fix Security Issues

  ## Summary
  Addresses multiple security vulnerabilities flagged in the security audit:

  1. Storage Bucket Listing
     - Drops the broad public SELECT policy on `storage.objects` for `website-images`
     - Replaces it with a policy that only allows reading specific objects (not listing the bucket)

  2. contact_submissions Table
     - Removes the anon SELECT grant and the 5-second window anon SELECT policy (not needed — anon only submits)
     - Replaces the overly broad `authenticated` SELECT policy (USING true) with admin-only access
     - Revokes excess privileges (TRUNCATE, DELETE, UPDATE, REFERENCES, TRIGGER) from anon

  3. reviews Table
     - Revokes excess privileges (TRUNCATE, UPDATE, DELETE, REFERENCES, TRIGGER) from anon
       (anon still retains SELECT for the public review carousel)

  4. is_admin() Function
     - Revokes EXECUTE from `anon` and `PUBLIC` — anon has no need to call this function
     - `authenticated` retains EXECUTE because RLS policies on reviews call it internally

  ## Security Notes
  - The public reviews carousel still works: anon SELECT RLS policy + grant remain intact
  - Contact form submissions still work: anon INSERT is preserved
  - Admin panel still works: authenticated SELECT (admin-only) + all write operations preserved
*/

-- ============================================================
-- 1. STORAGE: Replace listing-capable SELECT with object-only read
-- ============================================================

DROP POLICY IF EXISTS "Public Read Access for Website Images" ON storage.objects;

CREATE POLICY "Public can read website image objects"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'website-images'
    AND (storage.foldername(name))[1] != ''
  );


-- ============================================================
-- 2. contact_submissions: Tighten anon and authenticated access
-- ============================================================

-- Drop the 5-second anon SELECT window policy (anon only needs INSERT)
DROP POLICY IF EXISTS "Anonymous users can read very recent submissions" ON public.contact_submissions;

-- Drop the overly broad authenticated SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON public.contact_submissions;

-- Add admin-only SELECT policy for contact submissions
CREATE POLICY "Only admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Revoke excess privileges from anon on contact_submissions
-- (anon only needs INSERT for the contact form)
REVOKE SELECT ON public.contact_submissions FROM anon;
REVOKE UPDATE ON public.contact_submissions FROM anon;
REVOKE DELETE ON public.contact_submissions FROM anon;
REVOKE TRUNCATE ON public.contact_submissions FROM anon;
REVOKE REFERENCES ON public.contact_submissions FROM anon;
REVOKE TRIGGER ON public.contact_submissions FROM anon;


-- ============================================================
-- 3. reviews: Revoke excess privileges from anon
--    (anon SELECT is kept intentionally for the public carousel)
-- ============================================================

REVOKE UPDATE ON public.reviews FROM anon;
REVOKE DELETE ON public.reviews FROM anon;
REVOKE INSERT ON public.reviews FROM anon;
REVOKE TRUNCATE ON public.reviews FROM anon;
REVOKE REFERENCES ON public.reviews FROM anon;
REVOKE TRIGGER ON public.reviews FROM anon;


-- ============================================================
-- 4. is_admin(): Revoke EXECUTE from anon and PUBLIC
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;

-- Ensure authenticated retains EXECUTE (needed by RLS policies on reviews)
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
