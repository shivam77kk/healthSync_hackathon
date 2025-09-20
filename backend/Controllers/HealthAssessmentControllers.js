import HealthAssessment from '../models/HealthAssessmentSchema.js';
import User from '../models/userSchema.js';
import geminiService from '../services/geminiAI.service.js';

export const createHealthAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            symptoms,
            duration,
            additionalInfo,
            severity,
            customSymptoms = []
        } = req.body;

        // Validate required fields
        if (!symptoms || !duration || severity === undefined) {
            return res.status(400).json({
                message: "Symptoms, duration, and severity are required"
            });
        }

        if (severity < 1 || severity > 10) {
            return res.status(400).json({
                message: "Severity must be between 1 and 10"
            });
        }

        // Get user information for AI analysis
        const user = await User.findById(userId).select('age gender name');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the health assessment with symptoms
        const healthAssessment = new HealthAssessment({
            userId,
            symptoms: {
                general: {
                    fever: symptoms.general?.fever || false,
                    headache: symptoms.general?.headache || false,
                    fatigue: symptoms.general?.fatigue || false,
                    dizziness: symptoms.general?.dizziness || false
                },
                respiratory: {
                    cough: symptoms.respiratory?.cough || false,
                    soreThroat: symptoms.respiratory?.soreThroat || false,
                    shortnessOfBreath: symptoms.respiratory?.shortnessOfBreath || false,
                    chestPain: symptoms.respiratory?.chestPain || false
                },
                digestive: {
                    nausea: symptoms.digestive?.nausea || false
                },
                musculoskeletal: {
                    muscleAches: symptoms.musculoskeletal?.muscleAches || false
                },
                customSymptoms: customSymptoms
            },
            duration,
            additionalInfo: additionalInfo || '',
            severity,
            status: 'pending'
        });

        // Generate symptom summary for AI analysis
        const symptomSummary = healthAssessment.generateSymptomSummary();

        // Analyze symptoms with AI
        let aiAnalysis = null;
        if (geminiService.isConfigured()) {
            console.log('Analyzing symptoms with AI...');
            const aiResult = await geminiService.analyzeSymptoms(
                symptomSummary,
                user.age,
                user.gender
            );

            if (aiResult.success) {
                aiAnalysis = aiResult.data;
                healthAssessment.aiPrediction = {
                    riskLevel: aiAnalysis.riskLevel,
                    possibleConditions: aiAnalysis.possibleConditions,
                    recommendations: aiAnalysis.recommendations,
                    urgency: aiAnalysis.urgency,
                    confidence: aiAnalysis.confidence,
                    aiModel: 'gemini-pro'
                };
                healthAssessment.status = 'analyzed';
            } else {
                console.error('AI analysis failed:', aiResult.error);
                // Use fallback AI prediction
                healthAssessment.aiPrediction = aiResult.data;
                healthAssessment.status = 'analyzed';
            }
        } else {
            console.warn('Gemini AI not configured, using fallback analysis');
            // Provide basic analysis without AI
            healthAssessment.aiPrediction = {
                riskLevel: severity >= 7 ? 'high' : severity >= 4 ? 'medium' : 'low',
                possibleConditions: [{
                    name: 'General Health Assessment',
                    confidence: 50,
                    description: 'AI analysis unavailable. Please consult a healthcare professional.'
                }],
                recommendations: [
                    'Monitor your symptoms closely',
                    'Stay hydrated and get adequate rest',
                    'Consult with a healthcare professional for proper evaluation',
                    'Seek immediate medical attention if symptoms worsen'
                ],
                urgency: severity >= 8 ? 'urgent' : severity >= 5 ? 'moderate' : 'non-urgent',
                confidence: 50,
                aiModel: 'fallback'
            };
            healthAssessment.status = 'analyzed';
        }

        // Set follow-up required flag based on AI analysis
        healthAssessment.followUpRequired = 
            healthAssessment.aiPrediction.riskLevel === 'high' || 
            healthAssessment.aiPrediction.riskLevel === 'critical' ||
            healthAssessment.aiPrediction.urgency === 'urgent' ||
            healthAssessment.aiPrediction.urgency === 'emergency';

        // Save the health assessment
        await healthAssessment.save();

        // Populate user info before sending response
        await healthAssessment.populate('userId', 'name email age gender');

        res.status(201).json({
            message: "Health assessment created successfully",
            assessment: healthAssessment,
            aiConfigured: geminiService.isConfigured()
        });

    } catch (error) {
        console.error('Error creating health assessment:', error);
        res.status(500).json({
            message: "Error creating health assessment",
            error: error.message
        });
    }
};

