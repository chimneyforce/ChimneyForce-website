/*
  # Fix Contact Submissions Anonymous Access

  1. Changes
    - Drop existing INSERT policy
    - Create new INSERT policy that properly allows anonymous submissions
    - Ensure the policy works for both anonymous (anon) and authenticated users

  2. Security
    - Allow anyone (including unauthenticated users) to submit contact forms
    - Maintain existing SELECT and UPDATE policies for authenticated users
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;

-- Create a new policy that allows anonymous inserts
CREATE POLICY "Enable insert for anonymous and authenticated users"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
