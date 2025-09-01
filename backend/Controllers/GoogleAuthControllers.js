// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/userSchema.js';
// import jwt from 'jsonwebtoken';




// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/api/auth/google/callback"
// },
// async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//             user = await User.findOne({ email: profile.emails[0].value });
//             if (user) {
              
//                 user.googleId = profile.id;
//                 await user.save();
//             } else {
               
//                 user = new User({
//                     googleId: profile.id,
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     password: '', 
//                     age: 0,
//                     gender: 'Other',
//                     bloodGroup: 'O+',
//                     refreshToken: ''
//                 });
//                 await user.save();
//             }
//         }
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// }));


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });

// export const googleCallbackHandler = async (req, res) => {
//     try {
    
//         const accessToken = jwt.sign(
//             { id: req.user._id, role: req.user.role },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '1h' }
//         );
//         const refreshToken = jwt.sign(
//             { id: req.user._id, role: req.user.role },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: '7d' }
//         );

//         res.cookie('jwt', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });

//         req.user.refreshToken = refreshToken;
//         await req.user.save();

//         res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);
//     } catch (error) {
//         res.status(500).json({ message: "Error during Google login", error: error.message });
//     }
// };
