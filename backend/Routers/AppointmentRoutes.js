import express from 'express';
import { 
    bookAppointment,
    getUserAppointments,
    getDoctorAppointments,
    cancelAppointment
} from '../Controllers/AppointmentControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/book', authenticateToken, bookAppointment);
router.get('/user', authenticateToken, getUserAppointments);
router.post('/cancel/:id', authenticateToken, cancelAppointment);


router.get('/doctor', authenticateToken, isDoctor, getDoctorAppointments);

export default router;
