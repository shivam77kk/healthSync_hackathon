import express from 'express';
import {
    createHealthAssessment,
    getUserHealthAssessments,
    getHealthAssessmentById,
    deleteHealthAssessment,
    updateHealthAssessment,
    reanalyzeHealthAssessment,
    getHealthTips,
    getDoctorHealthAssessments,
    addDoctorReview
} from '../Controllers/HealthAssessmentControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes for health assessments
router.post('/create', authenticateToken, createHealthAssessment);
router.get('/user', authenticateToken, getUserHealthAssessments);
router.get('/user/:id', authenticateToken, getHealthAssessmentById);
router.put('/user/:id', authenticateToken, updateHealthAssessment);
router.delete('/user/:id', authenticateToken, deleteHealthAssessment);
router.post('/user/:id/reanalyze', authenticateToken, reanalyzeHealthAssessment);

// General health tips endpoint
router.post('/tips', authenticateToken, getHealthTips);

// Doctor routes for reviewing health assessments
router.get('/doctor/review', authenticateToken, getDoctorHealthAssessments);
router.post('/doctor/:id/review', authenticateToken, addDoctorReview);

export default router;