export const getUserHealthAssessments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const query = { userId };
        if (status) {
            query.status = status;
        }

        const assessments = await HealthAssessment.find(query)
            .populate('userId', 'name email age gender')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalAssessments = await HealthAssessment.countDocuments(query);

        res.status(200).json({
            message: "Health assessments retrieved successfully",
            assessments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalAssessments / parseInt(limit)),
                totalAssessments,
                hasNextPage: parseInt(page) < Math.ceil(totalAssessments / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Error retrieving health assessments:', error);
        res.status(500).json({
            message: "Error retrieving health assessments",
            error: error.message
        });
    }
};

export const getHealthAssessmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const assessment = await HealthAssessment.findOne({ _id: id, userId })
            .populate('userId', 'name email age gender')
            .populate('doctorReview.doctorId', 'name qualifications profileImage');

        if (!assessment) {
            return res.status(404).json({ 
                message: "Health assessment not found or access denied" 
            });
        }

        res.status(200).json({
            message: "Health assessment retrieved successfully",
            assessment
        });

    } catch (error) {
        console.error('Error retrieving health assessment:', error);
        res.status(500).json({
            message: "Error retrieving health assessment",
            error: error.message
        });
    }
};

export const deleteHealthAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const assessment = await HealthAssessment.findOneAndDelete({ _id: id, userId });

        if (!assessment) {
            return res.status(404).json({ 
                message: "Health assessment not found or access denied" 
            });
        }

        res.status(200).json({
            message: "Health assessment deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting health assessment:', error);
        res.status(500).json({
            message: "Error deleting health assessment",
            error: error.message
        });
    }
};

export const updateHealthAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        // Remove fields that shouldn't be updated directly
        delete updates.aiPrediction;
        delete updates.userId;
        delete updates.createdAt;
        delete updates.updatedAt;

        const assessment = await HealthAssessment.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true, runValidators: true }
        ).populate('userId', 'name email age gender');

        if (!assessment) {
            return res.status(404).json({ 
                message: "Health assessment not found or access denied" 
            });
        }

        res.status(200).json({
            message: "Health assessment updated successfully",
            assessment
        });

    } catch (error) {
        console.error('Error updating health assessment:', error);
        res.status(500).json({
            message: "Error updating health assessment",
            error: error.message
        });
    }
};

