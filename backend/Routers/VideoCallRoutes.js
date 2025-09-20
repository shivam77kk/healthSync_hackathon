import express from 'express';
import {
    initiateVideoCall,
    joinVideoCall,
    endVideoCall,
    declineVideoCall,
    getActiveVideoCalls,
    getVideoCallHistory,
    sendVoicePrescriptionInCall
} from '../Controllers/VideoCallControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { audioUpload } from '../middleware/audioUpload.config.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Video call routes
router.post('/initiate', initiateVideoCall);
router.post('/:callId/join', joinVideoCall);
router.post('/:callId/end', endVideoCall);
router.post('/:callId/decline', declineVideoCall);
router.get('/active', getActiveVideoCalls);
router.get('/history', getVideoCallHistory);

// Voice prescription during video call (requires audio upload)
router.post('/:callId/voice-prescription', audioUpload.single('audio'), sendVoicePrescriptionInCall);

export default router;
