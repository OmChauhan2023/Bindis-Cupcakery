import express from 'express';
import { handleChat } from '../controllers/chatController';

const router = express.Router();

// POST /api/chat - Public route for customer chatbot interaction
router.post('/', handleChat);

export default router;
