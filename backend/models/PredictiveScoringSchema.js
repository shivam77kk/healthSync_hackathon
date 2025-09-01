import mongoose from "mongoose";

const riskScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: { 
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
}, { timestamps: true });

const RiskScore = mongoose.model("RiskScore", riskScoreSchema);

export default RiskScore;
