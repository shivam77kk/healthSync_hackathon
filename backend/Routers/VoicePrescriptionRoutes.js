import express from 'express';
import { 
    processVoicePrescription,
    savePrescription
} from '../Controllers/VoicePrescriptionControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/process', authenticateToken, processVoicePrescription);
router.post('/save', authenticateToken, savePrescription);

export default router;