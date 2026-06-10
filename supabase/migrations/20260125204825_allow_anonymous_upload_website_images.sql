/*
  # Allow Anonymous Upload for Website Images
  
  1. Changes
    - Add policy to allow anonymous (public) users to upload images to website-images bucket
    - This is needed for the upload script to work
    
  2. Security Notes
    - Only applies to the website-images bucket
    - Public read access was already enabled
    - This allows the upload script to populate initial images
    - Consider removing this policy in production if not needed
*/

-- Allow anonymous users to upload images to website-images bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anonymous Upload for Website Images'
  ) THEN
    CREATE POLICY "Anonymous Upload for Website Images"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'website-images');
  END IF;
END $$;

-- Allow anonymous users to update images in website-images bucket (for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anonymous Update for Website Images'
  ) THEN
    CREATE POLICY "Anonymous Update for Website Images"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'website-images')
    WITH CHECK (bucket_id = 'website-images');
  END IF;
END $$;
