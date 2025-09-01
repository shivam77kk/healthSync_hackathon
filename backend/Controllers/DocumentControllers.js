import Document from '../models/DocumentSchema.js';
import { v2 as cloudinary } from 'cloudinary';


export const uploadDocument = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id; 

        if (!req.file) {
            return res.status(400).json({ message: "No document file provided" });
        }
        
   
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'healthcare_app_documents', 
        });

    
        const newDocument = new Document({
            userId,
            title,
            description,
            fileUrl: result.secure_url,
            publicId: result.public_id,
        });

        await newDocument.save();

        res.status(201).json({
            message: "Document uploaded successfully",
            document: newDocument,
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ message: "Error uploading document", error: error.message });
    }
};


export const getDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Documents retrieved successfully",
            documents,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error: error.message });
    }
};


export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const document = await Document.findOne({ _id: id, userId });

        if (!document) {
            return res.status(404).json({ message: "Document not found or you do not have permission to delete it" });
        }

        
        await cloudinary.uploader.destroy(document.publicId);

        
        await Document.findByIdAndDelete(id);

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error: error.message });
    }
};
