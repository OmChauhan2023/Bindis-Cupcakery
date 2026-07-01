import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
