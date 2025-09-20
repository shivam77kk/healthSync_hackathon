import express from 'express';
import {
    searchPatients,
    searchDoctors,
    createOrGetChat,
    getUserChats,
    getChatMessages,
    sendTextMessage,
    sendVoicePrescriptionInChat,
    getChatFromAppointment,
    archiveChat,
    getChatStats
} from '../Controllers/ChatControllers.js';
import { authenticateToken, isUser, isDoctor } from '../middleware/authMiddleware.js';
import { voicePrescriptionUpload, handleAudioUploadError } from '../middleware/audioUpload.config.js';

const router = express.Router();

// =================== SEARCH ENDPOINTS ===================

// Search patients by email (Doctor only)
router.get('/search/patients', 
    authenticateToken,
    isDoctor,
    searchPatients
);

// Search doctors by email (Patient only)
router.get('/search/doctors', 
    authenticateToken,
    isUser,
    searchDoctors
);

// =================== CHAT MANAGEMENT ===================

// Create or get existing chat
router.post('/create-or-get', 
    authenticateToken,
    createOrGetChat
);

// Get user's chat list
router.get('/chats', 
    authenticateToken,
    getUserChats
);

// Get chat statistics
router.get('/stats', 
    authenticateToken,
    getChatStats
);

// Archive chat
router.patch('/:chatId/archive', 
    authenticateToken,
    archiveChat
);

// =================== APPOINTMENT INTEGRATION ===================

// Get chat from appointment (easy access from appointment)
router.get('/appointment/:appointmentId/chat', 
    authenticateToken,
    getChatFromAppointment
);

// =================== MESSAGING ===================

// Get messages in a chat
router.get('/:chatId/messages', 
    authenticateToken,
    getChatMessages
);

// Send text message
router.post('/:chatId/message', 
    authenticateToken,
    sendTextMessage
);

// Send voice prescription in chat (Doctor only)
router.post('/:chatId/voice-prescription', 
    authenticateToken,
    isDoctor,
    voicePrescriptionUpload.single('audio'),
    sendVoicePrescriptionInChat
);

// =================== ERROR HANDLING MIDDLEWARE ===================

// Handle audio upload errors
router.use(handleAudioUploadError);

export default router;
