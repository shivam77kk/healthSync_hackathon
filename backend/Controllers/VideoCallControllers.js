import VideoCall from '../models/VideoCallSchema.js';
import Chat from '../models/ChatSchema.js';
import Message from '../models/MessageSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';
import Prescription from '../models/PrescriptionSchema.js';
import speechToTextService from '../services/speechToTextService.js';
import notificationService from '../services/notificationService.js';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generate Twilio access token for video calls
const generateAccessToken = (identity, roomName) => {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity }
    );

    const videoGrant = new VideoGrant({
        room: roomName
    });

    token.addGrant(videoGrant);
    return token.toJwt();
};

// Initiate video call
export const initiateVideoCall = async (req, res) => {
    try {
        const { chatId, callType = 'video' } = req.body;
        const userId = req.user.id;

        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId)
            .populate('participants.doctor', 'name email profileImage')
            .populate('participants.patient', 'name email profileImage');

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if user is participant
        const doctor = await Doctor.findById(userId);
        const isDoctor = !!doctor;
        const userType = isDoctor ? 'doctor' : 'patient';

        if (!chat.isParticipant(userId, userType)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this chat" });
        }

        // Check for existing active calls
        const existingCall = await VideoCall.findOne({
            chat: chatId,
            status: { $in: ['initiated', 'ringing', 'active'] }
        });

        if (existingCall) {
            return res.status(400).json({ 
                message: "A video call is already active in this chat",
                existingCall: {
                    id: existingCall._id,
                    status: existingCall.status,
                    startTime: existingCall.startTime
                }
            });
        }

        // Generate unique room name
        const roomName = `healthsync_${chatId}_${Date.now()}`;
        
        // Create Twilio room
        let twilioRoom;
        try {
            twilioRoom = await twilioClient.video.rooms.create({
                uniqueName: roomName,
                type: 'peer-to-peer',
                recordParticipantsOnConnect: callType === 'video_with_prescription'
            });
        } catch (twilioError) {
            console.error('Twilio room creation error:', twilioError);
            return res.status(500).json({ 
                message: "Failed to create video call room",
                error: twilioError.message 
            });
        }

        // Generate access token for initiator
        const accessToken = generateAccessToken(
            `${userType}_${userId}`,
            roomName
        );

        // Create video call record
        const videoCall = new VideoCall({
            chat: chatId,
            participants: {
                doctor: chat.participants.doctor._id,
                patient: chat.participants.patient._id
            },
            twilioRoom: {
                roomSid: twilioRoom.sid,
                roomName: roomName,
                accessToken: accessToken
            },
            callType,
            initiatedBy: userType,
            recording: {
                enabled: callType === 'video_with_prescription'
            },
            voicePrescription: {
                enabled: callType === 'video_with_prescription'
            }
        });

        await videoCall.save();

        // Create system message in chat
        const systemMessage = new Message({
            chat: chatId,
            sender: {
                id: userId,
                type: isDoctor ? 'Doctor' : 'User',
                name: isDoctor ? doctor.name : (await User.findById(userId)).name
            },
            messageType: 'system',
            content: {
                text: `${isDoctor ? 'Doctor' : 'Patient'} initiated a ${callType.replace('_', ' ')} call`,
                systemAction: 'video_call_initiated',
                videoCallId: videoCall._id
            }
        });

        await systemMessage.save();

        // Update chat activity
        await chat.updateActivity();
        await chat.incrementUnread(isDoctor ? 'patient' : 'doctor');

        // Send notification to other participant
        try {
            const otherParticipant = isDoctor ? chat.participants.patient : chat.participants.doctor;
            await notificationService.sendVideoCallNotification(
                otherParticipant,
                {
                    callId: videoCall._id,
                    callerName: isDoctor ? doctor.name : (await User.findById(userId)).name,
                    callType,
                    chatId
                }
            );
        } catch (notificationError) {
            console.error('Failed to send video call notification:', notificationError);
        }

        res.status(201).json({
            message: "Video call initiated successfully",
            videoCall: {
                id: videoCall._id,
                roomName,
                accessToken,
                callType,
                status: videoCall.status,
                participants: {
                    doctor: chat.participants.doctor,
                    patient: chat.participants.patient
                },
                twilioRoom: {
                    roomSid: twilioRoom.sid,
                    roomName: roomName
                }
            }
        });

    } catch (error) {
        console.error('Initiate Video Call Error:', error);
        res.status(500).json({ 
            message: "Failed to initiate video call", 
            error: error.message 
        });
    }
};

