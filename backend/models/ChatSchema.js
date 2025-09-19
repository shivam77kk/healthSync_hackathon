import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: false // Chat can exist without appointment (direct search)
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'blocked'],
        default: 'active'
    },
    unreadCount: {
        doctor: {
            type: Number,
            default: 0
        },
        patient: {
            type: Number,
            default: 0
        }
    },
    metadata: {
        initiatedBy: {
            type: String,
            enum: ['doctor', 'patient'],
            required: true
        },
        chatType: {
            type: String,
            enum: ['appointment', 'direct', 'followup'],
            default: 'direct'
        },
        isEmergency: {
            type: Boolean,
            default: false
        }
    }
}, { 
    timestamps: true 
});

// Indexes for better performance
chatSchema.index({ 'participants.doctor': 1, 'participants.patient': 1 }, { unique: true });
chatSchema.index({ 'participants.doctor': 1, lastActivity: -1 });
chatSchema.index({ 'participants.patient': 1, lastActivity: -1 });
chatSchema.index({ appointment: 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ status: 1 });

// Virtual for total message count
chatSchema.virtual('totalMessages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    count: true
});

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId, userType) {
    if (userType === 'doctor') {
        return this.participants.doctor.toString() === userId.toString();
    } else if (userType === 'patient') {
        return this.participants.patient.toString() === userId.toString();
    }
    return false;
};

// Method to update last activity
chatSchema.methods.updateActivity = function() {
    this.lastActivity = new Date();
    return this.save();
};

// Method to increment unread count
chatSchema.methods.incrementUnread = function(userType) {
    if (userType === 'doctor') {
        this.unreadCount.doctor += 1;
    } else if (userType === 'patient') {
        this.unreadCount.patient += 1;
    }
    return this.save();
};

// Method to reset unread count
chatSchema.methods.resetUnread = function(userType) {
    if (userType === 'doctor') {
        this.unreadCount.doctor = 0;
    } else if (userType === 'patient') {
        this.unreadCount.patient = 0;
    }
    return this.save();
};

// Static method to find or create chat
chatSchema.statics.findOrCreateChat = async function(doctorId, patientId, appointmentId = null, initiatedBy = 'patient') {
    let chat = await this.findOne({
        'participants.doctor': doctorId,
        'participants.patient': patientId
    }).populate('participants.doctor', 'name email profileImage experience')
      .populate('participants.patient', 'name email profileImage')
      .populate('lastMessage');

    if (!chat) {
        chat = new this({
            participants: {
                doctor: doctorId,
                patient: patientId
            },
            appointment: appointmentId,
            metadata: {
                initiatedBy,
                chatType: appointmentId ? 'appointment' : 'direct'
            }
        });
        await chat.save();
        
        // Populate after creation
        await chat.populate('participants.doctor', 'name email profileImage experience');
        await chat.populate('participants.patient', 'name email profileImage');
    }

    return chat;
};

// Ensure virtual fields are serialized
chatSchema.set('toJSON', {
    virtuals: true
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
