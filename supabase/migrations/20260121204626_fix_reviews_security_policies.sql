/*
  # Fix Reviews Table Security Issues
  
  1. Index Optimization
    - Remove unused `idx_reviews_created_at` index
    - Keep `idx_reviews_featured` index as it's used for featured reviews queries
  
  2. Security Improvements - RLS Policies
    - Replace overly permissive policies that used `USING (true)` 
    - Implement proper access controls for INSERT, UPDATE, and DELETE operations
    - Maintain public read access for reviews (they are meant to be publicly visible)
    
  3. Important Notes
    - These policies now restrict write operations to require specific authentication checks
    - For production use, implement proper authentication with user roles/permissions
    - Consider using Supabase Auth with custom claims for admin role verification
    - The service role key can bypass RLS for admin operations if needed
    
  4. Auth DB Connection Strategy
    - This is a Supabase dashboard configuration setting
    - Navigate to: Database Settings → Connection Pooling
    - Change from fixed connection count to percentage-based allocation
    - This cannot be changed via SQL migration
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_reviews_created_at;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON reviews;

-- Create new restrictive policies
-- Note: These policies now require service_role or future implementation of admin role checks

-- INSERT: Only allow via service role (for admin interface)
-- In production, you should add a check for admin role in auth.jwt()
CREATE POLICY "Service role can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'role' = 'service_role'
    OR 
    (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin'
  );

-- UPDATE: Only allow via service role (for admin interface)  
CREATE POLICY "Service role can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR
    (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt()->>'role' = 'service_role'
    OR
    (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin'
  );

-- DELETE: Only allow via service role (for admin interface)
CREATE POLICY "Service role can delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR
    (auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin'
  );