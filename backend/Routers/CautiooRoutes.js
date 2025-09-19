import express from 'express';
import {
    createCautioo,
    getAllCautioos,
    getFollowingCautioos,
    getDoctorCautioos,
    getCautiooById,
    toggleLikeCautioo,
    toggleFollowDoctor,
    getFollowedDoctors,
    getUserLikedCautioos,
    deleteCautioo,
    updateCautioo
} from '../Controllers/CautiooControllers.js';
import { authenticateToken, isUser, isDoctor, optionalAuth } from '../middleware/authMiddleware.js';
import { cautiooUpload } from '../middleware/videoUpload.config.js';

const router = express.Router();


router.post('/create', 
    authenticateToken, 
    isDoctor, 
    cautiooUpload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), 
    createCautioo
);


router.get('/my-cautioos', 
    authenticateToken, 
    isDoctor, 
    getDoctorCautioos
);

router.put('/:id', 
    authenticateToken, 
    isDoctor, 
    updateCautioo
);

router.delete('/:id', 
    authenticateToken, 
    isDoctor, 
    deleteCautioo
);

router.get('/following', 
    authenticateToken, 
    isUser, 
    getFollowingCautioos
);

router.post('/:id/like', 
    authenticateToken, 
    isUser, 
    toggleLikeCautioo
);

router.post('/follow/:doctorId', 
    authenticateToken, 
    isUser, 
    toggleFollowDoctor
);

router.get('/followed-doctors', 
    authenticateToken, 
    isUser, 
    getFollowedDoctors
);

router.get('/liked', 
    authenticateToken, 
    isUser, 
    getUserLikedCautioos
);

router.get('/all', 
    optionalAuth,  
    getAllCautioos
);

router.get('/:id', 
    optionalAuth,  
    getCautiooById
);

router.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            message: 'File size too large. Maximum allowed size is 100MB for videos.' 
        });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
            message: 'Too many files or unexpected field name.' 
        });
    } else if (error.message) {
        return res.status(400).json({ 
            message: error.message 
        });
    }
    next(error);
});

export default router;
