import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';


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

export const isDoctor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'doctor') {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a doctor." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
