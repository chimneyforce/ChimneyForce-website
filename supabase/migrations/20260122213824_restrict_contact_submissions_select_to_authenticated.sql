/*
  Restrict Contact Submissions SELECT to Authenticated Users

  Overview:
  This migration removes anonymous SELECT access to contact_submissions table
  since the application code no longer uses .select() after insert.

  Changes:
  1. Remove policy allowing anonymous users to SELECT submissions
  2. Create policy restricting SELECT to authenticated users only (for admin dashboard)

  Security:
  - Only authenticated users (admins) can view contact submissions
  - Anonymous users can INSERT but cannot SELECT (view) any submissions
  - This protects customer privacy and sensitive contact information
*/

-- Drop the policy that allows anonymous users to SELECT
DROP POLICY IF EXISTS "Anyone can view submissions after insert" ON contact_submissions;

-- Create policy that only allows authenticated users to SELECT
CREATE POLICY "Only authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
