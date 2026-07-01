import express from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

router.route('/')
  .post(createReview)
  .get(getReviews);

router.route('/:id')
  .delete(protect, adminOnly, deleteReview);

export default router;
