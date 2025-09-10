import express from 'express';
import { getChatbotResponse } from '../Controllers/ChatBotControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', getChatbotResponse);

export default router;
