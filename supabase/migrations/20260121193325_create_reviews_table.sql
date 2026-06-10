/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key) - Unique identifier for each review
      - `customer_name` (text) - Name of the customer leaving the review
      - `rating` (integer) - Star rating from 1-5
      - `review_text` (text) - The actual review content
      - `location` (text, optional) - Customer's location/city
      - `service_type` (text, optional) - Type of service reviewed
      - `is_featured` (boolean) - Whether to show on homepage carousel
      - `created_at` (timestamptz) - When the review was created
      - `updated_at` (timestamptz) - When the review was last updated

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access (reviews are public)
    - Add policy for authenticated insert/update/delete (admin only for now)
    
  3. Important Notes
    - Reviews are publicly visible (read-only for visitors)
    - Only authenticated users can manage reviews (you'll control this)
    - `is_featured` flag determines which reviews show in carousel
    - Rating is constrained to 1-5 range
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  location text,
  service_type text,
  is_featured boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read all reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update reviews
CREATE POLICY "Authenticated users can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete reviews
CREATE POLICY "Authenticated users can delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);