import RiskScore from '../models/PredictiveScoringSchema.js';
import HealthLog from '../models/HealthTrackerSchema.js';
import User from '../models/userSchema.js';

export const calculateRiskScore = async (req, res) => {
    try {
        const userId = req.user.id;
        
        
        const latestLog = await HealthLog.findOne({ userId }).sort({ date: -1 });

        if (!latestLog) {
            return res.status(404).json({ message: "No health log data found to calculate score" });
        }

        let score = 0;
        let notes = [];

        if (latestLog.vitals.bloodPressure && latestLog.vitals.bloodPressure.includes('140')) {
            score += 20;
            notes.push("Elevated blood pressure detected.");
        }
        if (latestLog.vitals.heartRate && latestLog.vitals.heartRate > 100) {
            score += 15;
            notes.push("High heart rate detected.");
        }
        if (latestLog.symptoms && latestLog.symptoms.includes('dizziness')) {
            score += 10;
            notes.push("Dizziness symptom logged.");
        }
        
      

        const newRiskScore = new RiskScore({
            userId,
            score,
            notes: notes.join('. '),
        });

        await newRiskScore.save();

        res.status(201).json({
            message: "Risk score calculated and saved",
            riskScore: newRiskScore
        });

    } catch (error) {
        res.status(500).json({ message: "Error calculating risk score", error: error.message });
    }
};


export const getRiskScoreHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const scores = await RiskScore.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Risk score history retrieved successfully",
            scores
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving risk score history", error: error.message });
    }
};
