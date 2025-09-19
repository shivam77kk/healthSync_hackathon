import dotenv from 'dotenv';

dotenv.config();

// Verify critical environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined in .env file');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

if (!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET is not defined in .env file');
    process.exit(1);
}

// Import dependencies after dotenv configuration
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './Routers/authRoutes.js';
import userRoutes from './Routers/userRoutes.js';
import doctorRoutes from './Routers/DoctorRoutes.js';
import documentRoutes from './Routers/DocumentRouter.js';
import appointmentRoutes from './Routers/AppointmentRoutes.js';
import healthTrackerRoutes from './Routers/HealthTrackerRoutes.js';
import medicineReminderRoutes from './Routers/MedicineReminderRoutes.js';
import newsRoutes from './Routers/HealthNewsRoutes.js';
import newsApiRoutes from './Routers/NewsRoutes.js';
import chatbotRoutes from './Routers/ChatBotRoutes.js';
import riskScoreRoutes from './Routers/PredictiveScoringRoutes.js';
import googleAuthRoutes from './Routers/GoogleAuthRoutes.js';
import voicePrescriptionRoutes from './Routers/VoicePrescriptionRoutes.js';
import cautiooRoutes from './Routers/CautiooRoutes.js';
import chatRoutes from './Routers/ChatRoutes.js';
import { initializeGoogleStrategy } from './Controllers/GoogleAuthControllers.js';
import './config/cloudinary.config.js';

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 15000
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

initializeGoogleStrategy();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/authgoogle', googleAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health', healthTrackerRoutes);
app.use('/api/reminders', medicineReminderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/newsapi', newsApiRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/predictive-score', riskScoreRoutes);
app.use('/api/voice-prescription', voicePrescriptionRoutes);
app.use('/api/cautioo', cautiooRoutes);
app.use('/api/chat', chatRoutes);

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