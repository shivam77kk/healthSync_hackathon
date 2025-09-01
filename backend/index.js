import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './Routers/userRoutes.js';
import './config/cloudinary.config.js'; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
})); 
app.use(cookieParser()); 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
});


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('HealthCare API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
