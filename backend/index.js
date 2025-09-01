import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './Routers/userRoutes.js';
import doctorRoutes from './Routers/DoctorRoutes.js';
import documentRoutes from './Routers/DocumentRouter.js';
import appointmentRoutes from './Routers/AppointmentRoutes.js';
import healthTrackerRoutes from './Routers/HealthTrackerRoutes.js';
import medicineReminderRoutes from './Routers/MedicineReminderRoutes.js';
import newsRoutes from './Routers/HealthNewsRoutes.js';
import chatbotRoutes from './Routers/ChatBotRoutes.js';
import riskScoreRoutes from './Routers/PredictiveScoringRoutes.js';
// import googleAuthRoutes from './Routers/GoogleAuthRoutes.js'; 
import './config/cloudinary.config.js'; 
import passport from 'passport'; 
import session from 'express-session'; 
import './Controllers/GoogleAuthControllers.js'; 

dotenv.config();

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

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
});

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health', healthTrackerRoutes);
app.use('/api/reminders', medicineReminderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/predictive-score', riskScoreRoutes);
// app.use('/api/auth', googleAuthRoutes); 

app.get('/', (req, res) => {
    res.send('HealthCare API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
