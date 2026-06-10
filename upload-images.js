import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cgpoxvmlrecntospmmss.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncG94dm1scmVjbnRvc3BtbXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjAyMjEsImV4cCI6MjA4NDU5NjIyMX0.UYCngVvIlOtJyo7cll4mhqTwGHTMVJzVILZwVrJYrn8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Image mappings for your website
const imageMapping = {
  '1.jpg': 'chimney-sweep-roof.jpg',        // Chimney sweep on roof
  '2.jpg': 'chimney-cleaning-inside.jpg',   // Cleaning inside fireplace
  '3.jpg': 'fireplace-installation.jpg',    // Fireplace installation/repair
  '4.jpg': 'chimney-sweep-professional.jpg', // Professional with tools
  '5.jpg': 'chimney-damage-before.jpg'      // Damaged chimney (before)
};

async function uploadImages() {
  console.log('🚀 Starting image upload to Supabase Storage...\n');

  const uploadedUrls = [];

  for (const [originalName, newName] of Object.entries(imageMapping)) {
    try {
      console.log(`📤 Uploading ${originalName} as ${newName}...`);

      // Read the image file
      const filePath = resolve(process.cwd(), originalName);
      const fileBuffer = readFileSync(filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(newName, fileBuffer, {
          contentType: 'image/jpeg',
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

      uploadedUrls.push({ original: originalName, name: newName, url: publicUrl });
      console.log(`✅ Success: ${newName}`);
      console.log(`   URL: ${publicUrl}\n`);

    } catch (error) {
      console.error(`❌ Error uploading ${originalName}:`, error.message, '\n');
    }
  }

  console.log('\n📋 Summary of Uploaded Images:\n');
  console.log('Copy these URLs to use in your website:\n');

  uploadedUrls.forEach(({ original, name, url }) => {
    console.log(`${name}:`);
    console.log(`  ${url}\n`);
  });

  console.log('\n🎉 Upload complete!');
  console.log(`Total uploaded: ${uploadedUrls.length} of ${Object.keys(imageMapping).length} images`);
}

uploadImages().catch(console.error);
