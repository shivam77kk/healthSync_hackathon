import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorSchema.js'; // Changed from User to Doctor

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        console.log('Decoded User:', user); // Debug log
        req.user = user;
        next();
    });
};

export const isDoctor = async (req, res, next) => {
    try {
        console.log('Req User:', req.user); // Debug log
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: "Access denied. No user information." });
        }
        const doctor = await Doctor.findById(req.user.id);
        if (doctor) {
            next(); // Assume all Doctor documents are doctors
        } else {
            return res.status(403).json({ message: "Access denied. Not a doctor." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};