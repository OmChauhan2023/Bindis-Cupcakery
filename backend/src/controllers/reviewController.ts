import { Request, Response } from 'express';
import prisma from '../config/db';

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

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userEmail = email?.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@guest.bindis`;
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: name.trim(), email: userEmail, phone: '' },
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: Number(productId),
        rating: Number(rating),
        comment: comment.trim(),
      },
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
    });

    return res.status(201).json({ message: 'Review posted', review });
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
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
    return res.json({ reviews });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.review.delete({ where: { id } });
    return res.json({ message: 'Review deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