export const reanalyzeHealthAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const assessment = await HealthAssessment.findOne({ _id: id, userId });
        if (!assessment) {
            return res.status(404).json({ 
                message: "Health assessment not found or access denied" 
            });
        }

        if (!geminiService.isConfigured()) {
            return res.status(503).json({
                message: "AI service is not configured. Cannot reanalyze symptoms."
            });
        }

        // Get user information for AI analysis
        const user = await User.findById(userId).select('age gender name');
        const symptomSummary = assessment.generateSymptomSummary();

        // Reanalyze symptoms with AI
        const aiResult = await geminiService.analyzeSymptoms(
            symptomSummary,
            user.age,
            user.gender
        );

        if (aiResult.success) {
            assessment.aiPrediction = {
                riskLevel: aiResult.data.riskLevel,
                possibleConditions: aiResult.data.possibleConditions,
                recommendations: aiResult.data.recommendations,
                urgency: aiResult.data.urgency,
                confidence: aiResult.data.confidence,
                aiModel: 'gemini-pro'
            };
            assessment.status = 'analyzed';
        } else {
            return res.status(500).json({
                message: "Failed to reanalyze symptoms",
                error: aiResult.error
            });
        }

        // Update follow-up required flag
        assessment.followUpRequired = 
            assessment.aiPrediction.riskLevel === 'high' || 
            assessment.aiPrediction.riskLevel === 'critical' ||
            assessment.aiPrediction.urgency === 'urgent' ||
            assessment.aiPrediction.urgency === 'emergency';

        await assessment.save();
        await assessment.populate('userId', 'name email age gender');

        res.status(200).json({
            message: "Health assessment reanalyzed successfully",
            assessment
        });

    } catch (error) {
        console.error('Error reanalyzing health assessment:', error);
        res.status(500).json({
            message: "Error reanalyzing health assessment",
            error: error.message
        });
    }
};

export const getHealthTips = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({
                message: "Symptoms array is required"
            });
        }

        let tips = [];
        
        if (geminiService.isConfigured()) {
            const tipsResult = await geminiService.generateHealthTips(symptoms);
            if (tipsResult.success) {
                tips = tipsResult.data;
            }
        }

        // Fallback tips if AI is not available or fails
        if (tips.length === 0) {
            tips = [
                'Stay hydrated by drinking plenty of water',
                'Get adequate rest and sleep (7-9 hours per night)',
                'Eat a balanced diet rich in fruits, vegetables, and nutrients',
                'Consider light exercise if you feel up to it',
                'Monitor your symptoms and note any changes',
                'Consult with a healthcare professional for proper evaluation',
                'Seek immediate medical attention if symptoms worsen significantly'
            ];
        }

        res.status(200).json({
            message: "Health tips generated successfully",
            tips,
            aiGenerated: geminiService.isConfigured()
        });

    } catch (error) {
        console.error('Error generating health tips:', error);
        res.status(500).json({
            message: "Error generating health tips",
            error: error.message
        });
    }
};

// Doctor endpoints for reviewing health assessments
export const getDoctorHealthAssessments = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { page = 1, limit = 10, riskLevel, urgency } = req.query;

        const query = {};
        if (riskLevel) query['aiPrediction.riskLevel'] = riskLevel;
        if (urgency) query['aiPrediction.urgency'] = urgency;

        const assessments = await HealthAssessment.find(query)
            .populate('userId', 'name email age gender profileImage')
            .sort({ 'aiPrediction.riskLevel': -1, createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalAssessments = await HealthAssessment.countDocuments(query);

        res.status(200).json({
            message: "Health assessments for review retrieved successfully",
            assessments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalAssessments / parseInt(limit)),
                totalAssessments,
                hasNextPage: parseInt(page) < Math.ceil(totalAssessments / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Error retrieving health assessments for doctor:', error);
        res.status(500).json({
            message: "Error retrieving health assessments",
            error: error.message
        });
    }
};

export const addDoctorReview = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;
        const { notes, diagnosis, treatment } = req.body;

        const assessment = await HealthAssessment.findById(id);
        if (!assessment) {
            return res.status(404).json({ message: "Health assessment not found" });
        }

        assessment.doctorReview = {
            doctorId,
            notes: notes || '',
            diagnosis: diagnosis || '',
            treatment: treatment || '',
            reviewDate: new Date()
        };
        assessment.status = 'reviewed';

        await assessment.save();
        await assessment.populate('userId', 'name email age gender');
        await assessment.populate('doctorReview.doctorId', 'name qualifications profileImage');

        res.status(200).json({
            message: "Doctor review added successfully",
            assessment
        });

    } catch (error) {
        console.error('Error adding doctor review:', error);
        res.status(500).json({
            message: "Error adding doctor review",
            error: error.message
        });
    }
};