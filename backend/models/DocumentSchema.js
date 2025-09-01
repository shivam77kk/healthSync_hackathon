import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
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

const Document = mongoose.model("Document", documentSchema);

export default Document;
