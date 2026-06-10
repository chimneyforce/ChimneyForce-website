/*
  # Create Contact Submissions Table

  ## Overview
  This migration creates a table to store all form submissions from the website,
  including both quick quote requests and full contact form submissions.

  ## New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `submission_type` (text) - Type of form: 'quote' or 'contact'
      - `name` (text, nullable) - Customer name (for contact form)
      - `email` (text, nullable) - Customer email (for contact form)
      - `phone` (text) - Customer phone number (required for both forms)
      - `service` (text) - Service requested
      - `message` (text, nullable) - Additional message (for contact form)
      - `email_sent` (boolean) - Whether notification email was sent successfully
      - `created_at` (timestamptz) - Timestamp when submission was created
      - `updated_at` (timestamptz) - Timestamp when submission was last updated

  ## Security
    - Enable RLS on `contact_submissions` table
    - Add policy for service role to insert new submissions (for public form access)
    - Add policy for authenticated admins to view submissions

  ## Notes
    - Submissions are stored for record-keeping and follow-up
    - Email notifications are sent when new submissions are created
    - Default values ensure proper tracking of submission status
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type text NOT NULL DEFAULT 'contact',
  name text,
  email text,
  phone text NOT NULL,
  service text NOT NULL,
  message text,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert submissions (public forms)
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to view all submissions (for admin dashboard)
CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to update submissions (for admin management)
CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);

-- Create an index on submission_type for filtering
CREATE INDEX IF NOT EXISTS contact_submissions_type_idx ON contact_submissions(submission_type);