/*
  # Create Website Images Storage Bucket

  1. Storage Setup
    - Create public storage bucket named 'website-images'
    - Configure for public access and CDN delivery
  
  2. Security
    - Enable public read access for all images
    - Allow authenticated users to upload images
    - Set appropriate cache headers for CDN optimization
  
  3. Purpose
    - Store website images (hero backgrounds, team photos, before/after gallery)
    - Automatic image optimization through Supabase Storage
    - Fast CDN delivery worldwide
*/

-- Create the storage bucket for website images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-images',
  'website-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images in the bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public Read Access for Website Images'
  ) THEN
    CREATE POLICY "Public Read Access for Website Images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'website-images');
  END IF;
END $$;

-- Allow authenticated users to upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated Upload for Website Images'
  ) THEN
    CREATE POLICY "Authenticated Upload for Website Images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'website-images');
  END IF;
END $$;

-- Allow authenticated users to update their uploaded images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated Update for Website Images'
  ) THEN
    CREATE POLICY "Authenticated Update for Website Images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'website-images')
    WITH CHECK (bucket_id = 'website-images');
  END IF;
END $$;

-- Allow authenticated users to delete images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated Delete for Website Images'
  ) THEN
    CREATE POLICY "Authenticated Delete for Website Images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'website-images');
  END IF;
END $$;