import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../Controllers/DocumentControllers.js';
import { upload } from '../middleware/multer.config.js'; 
import { authenticateToken } from '../middleware/authMiddleware.js'; 
const router = express.Router();


router.get('/', authenticateToken, getDocuments);


router.post('/upload', authenticateToken, upload.single('documentFile'), uploadDocument);

router.delete('/:id', authenticateToken, deleteDocument);

export default router;
