import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { v2 as cloudinary } from 'cloudinary';
import cloudinary from '../config/cloudinary.config.js';

const generateTokens = async (userId) => {
    try {
        const accessToken = jwt.sign(
            { id: userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Failed to generate tokens");
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, gender, bloodGroup } = req.body;

        if (!name || !email || !password || !age || !gender || !bloodGroup) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            bloodGroup,
            refreshToken: ""
        });

        await newUser.save();

        res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateTokens(user._id);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ 
            message: "Logged in successfully",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id; 

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        console.log('Uploading to Cloudinary:', {
            mimetype: req.file.mimetype,
            size: req.file.size,
            folder: 'healthcare_app_profile_images'
        });

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'healthcare_app_profile_images',
        });

        user.profileImage = result.secure_url;
        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.error("Cloudinary upload error:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            http_code: error.http_code
        });
        res.status(500).json({ message: "Error uploading image to Cloudinary", error: error.message });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is missing" });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || decoded.id !== user._id.toString()) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            
            user.refreshToken = newRefreshToken;
            await user.save();

            res.status(200).json({
                message: "Tokens refreshed successfully",
                accessToken,
            });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        
        const refreshToken = req.cookies.jwt;
        
        if (!refreshToken) {
            return res.sendStatus(204); 
        }

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = '';
            await user.save();
        }

    
        res.clearCookie('jwt', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error during logout", error: error.message });
    }
};
