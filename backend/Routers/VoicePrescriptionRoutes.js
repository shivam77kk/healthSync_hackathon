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

router.post('/patient/:id/acknowledge', 
    authenticateToken,
    isUser,
    acknowledgeVoicePrescription
);

router.get('/patient/notifications', 
    authenticateToken,
    isUser,
    getPatientNotifications
);


router.post('/patient/notifications/:notificationId/read', 
    authenticateToken,
    isUser,
    markNotificationAsRead
);

router.get('/patient/notification-stats', 
    authenticateToken,
    isUser,
    getNotificationStats
);

router.get('/:id', 
    authenticateToken,
    getVoicePrescriptionById
);

router.post('/test-speech-to-text', 
    authenticateToken,
    voicePrescriptionUpload.single('audio'),
    testSpeechToText
);

router.post('/process', authenticateToken, processVoicePrescription);
router.post('/save', authenticateToken, savePrescription);

router.use(handleAudioUploadError);

export default router;
