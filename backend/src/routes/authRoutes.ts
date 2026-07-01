import express from 'express';
import { registerUser, registerAdmin, login, logout, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
