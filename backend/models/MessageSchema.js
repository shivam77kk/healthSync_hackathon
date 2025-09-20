import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'sender.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['User', 'Doctor']
        },
        name: {
            type: String,
            required: true
        }
    },
    messageType: {
        type: String,
        enum: ['text', 'voice_prescription', 'system', 'appointment_link'],
        default: 'text'
    },
    content: {
        text: {
            type: String,
            required: function() {
                return this.messageType === 'text' || this.messageType === 'system';
            }
        },
        // Voice prescription specific content
        voicePrescription: {
            prescriptionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Prescription'
            },
            audioUrl: String,
            transcript: String,
            transcriptionConfidence: Number,
            medications: [{
                name: String,
                dosage: String,
                frequency: String,
                duration: String,
                instructions: String
            }],
            diagnosis: String,
            recommendations: [String],
            priority: {
                type: String,
                enum: ['low', 'normal', 'high', 'urgent'],
                default: 'normal'
            }
        },
        // Appointment link content
        appointmentLink: {
            appointmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Appointment'
            },
            appointmentDate: Date,
            appointmentTime: String,
            status: String
        }
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'readBy.userType'
        },
        userType: {
            type: String,
            enum: ['User', 'Doctor']
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: Date,
        isEmergency: {
            type: Boolean,
            default: false
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        deliveredAt: Date,
        // Voice prescription specific metadata
        transcriptionProvider: String,
        audioMetadata: {
            duration: Number,
            format: String,
            size: Number
        }
    }
}, {
    timestamps: true
});

// Indexes for better performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ 'sender.id': 1, createdAt: -1 });
messageSchema.index({ messageType: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ 'content.voicePrescription.prescriptionId': 1 });

// Virtual for formatted timestamp
messageSchema.virtual('formattedTime').get(function() {
    return this.createdAt.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
});

// Virtual for formatted date
messageSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
});

// Method to check if message is read by user
messageSchema.methods.isReadBy = function(userId, userType) {
    return this.readBy.some(read => 
        read.user.toString() === userId.toString() && read.userType === userType
    );
};

// Method to mark message as read by user
messageSchema.methods.markAsRead = function(userId, userType) {
    if (!this.isReadBy(userId, userType)) {
        this.readBy.push({
            user: userId,
            userType: userType,
            readAt: new Date()
        });
    }
    this.status = 'read';
    return this.save();
};

// Static method to get unread count for user in chat
messageSchema.statics.getUnreadCount = async function(chatId, userId, userType) {
    const count = await this.countDocuments({
        chat: chatId,
        'sender.id': { $ne: userId },
        readBy: {
            $not: {
                $elemMatch: {
                    user: userId,
                    userType: userType
                }
            }
        }
    });
    return count;
};

// Static method to mark all messages as read in a chat
messageSchema.statics.markAllAsRead = async function(chatId, userId, userType) {
    const messages = await this.find({
        chat: chatId,
        'sender.id': { $ne: userId },
        readBy: {
            $not: {
                $elemMatch: {
                    user: userId,
                    userType: userType
                }
            }
        }
    });

    const updatePromises = messages.map(message => {
        message.readBy.push({
            user: userId,
            userType: userType,
            readAt: new Date()
        });
        message.status = 'read';
        return message.save();
    });

    await Promise.all(updatePromises);
    return messages.length;
};

// Method to get message preview (for chat list)
messageSchema.methods.getPreview = function() {
    switch (this.messageType) {
        case 'text':
            return this.content.text.length > 50 ? 
                this.content.text.substring(0, 50) + '...' : 
                this.content.text;
        case 'voice_prescription':
            return '🎤 Voice Prescription: ' + (this.content.voicePrescription.diagnosis || 'New prescription');
        case 'system':
            return this.content.text;
        case 'appointment_link':
            return '📅 Appointment Link';
        default:
            return 'Message';
    }
};

// Pre-save middleware to update chat's last message and activity
messageSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const Chat = mongoose.model('Chat');
            await Chat.findByIdAndUpdate(this.chat, {
                lastMessage: this._id,
                lastActivity: new Date()
            });
        } catch (error) {
            console.error('Error updating chat:', error);
        }
    }
    next();
});

// Ensure virtual fields are serialized
messageSchema.set('toJSON', {
    virtuals: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
