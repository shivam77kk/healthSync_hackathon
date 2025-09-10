import Appointment from '../models/AppointmentSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, reason } = req.body;
        const userId = req.user.id;
        console.log('Booking for userId:', userId, 'with doctorId:', doctorId); // Debug log

        const doctor = await Doctor.findById(doctorId);
        console.log('Found Doctor:', doctor); // Debug log
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const newAppointment = new Appointment({
            userId,
            doctorId,
            date,
            reason,
            status: 'booked' // Adding status to match a typical AppointmentSchema
        });

        await newAppointment.save();

        res.status(201).json({ 
            message: "Appointment booked successfully",
            appointment: newAppointment 
        });
    } catch (error) {
        console.error('Error in bookAppointment:', error); // Debug log
        res.status(500).json({ message: "Error booking appointment", error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findOne({ _id: id, userId });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or you do not have permission to cancel it" });
        }

        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({ message: "Cannot cancel a completed or already cancelled appointment" });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error canceling appointment", error: error.message });
    }
};

export const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;

        const appointments = await Appointment.find({ userId })
            .populate('doctorId', 'name qualifications profileImage')
            .sort({ date: -1 });

        res.status(200).json({
            message: "User appointments retrieved successfully",
            appointments
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user appointments", error: error.message });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const appointments = await Appointment.find({ doctorId })
            .populate('userId', 'name profileImage age bloodGroup')
            .sort({ date: -1 });

        res.status(200).json({
            message: "Doctor appointments retrieved successfully",
            appointments
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving doctor appointments", error: error.message });
    }
};

export const acceptAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;
        
        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, doctorId, status: 'booked' },
            { $set: { status: 'accepted' } },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be accepted" });
        }

        res.status(200).json({
            message: "Appointment accepted successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error accepting appointment", error: error.message });
    }
};

export const rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, doctorId, status: 'booked' },
            { $set: { status: 'rejected' } },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rejected" });
        }

        res.status(200).json({
            message: "Appointment rejected successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting appointment", error: error.message });
    }
};

export const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate } = req.body;
        const doctorId = req.user.id;

        if (!newDate) {
            return res.status(400).json({ message: "New date is required" });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, doctorId, status: { $in: ['booked', 'rescheduled'] } },
            { $set: { date: newDate, status: 'rescheduled' } },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rescheduled" });
        }

        res.status(200).json({
            message: "Appointment rescheduled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error rescheduling appointment", error: error.message });
    }
};

export const userRescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate } = req.body;
        const userId = req.user.id;

        if (!newDate) {
            return res.status(400).json({ message: "New date is required" });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, userId, status: { $in: ['booked', 'accepted'] } },
            { $set: { date: newDate, status: 'rescheduled' } },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rescheduled" });
        }

        res.status(200).json({
            message: "Appointment rescheduled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error rescheduling appointment", error: error.message });
    }
};
