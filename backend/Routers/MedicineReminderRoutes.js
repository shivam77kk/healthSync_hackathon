import express from 'express';
import { 
    createReminder,
    getReminders,
    deleteReminder
} from '../Controllers/MedicineReminderControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createReminder);
router.get('/', authenticateToken, getReminders);
router.delete('/:id', authenticateToken, deleteReminder);

export default router;
