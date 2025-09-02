import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './Routers/userRoutes.js';
import doctorRoutes from './Routers/DoctorRoutes.js';
import documentRoutes from './Routers/DocumentRouter.js';
import appointmentRoutes from './Routers/AppointmentRoutes.js';
import healthTrackerRoutes from './Routers/HealthTrackerRoutes.js';
import medicineReminderRoutes from './Routers/MedicineReminderRoutes.js';
import newsRoutes from './Routers/HealthNewsRoutes.js';
import chatbotRoutes from './Routers/ChatBotRoutes.js';
import riskScoreRoutes from './Routers/PredictiveScoringRoutes.js';
import googleAuthRoutes from './Routers/GoogleAuthRoutes.js';
import { initializeGoogleStrategy } from './Controllers/GoogleAuthControllers.js';
import './config/cloudinary.config.js';

dotenv.config({ debug: true });

// Verify environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined in .env file');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

// console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
// console.log('MONGO_URI:', process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 15000
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


initializeGoogleStrategy();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health', healthTrackerRoutes);
app.use('/api/reminders', medicineReminderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/predictive-score', riskScoreRoutes);
app.use('/api/auth', googleAuthRoutes);

app.get('/', (req, res) => {
    res.send('HealthCare API is running...');
});


app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});