import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';


export const initializeGoogleStrategy = () => {
    // console.log('Initializing Google Strategy...');
    // console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    // console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined');
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Google Strategy Callback - Profile:', profile.id);
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    console.log('Linking Google ID to existing user:', user.email);
                    user.googleId = profile.id;
                    await user.save();
                    console.log('User updated with Google ID:', user._id);
                } else {
                    console.log('Creating new user:', profile.emails[0].value);
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                       
                        age: 0,
                        gender: 'Other',
                        bloodGroup: 'O+',
                        refreshToken: '',
                        role: 'user'
                    });
                    console.log('User data before save:', user);
                    await user.save();
                    console.log('New user created:', user._id);
                }
            } else {
                console.log('Existing user found:', user.email);
            }
            done(null, user);
        } catch (error) {
            console.error('Error in Google Strategy callback:', error.message);
            done(error, null);
        }
    }));
};


passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user:', id);
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error in deserializeUser:', error.message);
        done(error, null);
    }
});


export const googleCallbackHandler = async (req, res) => {
    console.log('Google callback handler - User:', req.user?.email);
    try {
        const accessToken = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

       
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    
        req.user.refreshToken = refreshToken;
        await req.user.save();
        console.log('Refresh token saved for user:', req.user.email);

    
        res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);
    } catch (error) {
        console.error('Error in googleCallbackHandler:', error.message);
        res.status(500).json({ message: 'Error during Google login', error: error.message });
    }
};