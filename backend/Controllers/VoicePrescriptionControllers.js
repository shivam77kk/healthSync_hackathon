import Prescription from '../models/PrescriptionSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';
import speechToTextService from '../services/speechToTextService.js';
import notificationService from '../services/notificationService.js';
import cloudinary from '../config/cloudinary.config.js';

// Create Voice Prescription (Doctor only)
export const createVoicePrescription = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { patientId, priority = 'normal', expiresAt, notes } = req.body;
        
        // Validate required fields
        if (!patientId) {
            return res.status(400).json({ 
                message: "Patient ID is required" 
            });
        }
        
        if (!req.file) {
            return res.status(400).json({ 
                message: "Audio file is required for voice prescription" 
            });
        }
        
        // Verify doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        // Verify patient exists
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        
        // Get audio metadata
        const audioMetadata = speechToTextService.getAudioMetadata(
            req.file.buffer, 
            req.file.mimetype
        );
        
        console.log('Processing voice prescription...', {
            doctorId,
            patientId,
            audioSize: audioMetadata.size,
            audioDuration: audioMetadata.duration
        });
        
        // Upload audio to cloud storage
        const audioFileName = `${doctorId}_${patientId}_${Date.now()}`;
        const audioUploadResult = await speechToTextService.uploadAudio(
            req.file.buffer, 
            audioFileName
        );
        
        // Transcribe audio to text
        const transcriptionResult = await speechToTextService.transcribe(
            req.file.buffer,
            {
                language: 'en',
                preferredProvider: 'mock', // Use mock for development
                fallback: true
            }
        );
        
        // Process medical transcript for better accuracy
        const processedTranscript = speechToTextService.processMedicalTranscript(
            transcriptionResult.transcript
        );
        
        // Parse prescription information from transcript
        const prescriptionData = parsePrescriptionFromTranscript(processedTranscript);
        
        // Create prescription document
        const prescription = new Prescription({
            patient: patientId,
            doctor: doctorId,
            type: 'voice',
            audioUrl: audioUploadResult.secure_url,
            transcript: processedTranscript,
            transcriptionConfidence: transcriptionResult.confidence,
            ...prescriptionData,
            priority,
            notes,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            audioMetadata: {
                ...audioMetadata,
                duration: transcriptionResult.duration || audioMetadata.duration
            },
            status: 'sent'
        });
        
        await prescription.save();
        
        // Populate references for response
        await prescription.populate('doctor', 'name email profileImage experience');
        await prescription.populate('patient', 'name email profileImage');
        
        // Send notification to patient
        try {
            await notificationService.sendPrescriptionNotification(patient, prescription);
        } catch (notificationError) {
            console.error('Failed to send notification:', notificationError);
            // Don't fail the request if notification fails
        }
        
        res.status(201).json({
            message: "Voice prescription created and sent successfully",
            prescription: {
                ...prescription.toJSON(),
                transcriptionInfo: {
                    provider: transcriptionResult.provider,
                    confidence: transcriptionResult.confidence,
                    providersAttempted: transcriptionResult.providersAttempted
                }
            }
        });
        
    } catch (error) {
        console.error('Create Voice Prescription Error:', error);
        res.status(500).json({ 
            message: "Failed to create voice prescription", 
            error: error.message 
        });
    }
};

// Get Doctor's Voice Prescriptions
export const getDoctorVoicePrescriptions = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const type = req.query.type;
        
        let query = { doctor: doctorId };
        if (status) query.status = status;
        if (type) query.type = type;
        
        const prescriptions = await Prescription.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('patient', 'name email profileImage')
            .populate('doctor', 'name email profileImage experience')
            .lean();
        
        const total = await Prescription.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            prescriptions,
            pagination: {
                currentPage: page,
                totalPages,
                totalPrescriptions: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
        
    } catch (error) {
        console.error('Get Doctor Voice Prescriptions Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch voice prescriptions", 
            error: error.message 
        });
    }
};

