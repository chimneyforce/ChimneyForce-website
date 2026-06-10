# Supabase Storage Setup Complete!

## ✅ What's Been Created

1. **Storage Bucket**: `website-images`
   - Public access enabled
   - 10MB file size limit
   - Supports: JPG, PNG, GIF, WebP
   - CDN-optimized delivery

2. **Security Policies**:
   - Public read access (anyone can view images)
   - Authenticated upload/update/delete

---

## 📤 How to Upload Your Images

### Option 1: Use the Upload Tool (Easiest)

1. Open `upload-images.html` in your browser
2. Drag and drop your images (1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg)
3. Click "Upload Images"
4. Copy the generated URLs

### Option 2: Use Supabase Dashboard

1. Go to: https://cgpoxvmlrecntospmmss.supabase.co/project/cgpoxvmlrecntospmmss/storage/buckets/website-images
2. Click "Upload file"
3. Select your 5 images
4. Rename them:
   - `1.jpg` → `chimney-sweep-roof.jpg`
   - `2.jpg` → `chimney-cleaning-inside.jpg`
   - `3.jpg` → `fireplace-installation.jpg`
   - `4.jpg` → `chimney-sweep-professional.jpg`
   - `5.jpg` → `chimney-damage-before.jpg`

### Option 3: Use Node.js Script

Place your 5 images (1.jpg through 5.jpg) in the project root folder, then run:

```bash
node upload-images.js
```

---

## 🔗 Your Image URLs

After uploading, your images will be available at:

```
https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-roof.jpg
https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-cleaning-inside.jpg
https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-installation.jpg
https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-professional.jpg
https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-damage-before.jpg
```

---

## 📝 Where to Use These Images

### Replace in your code:

1. **Hero background** (`/fireplace-hero.gif`):
   - Use: `chimney-sweep-roof.jpg` or `fireplace-installation.jpg`

2. **Team photos** in Home.tsx:
   - `/untitled_design_(10) copy.png` → `fireplace-installation.jpg`
   - `/untitled_design_(11).png` → `chimney-cleaning-inside.jpg`
   - `/chimney_force_pro.png` → `chimney-sweep-professional.jpg`

3. **Before/After gallery**:
   - Before: `chimney-damage-before.jpg`
   - After: You'll need to upload an "after" photo

---

## 🚀 Next Steps

1. Upload your images using one of the methods above
2. Copy the URLs
3. Update your component files to use the Supabase URLs instead of `/public` paths
4. Test the website - it should load in under 2 seconds!

---

## 💡 Tips

- Compress images before uploading (use TinyPNG.com)
- Target size: 300-500KB per image
- Use WebP format for better compression
- Supabase will serve images through their CDN automatically
