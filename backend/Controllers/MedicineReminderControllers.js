import MedicineReminder from '../models/MedicineReminderSchema.js';
import cron from 'node-cron';


cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    try {
        const remindersDue = await MedicineReminder.find({ reminderTime: currentTime });
        
        remindersDue.forEach(reminder => {
            console.log(`REMINDER: It's time to take ${reminder.dosage} of ${reminder.medicineName}.`);
       
        });
    } catch (error) {
        console.error('Error fetching medicine reminders:', error);
    }
});


export const createReminder = async (req, res) => {
    try {
        const { medicineName, dosage, reminderTime, frequency, notes } = req.body;
        const userId = req.user.id;

        if (!medicineName || !dosage || !reminderTime) {
            return res.status(400).json({ message: "Medicine name, dosage, and time are required" });
        }

        const newReminder = new MedicineReminder({
            userId,
            medicineName,
            dosage,
            reminderTime,
            frequency,
            notes,
        });

        await newReminder.save();

        res.status(201).json({
            message: "Reminder created successfully",
            reminder: newReminder
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating reminder", error: error.message });
    }
};

export const getReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        const reminders = await MedicineReminder.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Reminders retrieved successfully",
            reminders
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving reminders", error: error.message });
    }
};


export const deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const reminder = await MedicineReminder.findOneAndDelete({ _id: id, userId });
        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found or you do not have permission to delete it" });
        }

        res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reminder", error: error.message });
    }
};
