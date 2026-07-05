import express from 'express';
import { registerUser, registerAdmin, login, logout, getMe, updateProfile, googleAuth } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/google', googleAuth);
// SECURITY: register-admin now requires an existing admin JWT — no public access
router.post('/register-admin', protect, adminOnly, registerAdmin);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
