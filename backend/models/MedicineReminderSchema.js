import mongoose from "mongoose";

const medicineReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicineName: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true,
        trim: true
    },
    reminderTime: {
        type: String, 
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const MedicineReminder = mongoose.model("MedicineReminder", medicineReminderSchema);

export default MedicineReminder;