// Join video call
export const joinVideoCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const userId = req.user.id;

        // Find video call
        const videoCall = await VideoCall.findById(callId)
            .populate('participants.doctor', 'name email profileImage')
            .populate('participants.patient', 'name email profileImage')
            .populate('chat', 'participants');

        if (!videoCall) {
            return res.status(404).json({ message: "Video call not found" });
        }

        // Check if user is participant
        if (!videoCall.isParticipant(userId)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this call" });
        }

        // Check call status
        if (videoCall.status === 'ended' || videoCall.status === 'declined') {
            return res.status(400).json({ 
                message: "Cannot join this call. Call has ended or was declined",
                status: videoCall.status 
            });
        }

        // Determine user type
        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';

        // Generate new access token for joining
        const accessToken = generateAccessToken(
            `${userType}_${userId}`,
            videoCall.twilioRoom.roomName
        );

        // Update call status to active if it was ringing
        if (videoCall.status === 'ringing') {
            await videoCall.updateStatus('active');
        }

        // Create system message
        const systemMessage = new Message({
            chat: videoCall.chat._id,
            sender: {
                id: userId,
                type: doctor ? 'Doctor' : 'User',
                name: doctor ? doctor.name : (await User.findById(userId)).name
            },
            messageType: 'system',
            content: {
                text: `${doctor ? 'Doctor' : 'Patient'} joined the video call`,
                systemAction: 'video_call_joined',
                videoCallId: videoCall._id
            }
        });

        await systemMessage.save();

        // Update chat activity
        const chat = await Chat.findById(videoCall.chat._id);
        await chat.updateActivity();

        res.json({
            message: "Successfully joined video call",
            videoCall: {
                id: videoCall._id,
                roomName: videoCall.twilioRoom.roomName,
                accessToken,
                callType: videoCall.callType,
                status: videoCall.status,
                participants: {
                    doctor: videoCall.participants.doctor,
                    patient: videoCall.participants.patient
                },
                twilioRoom: {
                    roomSid: videoCall.twilioRoom.roomSid,
                    roomName: videoCall.twilioRoom.roomName
                }
            }
        });

    } catch (error) {
        console.error('Join Video Call Error:', error);
        res.status(500).json({ 
            message: "Failed to join video call", 
            error: error.message 
        });
    }
};

// End video call
export const endVideoCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const userId = req.user.id;

        // Find video call
        const videoCall = await VideoCall.findById(callId)
            .populate('participants.doctor', 'name email')
            .populate('participants.patient', 'name email')
            .populate('chat', 'participants');

        if (!videoCall) {
            return res.status(404).json({ message: "Video call not found" });
        }

        // Check if user is participant
        if (!videoCall.isParticipant(userId)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this call" });
        }

        // Check if call is already ended
        if (videoCall.status === 'ended') {
            return res.status(400).json({ message: "Call has already ended" });
        }

        // Determine user type
        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';

        // End the call
        await videoCall.endCall();

        // Complete Twilio room if it exists
        try {
            await twilioClient.video.rooms(videoCall.twilioRoom.roomSid).update({
                status: 'completed'
            });
        } catch (twilioError) {
            console.error('Error completing Twilio room:', twilioError);
        }

        // Create system message
        const systemMessage = new Message({
            chat: videoCall.chat._id,
            sender: {
                id: userId,
                type: doctor ? 'Doctor' : 'User',
                name: doctor ? doctor.name : (await User.findById(userId)).name
            },
            messageType: 'system',
            content: {
                text: `Video call ended by ${doctor ? 'Doctor' : 'Patient'}. Duration: ${videoCall.durationMinutes} minutes`,
                systemAction: 'video_call_ended',
                videoCallId: videoCall._id,
                callDuration: videoCall.duration
            }
        });

        await systemMessage.save();

        // Update chat activity
        const chat = await Chat.findById(videoCall.chat._id);
        await chat.updateActivity();

        res.json({
            message: "Video call ended successfully",
            videoCall: {
                id: videoCall._id,
                status: videoCall.status,
                duration: videoCall.duration,
                durationMinutes: videoCall.durationMinutes,
                endTime: videoCall.endTime
            }
        });

    } catch (error) {
        console.error('End Video Call Error:', error);
        res.status(500).json({ 
            message: "Failed to end video call", 
            error: error.message 
        });
    }
};

// Decline video call
export const declineVideoCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const userId = req.user.id;

        // Find video call
        const videoCall = await VideoCall.findById(callId)
            .populate('participants.doctor', 'name email')
            .populate('participants.patient', 'name email')
            .populate('chat', 'participants');

        if (!videoCall) {
            return res.status(404).json({ message: "Video call not found" });
        }

        // Check if user is participant
        if (!videoCall.isParticipant(userId)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this call" });
        }

        // Check if call can be declined
        if (videoCall.status === 'ended' || videoCall.status === 'declined') {
            return res.status(400).json({ message: "Call cannot be declined" });
        }

        // Determine user type
        const doctor = await Doctor.findById(userId);
        const userType = doctor ? 'doctor' : 'patient';

        // Update call status
        await videoCall.updateStatus('declined');

        // Complete Twilio room
        try {
            await twilioClient.video.rooms(videoCall.twilioRoom.roomSid).update({
                status: 'completed'
            });
        } catch (twilioError) {
            console.error('Error completing Twilio room:', twilioError);
        }

        // Create system message
        const systemMessage = new Message({
            chat: videoCall.chat._id,
            sender: {
                id: userId,
                type: doctor ? 'Doctor' : 'User',
                name: doctor ? doctor.name : (await User.findById(userId)).name
            },
            messageType: 'system',
            content: {
                text: `${doctor ? 'Doctor' : 'Patient'} declined the video call`,
                systemAction: 'video_call_declined',
                videoCallId: videoCall._id
            }
        });

        await systemMessage.save();

        // Update chat activity
        const chat = await Chat.findById(videoCall.chat._id);
        await chat.updateActivity();

        res.json({
            message: "Video call declined successfully",
            videoCall: {
                id: videoCall._id,
                status: videoCall.status
            }
        });

    } catch (error) {
        console.error('Decline Video Call Error:', error);
        res.status(500).json({ 
            message: "Failed to decline video call", 
            error: error.message 
        });
    }
};

