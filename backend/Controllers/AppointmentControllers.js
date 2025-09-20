import Appointment from '../models/AppointmentSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, reason, timeSlot } = req.body;
        const userId = req.user.id;

        if (!doctorId || !date || !reason || !timeSlot) {
            return res.status(400).json({ message: "Doctor ID, date, reason, and time slot are required" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointmentDate = new Date(date);
        const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (!doctor.availability?.workingDays?.includes(dayName)) {
            return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
        }

        // Initialize slots and attempt booking
        doctor.initializeSlotsForDate(appointmentDate);
        try {
            doctor.bookSlot(appointmentDate, timeSlot, null);
        } catch (slotErr) {
            return res.status(400).json({ message: slotErr.message || 'Selected time slot is not available' });
        }

        const newAppointment = new Appointment({
            userId,
            doctorId,
            date: appointmentDate,
            reason,
            status: 'booked',
            time: timeSlot,
            slotInfo: {
                timeSlot,
                slotDate: appointmentDate
            }
        });

        await newAppointment.save();

        // Link the appointmentId to the doctor's slot
        const dateString = appointmentDate.toISOString().split('T')[0];
        const daySlots = doctor.dailySlotStatus.get(dateString);
        const slot = daySlots.slots.find(s => s.time === timeSlot);
        if (slot) {
            slot.appointmentId = newAppointment._id;
            doctor.dailySlotStatus.set(dateString, daySlots);
            await doctor.save();
        }

        await newAppointment.populate('doctorId', 'name qualifications profileImage');

        res.status(201).json({ 
            message: "Appointment booked successfully",
            appointment: newAppointment 
        });
    } catch (error) {
        console.error('Error in bookAppointment:', error);
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

        // Release the doctor's slot
        const doctor = await Doctor.findById(appointment.doctorId);
        if (doctor && appointment.slotInfo) {
            try {
                const cancelled = doctor.cancelSlot(appointment.slotInfo.slotDate, appointment.slotInfo.timeSlot);
                if (cancelled) await doctor.save();
            } catch (e) {
                console.error('Slot cancel error:', e.message);
            }
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        console.error('Error canceling appointment:', error);
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

        const appointment = await Appointment.findOne({ _id: id, doctorId, status: 'booked' });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rejected" });
        }

        // Release the reserved slot upon rejection
        const doctor = await Doctor.findById(doctorId);
        if (doctor && appointment.slotInfo) {
            try {
                const cancelled = doctor.cancelSlot(appointment.slotInfo.slotDate, appointment.slotInfo.timeSlot);
                if (cancelled) await doctor.save();
            } catch (e) {
                console.error('Slot release on rejection error:', e.message);
            }
        }

        appointment.status = 'rejected';
        await appointment.save();

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
        const { newDate, newTimeSlot } = req.body;
        const doctorId = req.user.id;

        if (!newDate || !newTimeSlot) {
            return res.status(400).json({ message: "New date and time slot are required" });
        }

        const appointment = await Appointment.findOne({ _id: id, doctorId, status: { $in: ['booked', 'accepted', 'rescheduled'] } });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rescheduled" });
        }

        const doctor = await Doctor.findById(doctorId);
        const newAppointmentDate = new Date(newDate);
        const dayName = newAppointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (!doctor.availability?.workingDays?.includes(dayName)) {
            return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
        }

        // Release old slot
        if (appointment.slotInfo) {
            doctor.cancelSlot(appointment.slotInfo.slotDate, appointment.slotInfo.timeSlot);
        }

        // Book new slot
        doctor.initializeSlotsForDate(newAppointmentDate);
        doctor.bookSlot(newAppointmentDate, newTimeSlot, appointment._id);
        await doctor.save();

        // Update appointment
        appointment.date = newAppointmentDate;
        appointment.time = newTimeSlot;
        appointment.slotInfo = { timeSlot: newTimeSlot, slotDate: newAppointmentDate };
        appointment.status = 'rescheduled';
        await appointment.save();

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
        const { newDate, newTimeSlot } = req.body;
        const userId = req.user.id;

        if (!newDate || !newTimeSlot) {
            return res.status(400).json({ message: "New date and time slot are required" });
        }

        const appointment = await Appointment.findOne({ _id: id, userId, status: { $in: ['booked', 'accepted'] } });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be rescheduled" });
        }

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const newAppointmentDate = new Date(newDate);
        const dayName = newAppointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (!doctor.availability?.workingDays?.includes(dayName)) {
            return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
        }

        // Release old slot
        if (appointment.slotInfo) {
            doctor.cancelSlot(appointment.slotInfo.slotDate, appointment.slotInfo.timeSlot);
        }

        // Initialize and book new slot
        doctor.initializeSlotsForDate(newAppointmentDate);
        doctor.bookSlot(newAppointmentDate, newTimeSlot, appointment._id);
        await doctor.save();

        // Update appointment
        appointment.date = newAppointmentDate;
        appointment.time = newTimeSlot;
        appointment.slotInfo = { timeSlot: newTimeSlot, slotDate: newAppointmentDate };
        appointment.status = 'rescheduled';
        await appointment.save();

        res.status(200).json({
            message: "Appointment rescheduled successfully",
            appointment
        });
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).json({ message: "Error rescheduling appointment", error: error.message });
    }
};

