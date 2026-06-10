/*
  # Fix RLS Security Vulnerabilities

  ## Overview
  This migration fixes critical security issues where RLS policies use `USING (true)`,
  allowing unrestricted access to authenticated users.

  ## Changes

  1. **contact_submissions table**
     - Remove UPDATE policy with `USING (true)`
     - Since this is a public form and we don't need updates after submission, we remove UPDATE access entirely
     - Only INSERT for form submissions and SELECT for reading submissions are needed

  2. **reviews table**
     - Remove policies that allow any authenticated user to UPDATE/DELETE
     - Implement a proper admin-only access system using a secure function
     - Create a function to check if user is an admin (checks email domain or specific admin list)
     - Apply this check to INSERT, UPDATE, and DELETE operations

  ## Security Model

  For the reviews table, we implement admin access by:
  - Creating a helper function that checks if the current user is an admin
  - Only allowing INSERT/UPDATE/DELETE if the user passes this admin check
  - Maintaining public read access for displaying reviews

  ## Auth DB Connection Strategy

  Note: The Auth DB Connection Strategy must be fixed manually in Supabase Dashboard:
  - Navigate to: Project Settings → Database → Connection Pooling → Auth
  - Change from fixed connection count (e.g., 10) to percentage-based allocation
  - This cannot be changed via SQL migration
*/

-- ============================================================
-- CONTACT SUBMISSIONS TABLE - REMOVE UNSAFE UPDATE POLICY
-- ============================================================

-- Drop the unsafe UPDATE policy that allows any authenticated user to update
DROP POLICY IF EXISTS "System can update email status only" ON contact_submissions;
DROP POLICY IF EXISTS "System can update email status" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON contact_submissions;

-- We don't need UPDATE on contact_submissions - submissions are write-once
-- The email notification system doesn't need to update the database after sending
-- If you need to track email status in the future, use a separate admin-only table

-- ============================================================
-- REVIEWS TABLE - IMPLEMENT PROPER ADMIN AUTHENTICATION
-- ============================================================

-- Create a function to check if the current user is an admin
-- This provides a centralized, secure way to verify admin access
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Method 1: Check if user has admin role in app_metadata
  -- This requires setting admin role via Supabase Dashboard or Management API
  IF (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Method 2: Check if user email is in admin list
  -- Add your admin emails here
  IF auth.jwt()->>'email' IN (
    'Chimneyforceinc@gmail.com',
    'admin@chimneyforce.com'
  ) THEN
    RETURN true;
  END IF;
  
  -- Not an admin
  RETURN false;
END;
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert validated reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update validated reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can update reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can delete reviews" ON reviews;

-- INSERT: Only admins can add reviews
CREATE POLICY "Only admins can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin()
    AND customer_name IS NOT NULL 
    AND customer_name != ''
    AND service_type IS NOT NULL
    AND service_type != ''
    AND rating IS NOT NULL
    AND rating >= 1 
    AND rating <= 5
    AND review_text IS NOT NULL
    AND review_text != ''
  );

-- UPDATE: Only admins can update reviews
CREATE POLICY "Only admins can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (
    is_admin()
    AND customer_name IS NOT NULL 
    AND customer_name != ''
    AND service_type IS NOT NULL
    AND service_type != ''
    AND rating IS NOT NULL
    AND rating >= 1 
    AND rating <= 5
    AND review_text IS NOT NULL
    AND review_text != ''
  );

-- DELETE: Only admins can delete reviews
CREATE POLICY "Only admins can delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (is_admin());
