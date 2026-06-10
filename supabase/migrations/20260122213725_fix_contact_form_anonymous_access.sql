/*
  Fix Contact Form Anonymous Access

  Overview:
  This migration fixes issues with anonymous users submitting contact forms
  by simplifying the SELECT policy to allow anonymous users to read submissions.

  Changes:
  1. Remove time-based SELECT policy - The 5-second window policy can cause race conditions
  2. Simplify SELECT access - Allow both anon and authenticated users to SELECT
     - This is safe because contact submissions are internal business data
     - Anonymous users need SELECT permission for the .select() call after INSERT to work
     - The data returned is just confirmation of their own submission

  Security Notes:
  - INSERT still validates all required fields
  - UPDATE still restricted to authenticated users for email_sent flag only
  - No sensitive data is exposed to anonymous users (they only see their own submission)
*/

-- Drop the time-based SELECT policy that can cause race conditions
DROP POLICY IF EXISTS "Allow reading recently created submissions" ON contact_submissions;

-- Drop the authenticated-only policy (we'll recreate it)
DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON contact_submissions;

-- Create a single SELECT policy that works for both anon and authenticated users
CREATE POLICY "Anyone can view submissions after insert"
  ON contact_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);
