import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bindi_cupcakery_products',
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary Upload Error:', error);
          res.status(500).json({ message: 'Image upload failed', error: error?.message });
          return;
        }
        res.status(200).json({
          message: 'Image uploaded successfully',
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error: any) {
    console.error('Upload route error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
});

export default router;
