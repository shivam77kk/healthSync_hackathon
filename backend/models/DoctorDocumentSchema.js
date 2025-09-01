import mongoose from "mongoose";

const doctorDocumentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: { 
        type: String,
        required: true
    }
}, { timestamps: true });

const DoctorDocument = mongoose.model("DoctorDocument", doctorDocumentSchema);

export default DoctorDocument;
