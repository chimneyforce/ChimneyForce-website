import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cgpoxvmlrecntospmmss.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncG94dm1scmVjbnRvc3BtbXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjAyMjEsImV4cCI6MjA4NDU5NjIyMX0.UYCngVvIlOtJyo7cll4mhqTwGHTMVJzVILZwVrJYrn8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hero image mapping
const heroImageMapping = {
  'public/hero_image_chimney_force.gif': 'hero-fireplace.gif'
};

async function uploadHeroGif() {
  console.log('🚀 Starting hero gif upload to Supabase Storage...\n');

  for (const [originalPath, newName] of Object.entries(heroImageMapping)) {
    try {
      console.log(`📤 Uploading ${originalPath} as ${newName}...`);

      // Read the gif file
      const filePath = resolve(process.cwd(), originalPath);
      const fileBuffer = readFileSync(filePath);

      console.log(`   File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(newName, fileBuffer, {
          contentType: 'image/gif',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(newName);

      console.log(`✅ Success: ${newName}`);
      console.log(`   URL: ${publicUrl}\n`);

      console.log('\n📋 Next Steps:\n');
      console.log('Replace the hero image in your Hero.tsx component with:');
      console.log(`   ${publicUrl}\n`);
      console.log('This will serve the optimized gif from Supabase CDN! 🚀\n');

    } catch (error) {
      console.error(`❌ Error uploading ${originalPath}:`, error.message);
      if (error.statusCode) {
        console.error(`   Status Code: ${error.statusCode}`);
      }
      console.log('\n');
    }
  }

  console.log('🎉 Upload complete!');
}

uploadHeroGif().catch(console.error);
