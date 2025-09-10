import express from 'express';
import { 
    registerUser, 
    loginUser, 
    refreshAccessToken,
    logoutUser
} from '../Controllers/userControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
    validateRegistration, 
    validateLogin, 
    handleValidationErrors 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.post('/logout', authenticateToken, logoutUser);

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
    res.status(200).json({ 
        message: "Token is valid", 
        user: { id: req.user.id } 
    });
});

export default router;