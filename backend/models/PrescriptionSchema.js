import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medications: [{ 
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        instructions: { type: String }
    }],
    notes: { 
        type: String,
        trim: true
    }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
