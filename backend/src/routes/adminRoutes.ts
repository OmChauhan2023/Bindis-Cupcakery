import express from 'express';
import { getStats, getCustomers } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/customers', getCustomers);

export default router;
