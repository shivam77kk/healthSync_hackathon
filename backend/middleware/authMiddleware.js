import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';

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
        req.user = user;
        next();
    });
};

export const isUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: "Access denied. No user information." });
        }
        const user = await User.findById(req.user.id);
        if (user) {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. User not found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isDoctor = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: "Access denied. No user information." });
        }
        const doctor = await Doctor.findById(req.user.id);
        if (doctor) {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a doctor." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        req.user = null;
        return next();
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
};