// Get active video calls for user
export const getActiveVideoCalls = async (req, res) => {
    try {
        const userId = req.user.id;

        const activeCalls = await VideoCall.findActiveCallsForUser(userId);

        res.json({
            message: "Active video calls retrieved successfully",
            activeCalls: activeCalls.map(call => ({
                id: call._id,
                chatId: call.chat._id,
                callType: call.callType,
                status: call.status,
                initiatedBy: call.initiatedBy,
                startTime: call.startTime,
                participants: {
                    doctor: call.participants.doctor,
                    patient: call.participants.patient
                },
                otherParticipant: call.getOtherParticipant(userId)
            }))
        });

    } catch (error) {
        console.error('Get Active Video Calls Error:', error);
        res.status(500).json({ 
            message: "Failed to get active video calls", 
            error: error.message 
        });
    }
};

// Get video call history
export const getVideoCallHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await VideoCall.getCallHistory(userId, page, limit);

        res.json({
            message: "Video call history retrieved successfully",
            ...result
        });

    } catch (error) {
        console.error('Get Video Call History Error:', error);
        res.status(500).json({ 
            message: "Failed to get video call history", 
            error: error.message 
        });
    }
};

// Send voice prescription during video call
export const sendVoicePrescriptionInCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const { priority = 'normal', notes } = req.body;
        const doctorId = req.user.id;

        // Verify doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Only doctors can send voice prescriptions" });
        }

        // Find video call
        const videoCall = await VideoCall.findById(callId)
            .populate('participants.doctor', 'name email')
            .populate('participants.patient', 'name email')
            .populate('chat', 'participants');

        if (!videoCall) {
            return res.status(404).json({ message: "Video call not found" });
        }

        // Check if doctor is participant
        if (!videoCall.isParticipant(doctorId)) {
            return res.status(403).json({ message: "Access denied. Not a participant in this call" });
        }

        // Check if call is active
        if (videoCall.status !== 'active') {
            return res.status(400).json({ message: "Voice prescription can only be sent during active calls" });
        }

        // Check if voice prescription is enabled for this call
        if (!videoCall.voicePrescription.enabled) {
            return res.status(400).json({ message: "Voice prescription is not enabled for this call" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required for voice prescription" });
        }

        // Process audio and create prescription
        const audioMetadata = speechToTextService.getAudioMetadata(req.file.buffer, req.file.mimetype);
        
        // Upload audio to cloud storage
        const audioFileName = `video_call_${callId}_${doctorId}_${Date.now()}`;
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
            patient: videoCall.participants.patient._id,
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
            status: 'sent',
            videoCallId: callId
        });

        await prescription.save();

        // Update video call with prescription info
        videoCall.voicePrescription.prescriptionId = prescription._id;
        videoCall.voicePrescription.audioUrl = audioUploadResult.secure_url;
        videoCall.voicePrescription.transcript = processedTranscript;
        await videoCall.save();

        // Create chat message with voice prescription
        const message = new Message({
            chat: videoCall.chat._id,
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
                    priority,
                    videoCallId: callId
                }
            },
            metadata: {
                transcriptionProvider: transcriptionResult.provider,
                audioMetadata,
                videoCallId: callId
            }
        });

        await message.save();

        // Update chat activity
        const chat = await Chat.findById(videoCall.chat._id);
        await chat.updateActivity();
        await chat.incrementUnread('patient');

        // Send notification to patient
        try {
            await notificationService.sendPrescriptionNotification(
                videoCall.participants.patient,
                prescription
            );
        } catch (notificationError) {
            console.error('Failed to send notification:', notificationError);
        }

        res.status(201).json({
            message: "Voice prescription sent successfully during video call",
            prescription: {
                id: prescription._id,
                status: prescription.status,
                transcript: processedTranscript,
                medications: prescriptionData.medications,
                diagnosis: prescriptionData.diagnosis,
                recommendations: prescriptionData.recommendations
            },
            transcriptionInfo: {
                provider: transcriptionResult.provider,
                confidence: transcriptionResult.confidence
            }
        });

    } catch (error) {
        console.error('Send Voice Prescription in Call Error:', error);
        res.status(500).json({ 
            message: "Failed to send voice prescription during call", 
            error: error.message 
        });
    }
};

// Helper function to parse prescription from transcript (reused from chat controller)
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

// Helper functions
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

