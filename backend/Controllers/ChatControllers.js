import Chat from '../models/ChatSchema.js';
import Message from '../models/MessageSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';
import Appointment from '../models/AppointmentSchema.js';
import Prescription from '../models/PrescriptionSchema.js';
import speechToTextService from '../services/speechToTextService.js';
import notificationService from '../services/notificationService.js';

// Search for users (patients) by email - Doctor only
export const searchPatients = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required for search" });
        }

        const patients = await User.find({
            email: { $regex: email, $options: 'i' }
        })
        .select('name email profileImage age')
        .limit(10);

        res.json({
            patients,
            count: patients.length
        });

    } catch (error) {
        console.error('Search Patients Error:', error);
        res.status(500).json({ 
            message: "Failed to search patients", 
            error: error.message 
        });
    }
};

// Search for doctors by email - Patient only
export const searchDoctors = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required for search" });
        }

        const doctors = await Doctor.find({
            email: { $regex: email, $options: 'i' }
        })
        .select('name email profileImage experience followersCount')
        .limit(10);

        res.json({
            doctors,
            count: doctors.length
        });

    } catch (error) {
        console.error('Search Doctors Error:', error);
        res.status(500).json({ 
            message: "Failed to search doctors", 
            error: error.message 
        });
    }
};

// Create or get chat room
export const createOrGetChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId, appointmentId } = req.body;
        
        if (!targetUserId) {
            return res.status(400).json({ message: "Target user ID is required" });
        }

        // Determine user types and IDs
        let doctorId, patientId, initiatedBy;
        
        // Check if current user is doctor or patient
        const doctor = await Doctor.findById(userId);
        if (doctor) {
            // Current user is doctor
            doctorId = userId;
            patientId = targetUserId;
            initiatedBy = 'doctor';
            
            // Verify target is a patient
            const patient = await User.findById(targetUserId);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }
        } else {
            // Current user is patient
            patientId = userId;
            doctorId = targetUserId;
            initiatedBy = 'patient';
            
            // Verify target is a doctor
            const targetDoctor = await Doctor.findById(targetUserId);
            if (!targetDoctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
        }

        // Create or find existing chat
        const chat = await Chat.findOrCreateChat(doctorId, patientId, appointmentId, initiatedBy);

        res.status(201).json({
            message: "Chat created or retrieved successfully",
            chat
        });

    } catch (error) {
        console.error('Create/Get Chat Error:', error);
        res.status(500).json({ 
            message: "Failed to create or get chat", 
            error: error.message 
        });
    }
};