// Get Patient's Voice Prescriptions
export const getPatientVoicePrescriptions = async (req, res) => {
    try {
        const patientId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const type = req.query.type;
        
        let query = { patient: patientId };
        if (status) query.status = status;
        if (type) query.type = type;
        
        const prescriptions = await Prescription.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('doctor', 'name email profileImage experience')
            .populate('patient', 'name email profileImage')
            .lean();
        
        const total = await Prescription.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            prescriptions,
            pagination: {
                currentPage: page,
                totalPages,
                totalPrescriptions: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
        
    } catch (error) {
        console.error('Get Patient Voice Prescriptions Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch voice prescriptions", 
            error: error.message 
        });
    }
};

// Get Single Voice Prescription
export const getVoicePrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const prescription = await Prescription.findById(id)
            .populate('doctor', 'name email profileImage experience')
            .populate('patient', 'name email profileImage');
        
        if (!prescription) {
            return res.status(404).json({ message: "Voice prescription not found" });
        }
        
        // Check if user is authorized to view this prescription
        if (prescription.patient._id.toString() !== userId && prescription.doctor._id.toString() !== userId) {
            return res.status(403).json({ message: "Access denied. Not authorized to view this prescription" });
        }
        
        // Mark as received if patient is viewing for the first time
        if (prescription.patient._id.toString() === userId && prescription.status === 'sent') {
            prescription.status = 'received';
            await prescription.save();
        }
        
        res.json({ prescription });
        
    } catch (error) {
        console.error('Get Voice Prescription By ID Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch voice prescription", 
            error: error.message 
        });
    }
};

// Acknowledge Voice Prescription (Patient only)
export const acknowledgeVoicePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;
        
        const prescription = await Prescription.findOne({ 
            _id: id, 
            patient: patientId 
        });
        
        if (!prescription) {
            return res.status(404).json({ 
                message: "Voice prescription not found or not authorized" 
            });
        }
        
        if (prescription.status === 'acknowledged') {
            return res.status(400).json({ 
                message: "Prescription already acknowledged" 
            });
        }
        
        await prescription.acknowledge();
        
        res.json({
            message: "Voice prescription acknowledged successfully",
            prescription: {
                id: prescription._id,
                status: prescription.status,
                acknowledgedAt: prescription.acknowledgedAt
            }
        });
        
    } catch (error) {
        console.error('Acknowledge Voice Prescription Error:', error);
        res.status(500).json({ 
            message: "Failed to acknowledge voice prescription", 
            error: error.message 
        });
    }
};

// Update Voice Prescription (Doctor only)
export const updateVoicePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;
        const { notes, priority, expiresAt, medications, recommendations } = req.body;
        
        const prescription = await Prescription.findOne({ 
            _id: id, 
            doctor: doctorId 
        });
        
        if (!prescription) {
            return res.status(404).json({ 
                message: "Voice prescription not found or not authorized" 
            });
        }
        
        // Update allowed fields
        if (notes !== undefined) prescription.notes = notes;
        if (priority) prescription.priority = priority;
        if (expiresAt) prescription.expiresAt = new Date(expiresAt);
        if (medications) prescription.medications = medications;
        if (recommendations) prescription.recommendations = recommendations;
        
        await prescription.save();
        await prescription.populate('doctor', 'name email profileImage experience');
        await prescription.populate('patient', 'name email profileImage');
        
        res.json({
            message: "Voice prescription updated successfully",
            prescription
        });
        
    } catch (error) {
        console.error('Update Voice Prescription Error:', error);
        res.status(500).json({ 
            message: "Failed to update voice prescription", 
            error: error.message 
        });
    }
};

// Delete Voice Prescription (Doctor only)
export const deleteVoicePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;
        
        const prescription = await Prescription.findOne({ 
            _id: id, 
            doctor: doctorId 
        });
        
        if (!prescription) {
            return res.status(404).json({ 
                message: "Voice prescription not found or not authorized" 
            });
        }
        
        // Delete audio file from cloud storage
        if (prescription.audioUrl) {
            try {
                // Extract public_id from cloudinary URL
                const publicId = prescription.audioUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
            } catch (cloudinaryError) {
                console.error('Failed to delete audio from cloudinary:', cloudinaryError);
                // Continue with database deletion
            }
        }
        
        await Prescription.findByIdAndDelete(id);
        
        res.json({ 
            message: "Voice prescription deleted successfully" 
        });
        
    } catch (error) {
        console.error('Delete Voice Prescription Error:', error);
        res.status(500).json({ 
            message: "Failed to delete voice prescription", 
            error: error.message 
        });
    }
};

