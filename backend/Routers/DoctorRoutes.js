import express from 'express';
import { 
    registerDoctor, 
    loginDoctor,
    logoutDoctor,
    uploadDoctorDocument, 
    getAllDoctors,
    getDoctorProfile,
    getDoctorDocuments,
    getPatientHistory
} from '../Controllers/DoctorControllers.js';
import { createPrescription, getPatientPrescriptions } from '../Controllers/PrescriptionControllers.js';
import { authenticateToken, isDoctor } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.config.js';

const router = express.Router();

    
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorProfile);
router.post('/upload-document', authenticateToken, isDoctor, upload.single('doctorDocument'), uploadDoctorDocument);
router.get('/:id/documents', getDoctorDocuments);


router.post('/logout', authenticateToken, isDoctor, logoutDoctor);
router.get('/patient/:id/history', authenticateToken, isDoctor, getPatientHistory);


router.post('/prescribe', authenticateToken, isDoctor, createPrescription);
router.get('/patient/:id/prescriptions', authenticateToken, isDoctor, getPatientPrescriptions);


export default router;
