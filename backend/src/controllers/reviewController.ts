import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import User from '../models/User';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req: Request, res: Response) => {
  try {
    const { name, email, productId, rating, comment } = req.body;

    if (!name?.trim() || !comment?.trim() || !rating || !productId) {
      return res.status(400).json({ message: 'Name, product, rating, and comment are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1–5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userEmail = email?.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@guest.bindis`;
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: userEmail,
        phone: '',
      });
    }

    const review = await Review.create({
      user: user._id,
      product: product._id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name')
      .lean();

    return res.status(201).json({ message: 'Review posted', review: populatedReview });
  } catch (error: any) {
    console.error('Review error:', error);
    return res.status(500).json({ message: 'Could not save review', error: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('product', 'name')
      .lean();

    const formatted = reviews.map((r) => ({
      ...r,
      id: r._id,
    }));

    return res.json({ reviews: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Review.findByIdAndDelete(id);
    return res.json({ message: 'Review deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
