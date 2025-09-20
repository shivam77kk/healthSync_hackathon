import mongoose from 'mongoose';

const videoCallSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
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
    twilioRoom: {
        roomSid: {
            type: String,
            required: true
        },
        roomName: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['initiated', 'ringing', 'active', 'ended', 'missed', 'declined'],
        default: 'initiated'
    },
    callType: {
        type: String,
        enum: ['video', 'audio', 'video_with_prescription'],
        default: 'video'
    },
    initiatedBy: {
        type: String,
        enum: ['doctor', 'patient'],
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // Duration in seconds
        default: 0
    },
    recording: {
        enabled: {
            type: Boolean,
            default: false
        },
        recordingSid: {
            type: String
        },
        recordingUrl: {
            type: String
        }
    },
    voicePrescription: {
        enabled: {
            type: Boolean,
            default: false
        },
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription'
        },
        audioUrl: {
            type: String
        },
        transcript: {
            type: String
        }
    },
    metadata: {
        deviceInfo: {
            browser: String,
            os: String,
            device: String
        },
        networkQuality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good'
        },
        callQuality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good'
        },
        notes: {
            type: String
        }
    },
    notifications: {
        sent: {
            type: Boolean,
            default: false
        },
        sentAt: {
            type: Date
        },
        reminderSent: {
            type: Boolean,
            default: false
        }
    }
}, { 
    timestamps: true 
});

// Indexes for better performance
videoCallSchema.index({ chat: 1, status: 1 });
videoCallSchema.index({ 'participants.doctor': 1, startTime: -1 });
videoCallSchema.index({ 'participants.patient': 1, startTime: -1 });
videoCallSchema.index({ status: 1, startTime: -1 });
videoCallSchema.index({ twilioRoom: 1 });

// Virtual for call duration in minutes
videoCallSchema.virtual('durationMinutes').get(function() {
    return Math.round(this.duration / 60 * 100) / 100; // Round to 2 decimal places
});

// Method to check if user is participant
videoCallSchema.methods.isParticipant = function(userId) {
    return this.participants.doctor.toString() === userId.toString() || 
           this.participants.patient.toString() === userId.toString();
};

// Method to get other participant
videoCallSchema.methods.getOtherParticipant = function(userId) {
    if (this.participants.doctor.toString() === userId.toString()) {
        return this.participants.patient;
    } else if (this.participants.patient.toString() === userId.toString()) {
        return this.participants.doctor;
    }
    return null;
};

// Method to end call
videoCallSchema.methods.endCall = function() {
    this.status = 'ended';
    this.endTime = new Date();
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
    return this.save();
};

// Method to update call status
videoCallSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'ended') {
        this.endTime = new Date();
        this.duration = Math.floor((this.endTime - this.startTime) / 1000);
    }
    return this.save();
};

// Static method to find active calls for user
videoCallSchema.statics.findActiveCallsForUser = async function(userId) {
    return await this.find({
        $or: [
            { 'participants.doctor': userId },
            { 'participants.patient': userId }
        ],
        status: { $in: ['initiated', 'ringing', 'active'] }
    }).populate('participants.doctor', 'name email profileImage')
      .populate('participants.patient', 'name email profileImage')
      .populate('chat', 'participants lastActivity');
};

// Static method to get call history for user
videoCallSchema.statics.getCallHistory = async function(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const calls = await this.find({
        $or: [
            { 'participants.doctor': userId },
            { 'participants.patient': userId }
        ],
        status: { $in: ['ended', 'missed', 'declined'] }
    })
    .populate('participants.doctor', 'name email profileImage')
    .populate('participants.patient', 'name email profileImage')
    .populate('chat', 'participants')
    .populate('voicePrescription.prescriptionId')
    .sort({ startTime: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await this.countDocuments({
        $or: [
            { 'participants.doctor': userId },
            { 'participants.patient': userId }
        ],
        status: { $in: ['ended', 'missed', 'declined'] }
    });

    return {
        calls,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCalls: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

// Ensure virtual fields are serialized
videoCallSchema.set('toJSON', {
    virtuals: true
});

const VideoCall = mongoose.model('VideoCall', videoCallSchema);

export default VideoCall;

