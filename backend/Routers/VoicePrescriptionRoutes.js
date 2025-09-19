import express from 'express';
import { 
    createVoicePrescription,
    getDoctorVoicePrescriptions,
    getPatientVoicePrescriptions,
    getVoicePrescriptionById,
    acknowledgeVoicePrescription,
    updateVoicePrescription,
    deleteVoicePrescription,
    testSpeechToText,
    // Notification endpoints
    getPatientNotifications,
    markNotificationAsRead,
    getNotificationStats,
    // Legacy endpoints
    processVoicePrescription,
    savePrescription
} from '../Controllers/VoicePrescriptionControllers.js';
import { authenticateToken, isUser, isDoctor } from '../middleware/authMiddleware.js';
import { voicePrescriptionUpload, handleAudioUploadError } from '../middleware/audioUpload.config.js';

const router = express.Router();

// =================== DOCTOR ROUTES ===================

// Create voice prescription with audio upload (Doctor only)
router.post('/create-voice-prescription', 
    authenticateToken,
    isDoctor,
    voicePrescriptionUpload.single('audio'),
    createVoicePrescription
);

// Get doctor's own voice prescriptions (Doctor only)
router.get('/doctor/prescriptions', 
    authenticateToken,
    isDoctor,
    getDoctorVoicePrescriptions
);

// Update voice prescription (Doctor only - their own)
router.put('/doctor/:id', 
    authenticateToken,
    isDoctor,
    updateVoicePrescription
);

// Delete voice prescription (Doctor only - their own)
router.delete('/doctor/:id', 
    authenticateToken,
    isDoctor,
    deleteVoicePrescription
);

// =================== PATIENT ROUTES ===================

// Get patient's voice prescriptions (User/Patient only)
router.get('/patient/prescriptions', 
    authenticateToken,
    isUser,
    getPatientVoicePrescriptions
);

// Acknowledge voice prescription (Patient only)
router.post('/patient/:id/acknowledge', 
    authenticateToken,
    isUser,
    acknowledgeVoicePrescription
);

// Get patient notifications (Patient only)
router.get('/patient/notifications', 
    authenticateToken,
    isUser,
    getPatientNotifications
);

// Mark notification as read (Patient only)
router.post('/patient/notifications/:notificationId/read', 
    authenticateToken,
    isUser,
    markNotificationAsRead
);

// Get notification statistics (Patient only)
router.get('/patient/notification-stats', 
    authenticateToken,
    isUser,
    getNotificationStats
);

// =================== SHARED ROUTES ===================

// Get single voice prescription by ID (Both doctor and patient can access)
router.get('/:id', 
    authenticateToken,
    getVoicePrescriptionById
);

// =================== DEVELOPMENT/TESTING ROUTES ===================

// Test speech-to-text functionality
router.post('/test-speech-to-text', 
    authenticateToken,
    voicePrescriptionUpload.single('audio'),
    testSpeechToText
);

// =================== LEGACY ROUTES (DEPRECATED) ===================

// Legacy endpoints for backward compatibility
router.post('/process', authenticateToken, processVoicePrescription);
router.post('/save', authenticateToken, savePrescription);

// =================== ERROR HANDLING MIDDLEWARE ===================

// Handle multer/audio upload errors
router.use(handleAudioUploadError);

export default router;
