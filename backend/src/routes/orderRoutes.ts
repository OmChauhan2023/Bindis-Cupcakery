import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, adminOnly, getAllOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/:id')
  .put(protect, adminOnly, updateOrder)
  .delete(protect, adminOnly, deleteOrder);

export default router;
