import HealthLog from '../models/HealthTrackerSchema.js';


export const createHealthLog = async (req, res) => {
    try {
        const { date, symptoms, vitals, conditions, notes } = req.body;
        const userId = req.user.id;

        const newLog = new HealthLog({
            userId,
            date,
            symptoms,
            vitals,
            conditions,
            notes,
        });

        await newLog.save();

        res.status(201).json({
            message: "Health log entry created successfully",
            log: newLog
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating health log entry", error: error.message });
    }
};


export const getHealthLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const logs = await HealthLog.find({ userId }).sort({ date: -1 });

        res.status(200).json({
            message: "Health logs retrieved successfully",
            logs
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving health logs", error: error.message });
    }
};


export const getSingleHealthLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const log = await HealthLog.findOne({ _id: id, userId });
        if (!log) {
            return res.status(404).json({ message: "Health log entry not found" });
        }

        res.status(200).json({
            message: "Health log entry retrieved successfully",
            log
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving health log entry", error: error.message });
    }
};

export const updateHealthLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { symptoms, vitals, conditions, notes } = req.body;

        const updatedLog = await HealthLog.findOneAndUpdate(
            { _id: id, userId },
            { $set: { symptoms, vitals, conditions, notes } },
            { new: true }
        );

        if (!updatedLog) {
            return res.status(404).json({ message: "Health log entry not found or you do not have permission to update it" });
        }

        res.status(200).json({
            message: "Health log entry updated successfully",
            log: updatedLog
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating health log entry", error: error.message });
    }
};


export const deleteHealthLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const log = await HealthLog.findOneAndDelete({ _id: id, userId });

        if (!log) {
            return res.status(404).json({ message: "Health log entry not found or you do not have permission to delete it" });
        }

        res.status(200).json({
            message: "Health log entry deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting health log entry", error: error.message });
    }
};
