import express from 'express';
import passport from 'passport';
import { googleCallbackHandler, logoutHandler } from '../Controllers/GoogleAuthControllers.js';

const router = express.Router();

// Initiate Google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
    session: false
}), googleCallbackHandler);

// Logout route
router.post('/logout', logoutHandler);

export default router;