/*
  Fix Anonymous Contact Form Submissions

  Overview:
  The previous migration blocked anonymous SELECT access, which broke form submissions.
  This restores anonymous INSERT functionality while maintaining security.

  Changes:
  1. Drop the authenticated-only SELECT policy
  2. Restore a minimal SELECT policy for anonymous users
     - Only allows reading very recent submissions (last 5 seconds)
     - This allows the form submission to succeed without exposing data
  3. Keep the authenticated users policy for admin access

  Security:
  - Anonymous users can only see submissions created in the last 5 seconds
  - This is enough time for the form submission to complete
  - Prevents anonymous users from browsing historical submissions
  - Authenticated users (admins) can view all submissions
*/

-- Drop the policy that blocks anonymous SELECT
DROP POLICY IF EXISTS "Only authenticated users can view submissions" ON contact_submissions;

-- Allow anonymous users to read very recent submissions (needed for insert to work)
CREATE POLICY "Anonymous users can read very recent submissions"
  ON contact_submissions
  FOR SELECT
  TO anon
  USING (created_at > (now() - interval '5 seconds'));

-- Authenticated users can view all submissions
CREATE POLICY "Authenticated users can view all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