// Availability: public endpoint to fetch available slots for a doctor on a date
export const getDoctorAvailability = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Date is required (YYYY-MM-DD)' });
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const requestDate = new Date(date);
        const availableSlots = doctor.getAvailableSlots(requestDate);
        await doctor.save();
        const dateString = requestDate.toISOString().split('T')[0];
        const daySlots = doctor.dailySlotStatus.get(dateString);
        res.status(200).json({
            message: 'Doctor availability retrieved successfully',
            availability: {
                date: requestDate,
                totalSlots: daySlots?.totalSlots || availableSlots.length,
                bookedSlots: daySlots?.bookedSlots || 0,
                availableSlots: availableSlots.length,
                slots: availableSlots,
                workingHours: doctor.availability.workingHours,
                slotDuration: doctor.availability.slotDuration
            }
        });
    } catch (error) {
        console.error('getDoctorAvailability error:', error);
        res.status(500).json({ message: 'Error getting availability', error: error.message });
    }
};

// Availability: doctor updates their availability settings
export const updateDoctorAvailability = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { dailySlots, slotDuration, workingHours, workingDays, isAvailable } = req.body;
        const update = {};
        if (dailySlots !== undefined) update['availability.dailySlots'] = dailySlots;
        if (slotDuration !== undefined) update['availability.slotDuration'] = slotDuration;
        if (workingHours !== undefined) update['availability.workingHours'] = workingHours;
        if (workingDays !== undefined) update['availability.workingDays'] = workingDays;
        if (isAvailable !== undefined) update['availability.isAvailable'] = isAvailable;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { $set: update }, { new: true, runValidators: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json({ message: 'Availability updated successfully', availability: doctor.availability });
    } catch (error) {
        console.error('updateDoctorAvailability error:', error);
        res.status(500).json({ message: 'Error updating availability', error: error.message });
    }
};

// Availability: doctor slot utilization overview
export const getDoctorSlotStatus = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { startDate, endDate } = req.query;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        const slotStatus = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const ds = d.toISOString().split('T')[0];
                let daySlots = doctor.dailySlotStatus.get(ds);
                if (!daySlots) {
                    doctor.initializeSlotsForDate(new Date(d));
                    daySlots = doctor.dailySlotStatus.get(ds);
                }
                slotStatus[ds] = {
                    totalSlots: daySlots?.totalSlots || 0,
                    bookedSlots: daySlots?.bookedSlots || 0,
                    availableSlots: daySlots?.availableSlots || 0
                };
            }
            await doctor.save();
        } else {
            for (const [ds, daySlots] of doctor.dailySlotStatus) {
                slotStatus[ds] = {
                    totalSlots: daySlots.totalSlots,
                    bookedSlots: daySlots.bookedSlots,
                    availableSlots: daySlots.availableSlots
                };
            }
        }
        res.status(200).json({ message: 'Slot status retrieved successfully', slotStatus, availability: doctor.availability });
    } catch (error) {
        console.error('getDoctorSlotStatus error:', error);
        res.status(500).json({ message: 'Error getting slot status', error: error.message });
    }
};
