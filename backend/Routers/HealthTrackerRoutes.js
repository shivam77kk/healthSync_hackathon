import express from 'express';
import { 
    createHealthLog,
    getHealthLogs,
    getSingleHealthLog,
    updateHealthLog,
    deleteHealthLog
} from '../Controllers/HealthTrackerControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', authenticateToken, createHealthLog);
router.get('/logs', authenticateToken, getHealthLogs);
router.get('/log/:id', authenticateToken, getSingleHealthLog);
router.put('/log/:id', authenticateToken, updateHealthLog);
router.delete('/log/:id', authenticateToken, deleteHealthLog);

export default router;
