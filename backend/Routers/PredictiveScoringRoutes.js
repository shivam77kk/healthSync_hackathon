import express from 'express';
import { calculateRiskScore, getRiskScoreHistory } from '../Controllers/PredictiveScoringControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/calculate', authenticateToken, calculateRiskScore);
router.get('/history', authenticateToken, getRiskScoreHistory);

export default router;
