# Image Optimization Guide

## Current Problem
Your website has 20-byte placeholder images causing 6+ second load times. This guide explains how to fix it.

---

## Option 1: Upload Real Images (Immediate Fix)

### Quick Fix - Compress & Upload
1. **Compress your images first** using one of these free tools:
   - [TinyPNG](https://tinypng.com/) - Best for PNG/JPG
   - [Squoosh](https://squoosh.app/) - Google's web app
   - [ImageOptim](https://imageoptim.com/) - Mac desktop app

2. **Target sizes:**
   - Hero background (GIF): < 2MB
   - Team photos (PNG/JPG): < 300KB each
   - Before/After gallery (JPG): < 400KB each

3. **Upload to your project:**
   - Replace files in `/public` folder
   - Keep the same filenames

---

## Option 2: Use Supabase Storage (Best Solution)

### Why Supabase Storage?
- Automatic image optimization
- CDN delivery (fast worldwide)
- Resize on-the-fly
- No server load

### Setup Steps:

#### 1. Create Storage Bucket
```typescript
// Run this in Supabase dashboard SQL editor
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Create RLS policy for public read access
create policy "Public Read Access"
on storage.objects for select
using (bucket_id = 'images');

-- Create policy for authenticated uploads
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'images'
  and auth.role() = 'authenticated'
);
```

#### 2. Upload Images to Supabase
```typescript
import { supabase } from './lib/supabase';
import { compressImageClient } from './lib/imageOptimization';

async function uploadImage(file: File) {
  // Compress image first (client-side)
  const compressed = await compressImageClient(file, 1); // Max 1MB

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, compressed, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

#### 3. Update Image URLs
Replace local paths with Supabase URLs:

```typescript
// Before:
<img src="/fireplace-hero.gif" />

// After:
<img src="https://your-project.supabase.co/storage/v1/object/public/images/fireplace-hero.gif" />
```

---

## Option 3: Client-Side Compression

Use the built-in utility for user uploads:

```typescript
import { compressImageClient } from './lib/imageOptimization';

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Compress to max 1MB
  const compressed = await compressImageClient(file, 1);

  // Now upload the compressed file
  console.log('Original:', file.size, 'Compressed:', compressed.size);
};
```

---

## Recommended Image Formats

| Use Case | Format | Max Size | Quality |
|----------|--------|----------|---------|
| Hero backgrounds | WebP/JPG | 500KB | 80% |
| Team photos | WebP/JPG | 200KB | 85% |
| Before/After | WebP/JPG | 300KB | 85% |
| Icons/Logos | PNG/SVG | 50KB | 100% |
| Animations | GIF/WebM | 1MB | - |

---

## Performance Improvements Applied

I've already added these optimizations to your code:
- ✅ `loading="lazy"` - Images load only when needed
- ✅ `decoding="async"` - Non-blocking image decode
- ✅ Error handling - Graceful fallback for broken images
- ✅ Background placeholders - Gray background shows while loading
- ✅ `fetchPriority="high"` - Hero image loads first

---

## Next Steps

1. **Immediate:** Compress images with TinyPNG and upload to `/public`
2. **Long-term:** Set up Supabase Storage for automatic optimization
3. **Test:** Check load time with browser DevTools Network tab

Your site should load in under 2 seconds after fixing images!
