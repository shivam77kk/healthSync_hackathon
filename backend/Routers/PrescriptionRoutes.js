import express from 'express';
import { 
    createPrescription,
    getPatientPrescriptions 
} from '../Controllers/PrescriptionControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, isDoctor, createPrescription);
router.get('/patient/:id', authenticateToken, isDoctor, getPatientPrescriptions);

export default router;
