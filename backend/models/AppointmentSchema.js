import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    chatEnabled: {
        type: Boolean,
        default: true
    },
    time: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Indexes for better performance
appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ chat: 1 });

// Method to check if chat is available
appointmentSchema.methods.isChatAvailable = function() {
    return this.chatEnabled && (this.status === 'confirmed' || this.status === 'completed');
};

// Method to enable chat for appointment
appointmentSchema.methods.enableChat = async function() {
    if (!this.chat) {
        const Chat = mongoose.model('Chat');
        const chat = await Chat.findOrCreateChat(
            this.doctorId,
            this.userId,
            this._id,
            'appointment'
        );
        this.chat = chat._id;
        this.chatEnabled = true;
        await this.save();
    }
    return this.chat;
};

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
