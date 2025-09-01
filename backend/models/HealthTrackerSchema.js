import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    symptoms: [{
        type: String,
        trim: true
    }],
    vitals: {
        bloodPressure: { type: String, trim: true },
        heartRate: { type: Number },
        temperature: { type: Number },
        // Add more vitals as needed (e.g., blood sugar)
    },
    conditions: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const HealthLog = mongoose.model("HealthLog", healthLogSchema);

export default HealthLog;