// Get user's chat list
export const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Determine if user is doctor or patient
        const doctor = await Doctor.findById(userId);
        const isDoctor = !!doctor;

        let query;
        if (isDoctor) {
            query = { 'participants.doctor': userId, status: 'active' };
        } else {
            query = { 'participants.patient': userId, status: 'active' };
        }

        const chats = await Chat.find(query)
            .populate('participants.doctor', 'name email profileImage experience')
            .populate('participants.patient', 'name email profileImage')
            .populate('lastMessage')
            .populate('appointment', 'date time reason status')
            .sort({ lastActivity: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Add unread count and last message preview for each chat
        const enhancedChats = await Promise.all(chats.map(async (chat) => {
            const userType = isDoctor ? 'Doctor' : 'User';
            const unreadCount = await Message.getUnreadCount(chat._id, userId, userType);
            
            return {
                ...chat,
                unreadCount,
                lastMessagePreview: chat.lastMessage ? 
                    new Message(chat.lastMessage).getPreview() : null,
                otherParticipant: isDoctor ? chat.participants.patient : chat.participants.doctor
            };
        }));

        const total = await Chat.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.json({
            chats: enhancedChats,
            pagination: {
                currentPage: page,
                totalPages,
                totalChats: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get User Chats Error:', error);
        res.status(500).json({ 
            message: "Failed to get chats", 
            error: error.message 
        });
    }
};

// Get messages in a chat
export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify user is participant in chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';
        
        if (!chat.isParticipant(userId, userType)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this chat" });
        }

        // Get messages
        const messages = await Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('content.voicePrescription.prescriptionId')
            .populate('metadata.replyTo')
            .lean();

        // Mark messages as read
        const mongooseUserType = doctor ? 'Doctor' : 'User';
        await Message.markAllAsRead(chatId, userId, mongooseUserType);
        
        // Reset unread count in chat
        await chat.resetUnread(userType);

        const total = await Message.countDocuments({ chat: chatId });
        const totalPages = Math.ceil(total / limit);

        res.json({
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                currentPage: page,
                totalPages,
                totalMessages: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            chat: {
                id: chat._id,
                participants: chat.participants,
                appointment: chat.appointment
            }
        });

    } catch (error) {
        console.error('Get Chat Messages Error:', error);
        res.status(500).json({ 
            message: "Failed to get messages", 
            error: error.message 
        });
    }
};

// Send text message
export const sendTextMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text, replyTo } = req.body;
        const userId = req.user.id;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Message text is required" });
        }

        // Verify user is participant in chat
        const chat = await Chat.findById(chatId)
            .populate('participants.doctor', 'name email')
            .populate('participants.patient', 'name email');
            
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';
        
        if (!chat.isParticipant(userId, userType)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this chat" });
        }

        // Get sender info
        const sender = doctor || await User.findById(userId);
        
        // Create message
        const message = new Message({
            chat: chatId,
            sender: {
                id: userId,
                type: doctor ? 'Doctor' : 'User',
                name: sender.name
            },
            messageType: 'text',
            content: {
                text: text.trim()
            },
            metadata: {
                replyTo: replyTo || undefined
            }
        });

        await message.save();

        // Update chat activity and unread count
        await chat.updateActivity();
        const otherUserType = doctor ? 'patient' : 'doctor';
        await chat.incrementUnread(otherUserType);

        // Populate message for response
        await message.populate('metadata.replyTo');

        res.status(201).json({
            message: "Message sent successfully",
            messageData: message
        });

    } catch (error) {
        console.error('Send Text Message Error:', error);
        res.status(500).json({ 
            message: "Failed to send message", 
            error: error.message 
        });
    }
};

// Send voice prescription (Doctor only)
export const sendVoicePrescriptionInChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { priority = 'normal', notes } = req.body;
        const doctorId = req.user.id;

        // Verify doctor and chat
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Only doctors can send voice prescriptions" });
        }

        const chat = await Chat.findById(chatId)
            .populate('participants.doctor', 'name email')
            .populate('participants.patient', 'name email');
            
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (!chat.isParticipant(doctorId, 'doctor')) {
            return res.status(403).json({ message: "Access denied. Not a participant in this chat" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required for voice prescription" });
        }

        // Process audio and create prescription (similar to voice prescription controller)
        const audioMetadata = speechToTextService.getAudioMetadata(req.file.buffer, req.file.mimetype);
        
        // Upload audio to cloud storage
        const audioFileName = `chat_${chatId}_${doctorId}_${Date.now()}`;
        const audioUploadResult = await speechToTextService.uploadAudio(req.file.buffer, audioFileName);

        // Transcribe audio to text
        const transcriptionResult = await speechToTextService.transcribe(req.file.buffer, {
            language: 'en',
            preferredProvider: 'mock',
            fallback: true
        });

        // Process medical transcript
        const processedTranscript = speechToTextService.processMedicalTranscript(transcriptionResult.transcript);
        
        // Parse prescription data from transcript
        const prescriptionData = parsePrescriptionFromTranscript(processedTranscript);

        // Create prescription document
        const prescription = new Prescription({
            patient: chat.participants.patient._id,
            doctor: doctorId,
            type: 'voice',
            audioUrl: audioUploadResult.secure_url,
            transcript: processedTranscript,
            transcriptionConfidence: transcriptionResult.confidence,
            ...prescriptionData,
            priority,
            notes,
            audioMetadata: {
                ...audioMetadata,
                duration: transcriptionResult.duration || audioMetadata.duration
            },
            status: 'sent'
        });

        await prescription.save();

        // Create chat message with voice prescription
        const message = new Message({
            chat: chatId,
            sender: {
                id: doctorId,
                type: 'Doctor',
                name: doctor.name
            },
            messageType: 'voice_prescription',
            content: {
                voicePrescription: {
                    prescriptionId: prescription._id,
                    audioUrl: audioUploadResult.secure_url,
                    transcript: processedTranscript,
                    transcriptionConfidence: transcriptionResult.confidence,
                    medications: prescriptionData.medications,
                    diagnosis: prescriptionData.diagnosis,
                    recommendations: prescriptionData.recommendations,
                    priority
                }
            },
            metadata: {
                transcriptionProvider: transcriptionResult.provider,
                audioMetadata
            }
        });

        await message.save();

        // Update chat activity and unread count
        await chat.updateActivity();
        await chat.incrementUnread('patient');

        // Send notification to patient
        try {
            await notificationService.sendPrescriptionNotification(
                chat.participants.patient,
                prescription
            );
        } catch (notificationError) {
            console.error('Failed to send notification:', notificationError);
        }

        // Populate message for response
        await message.populate('content.voicePrescription.prescriptionId');

        res.status(201).json({
            message: "Voice prescription sent successfully in chat",
            messageData: message,
            prescription: {
                id: prescription._id,
                status: prescription.status,
                transcriptionInfo: {
                    provider: transcriptionResult.provider,
                    confidence: transcriptionResult.confidence
                }
            }
        });

    } catch (error) {
        console.error('Send Voice Prescription in Chat Error:', error);
        res.status(500).json({ 
            message: "Failed to send voice prescription in chat", 
            error: error.message 
        });
    }
};

