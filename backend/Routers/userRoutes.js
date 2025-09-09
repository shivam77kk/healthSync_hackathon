import express from 'express';
import { 
    registerUser, 
    loginUser, 
    changePassword, 
    uploadProfileImage, 
    refreshAccessToken,
    logoutUser,
    getUserProfile
} from '../Controllers/userControllers.js';
import { upload } from '../middleware/multer.config.js';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const router = express.Router();


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
   
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            
            return res.status(403).json({ message: "Invalid or expired token" });
        }
       
        req.user = user;
        next();
    });
};


router.post('/register', registerUser);


router.post('/logout', logoutUser); 


router.post('/login', loginUser);


router.post('/refresh-token', refreshAccessToken);


router.post('/change-password', authenticateToken, changePassword);


router.post('/upload-profile-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);

router.get('/profile', authenticateToken, getUserProfile);

export default router;
