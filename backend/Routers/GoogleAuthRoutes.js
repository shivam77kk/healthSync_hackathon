import express from 'express';
import passport from 'passport';
import { googleCallbackHandler, logoutHandler } from '../Controllers/GoogleAuthControllers.js';

const router = express.Router();

// Basic route to test if Google auth is working
router.get('/', (req, res) => {
    res.json({ 
        message: 'Google Authentication Service is running',
        availableRoutes: {
            'GET /google': 'Initiate Google OAuth login',
            'GET /google/callback': 'Google OAuth callback',
            'POST /logout': 'Logout user'
        }
    });
});

// Initiate Google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login'
}), googleCallbackHandler);

// Logout route
router.post('/logout', logoutHandler);

export default router;