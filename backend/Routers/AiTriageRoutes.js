import express from 'express';
import { getSpecialistSuggestion } from '../Controllers/AiTriageControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/specialist', authenticateToken, getSpecialistSuggestion);

export default router;



