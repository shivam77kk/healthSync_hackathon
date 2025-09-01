import express from 'express';
import { 
    registerDoctor, 
    uploadDoctorDocument, 
    getAllDoctors,
    getDoctorProfile,
    getDoctorDocuments
} from '../Controllers/DoctorControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.config.js';

const router = express.Router();


router.post('/register', registerDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorProfile);
router.get('/:id/documents', getDoctorDocuments);


router.post('/upload-document', authenticateToken, isDoctor, upload.single('doctorDocument'), uploadDoctorDocument);

export default router;
