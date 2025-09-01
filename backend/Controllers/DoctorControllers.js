import User from '../models/userSchema.js';
import DoctorDocument from '../models/DoctorDocumentSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';

export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, qualifications } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ message: "Doctor with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new User({
            name,
            email,
            password: hashedPassword,
            qualifications,
            role: 'doctor', 
        });

        await newDoctor.save();

        res.status(201).json({ 
            message: "Doctor registered successfully.", 
            doctor: {
                id: newDoctor._id,
                name: newDoctor.name,
                email: newDoctor.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadDoctorDocument = async (req, res) => {
    try {
        const { title } = req.body;
        const doctorId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No document file provided" });
        }
        
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'healthcare_doctor_documents',
        });

        const newDoc = new DoctorDocument({
            doctorId,
            title,
            fileUrl: result.secure_url,
            publicId: result.public_id,
        });

        await newDoc.save();

        res.status(201).json({
            message: "Document uploaded successfully",
            document: newDoc,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ message: "Error uploading document", error: error.message });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password -refreshToken');

        res.status(200).json({
            message: "Doctors retrieved successfully",
            doctors,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving doctors", error: error.message });
    }
};

export const getDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findOne({ _id: id, role: 'doctor' }).select('-password -refreshToken');

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor profile retrieved successfully",
            doctor,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving doctor profile", error: error.message });
    }
};

export const getDoctorDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const documents = await DoctorDocument.find({ doctorId: id });

        res.status(200).json({
            message: "Doctor documents retrieved successfully",
            documents,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error: error.message });
    }
};
