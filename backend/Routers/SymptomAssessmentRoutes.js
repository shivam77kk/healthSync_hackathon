import express from 'express';
import {
    submitSymptoms,
    getAssessmentHistory,
    getAssessmentDetails,
    getAssessmentsByUrgency,
    getAssessmentStatistics,
    updateAssessmentStatus,
    getPendingAssessments
} from '../Controllers/SymptomAssessmentControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Patient routes
router.post('/submit', submitSymptoms);
router.get('/history', getAssessmentHistory);
router.get('/statistics', getAssessmentStatistics);
router.get('/:assessmentId', getAssessmentDetails);

// Doctor routes (require doctor authentication)
router.get('/doctor/pending', isDoctor, getPendingAssessments);
router.get('/doctor/urgency/:urgency', isDoctor, getAssessmentsByUrgency);
router.put('/doctor/:assessmentId/status', isDoctor, updateAssessmentStatus);

export default router;

