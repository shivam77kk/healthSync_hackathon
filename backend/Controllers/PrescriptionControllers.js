import Prescription from '../models/PrescriptionSchema.js';
import User from '../models/userSchema.js';


const checkAIAlerts = async (userId, prescription) => {
  
    const user = await User.findById(userId);
    const allergies = user.allergies || []; 

    const riskyMeds = prescription.medications.filter(med => allergies.includes(med.name));

    if (riskyMeds.length > 0) {
        return `Alert: This patient has a known allergy to: ${riskyMeds.map(m => m.name).join(', ')}.`;
    }
    
    
    const hasInteraction = false; 
    if (hasInteraction) {
        return "Alert: Potential drug interaction detected with ongoing medications.";
    }

    return null; 
};

export const createPrescription = async (req, res) => {
    try {
        const { userId, medications, notes } = req.body;
        const doctorId = req.user.id;

        const patient = await User.findOne({ _id: userId, role: 'user' });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check for AI alerts before saving
        const aiAlert = await checkAIAlerts(userId, { medications });
        if (aiAlert) {
            return res.status(400).json({ message: aiAlert });
        }

        const newPrescription = new Prescription({
            userId,
            doctorId,
            medications,
            notes
        });

        await newPrescription.save();

        res.status(201).json({
            message: "Prescription saved successfully",
            prescription: newPrescription
        });
    } catch (error) {
        res.status(500).json({ message: "Error saving prescription", error: error.message });
    }
};


export const getPatientPrescriptions = async (req, res) => {
    try {
        const { id } = req.params; 
        const prescriptions = await Prescription.find({ userId: id })
            .populate('doctorId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Patient prescriptions retrieved successfully",
            prescriptions
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving prescriptions", error: error.message });
    }
};
