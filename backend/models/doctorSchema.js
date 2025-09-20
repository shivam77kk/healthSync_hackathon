import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    age: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ["online", "offline", "both"],
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    followers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    cautiooCount: {
        type: Number,
        default: 0
    },
    // Availability and slot management
    availability: {
        dailySlots: {
            type: Number,
            default: 10,
            min: 1,
            max: 50
        },
        slotDuration: {
            type: Number,
            default: 30, // minutes
            min: 10,
            max: 180
        },
        workingHours: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        workingDays: {
            type: [String],
            enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            default: ['Monday','Tuesday','Wednesday','Thursday','Friday']
        },
        isAvailable: { type: Boolean, default: true }
    },
    // Per-day slot status; key is YYYY-MM-DD
    dailySlotStatus: {
        type: Map,
        of: new mongoose.Schema({
            date: Date,
            totalSlots: Number,
            bookedSlots: { type: Number, default: 0 },
            availableSlots: Number,
            slots: [{
                time: String,
                isBooked: { type: Boolean, default: false },
                appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null }
            }]
        }, { _id: false }),
        default: new Map()
    }
}, { timestamps: true });

doctorSchema.virtual('followersCount').get(function() {
    return this.followers.length;
});

doctorSchema.set('toJSON', {
    virtuals: true
});

// Generate time slots for a given date based on working hours and slot duration
doctorSchema.methods.generateSlotsForDate = function(date) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (!this.availability.workingDays.includes(dayName) || !this.availability.isAvailable) {
        return [];
    }

    const slots = [];
    const [startHour, startMin] = this.availability.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = this.availability.workingHours.end.split(':').map(Number);
    const slotDuration = this.availability.slotDuration;
    let minutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (minutes < endMinutes) {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        slots.push({ time: `${h}:${m}`, isBooked: false, appointmentId: null });
        minutes += slotDuration;
    }

    // Respect dailySlots cap if configured
    if (this.availability?.dailySlots && slots.length > this.availability.dailySlots) {
        return slots.slice(0, this.availability.dailySlots);
    }

    return slots;
};

// Initialize day slots if missing and return the day object
doctorSchema.methods.initializeSlotsForDate = function(date) {
    const key = date.toISOString().split('T')[0];
    if (!this.dailySlotStatus.has(key)) {
        const slots = this.generateSlotsForDate(date);
        this.dailySlotStatus.set(key, {
            date,
            totalSlots: slots.length,
            bookedSlots: 0,
            availableSlots: slots.length,
            slots
        });
    }
    return this.dailySlotStatus.get(key);
};

// Book a specific time slot
doctorSchema.methods.bookSlot = function(date, time, appointmentId) {
    const key = date.toISOString().split('T')[0];
    const day = this.dailySlotStatus.get(key);
    if (!day) throw new Error('Slots not initialized for this date');
    const slot = day.slots.find(s => s.time === time);
    if (!slot) throw new Error('Invalid time slot');
    if (slot.isBooked) throw new Error('Slot already booked');
    slot.isBooked = true;
    slot.appointmentId = appointmentId || null;
    day.bookedSlots += 1;
    day.availableSlots -= 1;
    this.dailySlotStatus.set(key, day);
    return true;
};

// Cancel a booked slot
doctorSchema.methods.cancelSlot = function(date, time) {
    const key = date.toISOString().split('T')[0];
    const day = this.dailySlotStatus.get(key);
    if (!day) return false;
    const slot = day.slots.find(s => s.time === time);
    if (!slot || !slot.isBooked) return false;
    slot.isBooked = false;
    slot.appointmentId = null;
    day.bookedSlots -= 1;
    day.availableSlots += 1;
    this.dailySlotStatus.set(key, day);
    return true;
};

// Get available slots for a date
doctorSchema.methods.getAvailableSlots = function(date) {
    const key = date.toISOString().split('T')[0];
    let day = this.dailySlotStatus.get(key);
    if (!day) {
        day = this.initializeSlotsForDate(date);
    }
    return day.slots.filter(s => !s.isBooked);
};

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