// Test Speech-to-Text (for development)
export const testSpeechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                message: "Audio file is required" 
            });
        }
        
        console.log('Testing speech-to-text with file:', {
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        
        // Get audio metadata
        const audioMetadata = speechToTextService.getAudioMetadata(
            req.file.buffer, 
            req.file.mimetype
        );
        
        // Transcribe audio
        const transcriptionResult = await speechToTextService.transcribe(
            req.file.buffer,
            {
                language: 'en',
                preferredProvider: 'mock',
                fallback: true
            }
        );
        
        // Process medical transcript
        const processedTranscript = speechToTextService.processMedicalTranscript(
            transcriptionResult.transcript
        );
        
        res.json({
            message: "Speech-to-text test completed successfully",
            results: {
                audioMetadata,
                originalTranscript: transcriptionResult.transcript,
                processedTranscript,
                confidence: transcriptionResult.confidence,
                provider: transcriptionResult.provider,
                language: transcriptionResult.language,
                duration: transcriptionResult.duration
            }
        });
        
    } catch (error) {
        console.error('Test Speech-to-Text Error:', error);
        res.status(500).json({ 
            message: "Failed to test speech-to-text", 
            error: error.message 
        });
    }
};

// Helper function to parse prescription information from transcript
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
                instructions: match[3].trim(),
                route: 'oral' // default
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

// Helper function to extract frequency from instruction text
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

// Helper function to extract duration from instruction text
function extractDuration(text) {
    const durationMatch = text.match(/(\d+)\s*(day|week|month)s?/i);
    if (durationMatch) {
        return `${durationMatch[1]} ${durationMatch[2].toLowerCase()}${parseInt(durationMatch[1]) > 1 ? 's' : ''}`;
    }
    return 'As directed';
}

// Get patient notifications (User only)
export const getPatientNotifications = async (req, res) => {
    try {
        const patientId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const unreadOnly = req.query.unreadOnly === 'true';
        
        const result = await notificationService.getPatientNotifications(patientId, {
            page,
            limit,
            unreadOnly
        });
        
        res.json(result);
        
    } catch (error) {
        console.error('Get Patient Notifications Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch notifications", 
            error: error.message 
        });
    }
};

// Mark notification as read (User only)
export const markNotificationAsRead = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { notificationId } = req.params;
        
        const notification = await notificationService.markNotificationAsRead(patientId, notificationId);
        
        res.json({
            message: "Notification marked as read",
            notification
        });
        
    } catch (error) {
        console.error('Mark Notification Read Error:', error);
        res.status(500).json({ 
            message: "Failed to mark notification as read", 
            error: error.message 
        });
    }
};

// Get notification statistics (User only)
export const getNotificationStats = async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const stats = await notificationService.getNotificationStats(patientId);
        
        res.json({ stats });
        
    } catch (error) {
        console.error('Get Notification Stats Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch notification statistics", 
            error: error.message 
        });
    }
};

// Legacy endpoints (for backward compatibility)
export const processVoicePrescription = async (req, res) => {
    res.status(410).json({ 
        message: "This endpoint is deprecated. Please use POST /create-voice-prescription instead.",
        newEndpoint: "/api/voice-prescription/create-voice-prescription"
    });
};

export const savePrescription = async (req, res) => {
    res.status(410).json({ 
        message: "This endpoint is deprecated. Prescriptions are now automatically saved when created.",
        alternativeEndpoints: {
            create: "/api/voice-prescription/create-voice-prescription",
            view: "/api/voice-prescription/doctor/prescriptions"
        }
    });
};