// Get chat from appointment - for easy access from appointment
export const getChatFromAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        // Find appointment and verify user is participant
        const appointment = await Appointment.findById(appointmentId)
            .populate('userId', 'name email')
            .populate('doctorId', 'name email');

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Check if user is participant in appointment
        const isDoctor = await Doctor.findById(userId);
        const isPatient = appointment.userId._id.toString() === userId.toString();
        const isDoctorInAppointment = appointment.doctorId._id.toString() === userId.toString();

        if (!isPatient && !isDoctorInAppointment) {
            return res.status(403).json({ message: "Access denied. Not a participant in this appointment" });
        }

        // Check if appointment has confirmed status (for chat availability)
        if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
            return res.status(400).json({ 
                message: "Chat is not available. Appointment must be confirmed first.",
                appointmentStatus: appointment.status
            });
        }

        // Enable chat for appointment if not already enabled
        let chatId = appointment.chat;
        if (!chatId) {
            chatId = await appointment.enableChat();
        }

        // Get or create chat
        const chat = await Chat.findById(chatId)
            .populate('participants.doctor', 'name email profileImage experience')
            .populate('participants.patient', 'name email profileImage')
            .populate('lastMessage');

        res.json({
            message: "Chat retrieved from appointment successfully",
            chat,
            appointment: {
                id: appointment._id,
                date: appointment.date,
                time: appointment.time,
                reason: appointment.reason,
                status: appointment.status
            }
        });

    } catch (error) {
        console.error('Get Chat From Appointment Error:', error);
        res.status(500).json({ 
            message: "Failed to get chat from appointment", 
            error: error.message 
        });
    }
};

// Delete/Archive chat (both users can archive)
export const archiveChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        // Verify user is participant in chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';
        
        if (!chat.isParticipant(userId, userType)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this chat" });
        }

        chat.status = 'archived';
        await chat.save();

        res.json({
            message: "Chat archived successfully"
        });

    } catch (error) {
        console.error('Archive Chat Error:', error);
        res.status(500).json({ 
            message: "Failed to archive chat", 
            error: error.message 
        });
    }
};

