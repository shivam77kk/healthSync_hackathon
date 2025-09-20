import express from 'express';
import { 
    bookAppointment,
    getUserAppointments,
    getDoctorAppointments,
    cancelAppointment,
    acceptAppointment,
    rejectAppointment,
    rescheduleAppointment,
    userRescheduleAppointment,
    // Availability features
    getDoctorAvailability,
    updateDoctorAvailability,
    getDoctorSlotStatus
} from '../Controllers/AppointmentControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', authenticateToken, bookAppointment);
router.get('/user', authenticateToken, getUserAppointments);
router.post('/cancel/:id', authenticateToken, cancelAppointment);
router.put('/reschedule-user/:id', authenticateToken, userRescheduleAppointment);

router.get('/doctor', authenticateToken, isDoctor, getDoctorAppointments);
router.put('/accept/:id', authenticateToken, isDoctor, acceptAppointment);
router.put('/reject/:id', authenticateToken, isDoctor, rejectAppointment);
router.put('/reschedule/:id', authenticateToken, isDoctor, rescheduleAppointment);

// Availability Management
router.get('/availability/:doctorId', getDoctorAvailability); // Public availability lookup
router.put('/availability', authenticateToken, isDoctor, updateDoctorAvailability); // Doctor updates their availability
router.get('/slots-status', authenticateToken, isDoctor, getDoctorSlotStatus); // Doctor checks slot utilization

export default router;
