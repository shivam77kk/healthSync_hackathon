import express from 'express';
import { 
    registerDoctor, 
    uploadDoctorDocument, 
    getAllDoctors,
    getDoctorProfile,
    getDoctorDocuments
} from '../controllers/doctor.controller.js';
import { authenticateToken, isDoctor } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.config.js';

const router = express.Router();


router.post('/register', registerDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorProfile);
router.get('/:id/documents', getDoctorDocuments);


router.post('/upload-document', authenticateToken, isDoctor, upload.single('doctorDocument'), uploadDoctorDocument);

export default router;
