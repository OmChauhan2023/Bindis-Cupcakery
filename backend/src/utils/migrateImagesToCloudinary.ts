import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import cloudinary from '../config/cloudinary';
import Product from '../models/Product';

async function migrateImages() {
  try {
    await connectDB();
    console.log("☁️ Connected to MongoDB Atlas. Starting Cloudinary Image Migration...");

    const products = await Product.find();
    if (products.length === 0) {
      console.log("⚠️ No products found in MongoDB. Please seed the database first.");
      process.exit(0);
    }

    // Path to frontend/public folder containing original bakery photos
    const publicDir = path.resolve(__dirname, '../../../frontend/public');
    console.log(`📁 Looking for local images in: ${publicDir}`);

    let uploadedCount = 0;

    for (const product of products) {
      const currentImage = product.image;
      
      // If image is already a cloudinary URL or external http URL, skip or re-upload if local file exists
      if (currentImage.startsWith('http://') || currentImage.startsWith('https://')) {
        if (currentImage.includes('cloudinary.com')) {
          console.log(`ℹ️ [Skip] "${product.name}" already uses Cloudinary: ${currentImage}`);
          continue;
        }
      }

      // Clean up filename (remove leading slash)
      const fileName = currentImage.startsWith('/') ? currentImage.slice(1) : currentImage;
      const localFilePath = path.join(publicDir, fileName);

      if (!fs.existsSync(localFilePath)) {
        console.warn(`⚠️ Local file not found for "${product.name}": ${localFilePath}`);
        continue;
      }

      console.log(`⏳ Uploading "${fileName}" to Cloudinary...`);
      
      try {
        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: 'bindi_cupcakery_products',
          public_id: fileName.replace(/\.[^/.]+$/, ""), // remove file extension for public_id
          overwrite: true,
          transformation: [{ width: 800, height: 800, crop: 'limit' }],
        });

        console.log(`✅ Uploaded! CDN URL: ${result.secure_url}`);

        // Update MongoDB product with new Cloudinary CDN URL
        product.image = result.secure_url;
        await product.save();
        uploadedCount++;
      } catch (uploadErr: any) {
        console.error(`❌ Failed to upload "${fileName}" to Cloudinary:`, uploadErr.message || uploadErr);
      }
    }

    console.log(`\n🎉 Migration Complete! Successfully uploaded and updated ${uploadedCount} product images to Cloudinary + MongoDB!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration fatal error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateImages();
}