// Get chat statistics
export const getChatStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const doctor = await Doctor.findById(userId);
        const isDoctor = !!doctor;

        let query;
        if (isDoctor) {
            query = { 'participants.doctor': userId };
        } else {
            query = { 'participants.patient': userId };
        }

        const totalChats = await Chat.countDocuments({ ...query, status: 'active' });
        const archivedChats = await Chat.countDocuments({ ...query, status: 'archived' });
        
        // Get unread messages count
        const userType = isDoctor ? 'Doctor' : 'User';
        const chats = await Chat.find({ ...query, status: 'active' });
        
        let totalUnread = 0;
        for (const chat of chats) {
            const unreadCount = await Message.getUnreadCount(chat._id, userId, userType);
            totalUnread += unreadCount;
        }

        // Get recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentMessages = await Message.countDocuments({
            'sender.id': userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            stats: {
                totalChats,
                archivedChats,
                totalUnreadMessages: totalUnread,
                recentMessages,
                userType: isDoctor ? 'doctor' : 'patient'
            }
        });

    } catch (error) {
        console.error('Get Chat Stats Error:', error);
        res.status(500).json({ 
            message: "Failed to get chat statistics", 
            error: error.message 
        });
    }
};

// Helper function to parse prescription from transcript (reused from voice prescription)
function parsePrescriptionFromTranscript(transcript) {
    const lowerText = transcript.toLowerCase();
    
    const prescriptionData = {
        medications: [],
        diagnosis: '',
        symptoms: '',
        recommendations: []
    };
    
    // Extract diagnosis
    const diagnosisPatterns = [
        /diagnosis:?\s*([^.]+)/i,
        /patient (?:presents with|has|diagnosed with)\s*([^.]+)/i
    ];
    
    for (const pattern of diagnosisPatterns) {
        const match = transcript.match(pattern);
        if (match) {
            prescriptionData.diagnosis = match[1].trim();
            break;
        }
    }
    
    // Extract medications with dosage
    const medicationPatterns = [
        /prescribe\s+([\w\s]+)\s+(\d+(?:\.\d+)?\s*mg)\s+([^.]+)/gi,
        /(?:give|take)\s+([\w\s]+)\s+(\d+(?:\.\d+)?\s*mg)\s+([^.]+)/gi
    ];
    
    for (const pattern of medicationPatterns) {
        let match;
        while ((match = pattern.exec(transcript)) !== null) {
            prescriptionData.medications.push({
                name: match[1].trim(),
                dosage: match[2].trim(),
                frequency: extractFrequency(match[3]),
                duration: extractDuration(match[3]),
                instructions: match[3].trim()
            });
        }
    }
    
    // Extract general recommendations
    const recommendations = [];
    
    if (lowerText.includes('rest')) {
        recommendations.push('Get adequate rest');
    }
    if (lowerText.includes('fluid') || lowerText.includes('water')) {
        recommendations.push('Stay well hydrated');
    }
    if (lowerText.includes('follow up') || lowerText.includes('return')) {
        recommendations.push('Schedule follow-up appointment');
    }
    if (lowerText.includes('monitor')) {
        recommendations.push('Monitor symptoms closely');
    }
    
    prescriptionData.recommendations = recommendations;
    
    return prescriptionData;
}

// Helper functions (reused from voice prescription)
function extractFrequency(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('once daily') || lowerText.includes('once a day')) {
        return 'Once daily';
    } else if (lowerText.includes('twice daily') || lowerText.includes('twice a day')) {
        return 'Twice daily';
    } else if (lowerText.includes('three times daily') || lowerText.includes('three times a day')) {
        return 'Three times daily';
    } else if (lowerText.includes('as needed')) {
        return 'As needed';
    } else {
        return 'As directed';
    }
}

function extractDuration(text) {
    const durationMatch = text.match(/(\d+)\s*(day|week|month)s?/i);
    if (durationMatch) {
        return `${durationMatch[1]} ${durationMatch[2].toLowerCase()}${parseInt(durationMatch[1]) > 1 ? 's' : ''}`;
    }
    return 'As directed';
}
