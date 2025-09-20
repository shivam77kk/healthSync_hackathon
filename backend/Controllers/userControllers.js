import User from '../models/userSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateTokens = async (userId) => { 
    try {
        const accessToken = jwt.sign(
            { id: userId, role: 'user' }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: userId, role: 'user' }, 
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
            return res.status(400).json({ message: "Name, email, password, age, gender, and blood group are required" });
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
            profileImage: ""
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age,
                gender: newUser.gender,
                bloodGroup: newUser.bloodGroup,
                profileImage: newUser.profileImage,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
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

        res.status(200).json({
            message: "Logged in successfully",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
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
        
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'healthcare_user_profiles', 
        });

        user.profileImage = result.secure_url;
        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ message: "Error uploading image to Cloudinary", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(403).json({ message: "User not found" });
            }

            const { accessToken } = await generateTokens(user._id);
            
            res.status(200).json({
                message: "Access token refreshed successfully",
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user profile", error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId); 
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};
