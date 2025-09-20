import SymptomAssessment from '../models/SymptomAssessmentSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';

// Gemini API integration
class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async analyzeSymptoms(symptoms, userInfo) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const prompt = this.buildMedicalPrompt(symptoms, userInfo);
        
        const startTime = Date.now();
        
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const processingTime = Date.now() - startTime;

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response from Gemini API');
            }

            const rawResponse = data.candidates[0].content.parts[0].text;
            const parsedResponse = this.parseGeminiResponse(rawResponse);

            return {
                ...parsedResponse,
                rawResponse,
                model: 'gemini-pro',
                tokensUsed: data.usageMetadata?.totalTokenCount || 0,
                processingTime
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Failed to analyze symptoms: ${error.message}`);
        }
    }

    buildMedicalPrompt(symptoms, userInfo) {
        const symptomsText = symptoms.map(s => 
            `- ${s.name} (${s.severity} severity${s.duration ? `, duration: ${s.duration}` : ''}${s.description ? `, description: ${s.description}` : ''})`
        ).join('\n');

        return `You are a medical AI assistant specialized in symptom analysis and medicine suggestions. Analyze the following patient information and provide a structured medical assessment.

PATIENT INFORMATION:
- Age: ${userInfo.age || 'Not specified'}
- Gender: ${userInfo.gender || 'Not specified'}
- Existing Conditions: ${userInfo.existingConditions?.join(', ') || 'None reported'}
- Current Medications: ${userInfo.currentMedications?.join(', ') || 'None reported'}
- Allergies: ${userInfo.allergies?.join(', ') || 'None reported'}

SYMPTOMS:
${symptomsText}

Please provide your analysis in the following JSON format:
{
  "possibleConditions": [
    {
      "condition": "condition name",
      "confidence": 85,
      "description": "brief description"
    }
  ],
  "suggestedMedicines": [
    {
      "name": "medicine name",
      "dosage": "recommended dosage",
      "frequency": "how often to take",
      "duration": "how long to take",
      "purpose": "what it treats",
      "warnings": ["warning 1", "warning 2"],
      "confidence": 80
    }
  ],
  "recommendations": [
    "general recommendation 1",
    "general recommendation 2"
  ],
  "urgency": "low|medium|high|emergency",
  "suggestedSpecialist": "type of specialist to consult"
}

IMPORTANT GUIDELINES:
1. Only suggest over-the-counter medications and common treatments
2. Always recommend consulting a healthcare professional for serious symptoms
3. Consider drug interactions with current medications
4. Factor in allergies when suggesting medicines
5. Set urgency based on symptom severity and potential complications
6. Provide confidence scores (0-100) for all suggestions
7. Include appropriate warnings for all medications
8. Do not provide specific medical diagnoses, only possible conditions
9. Always err on the side of caution for urgent symptoms

Respond only with valid JSON, no additional text.`;
    }

    parseGeminiResponse(response) {
        try {
            // Clean the response to extract JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            
            // Validate and sanitize the response
            return {
                possibleConditions: this.validateConditions(parsed.possibleConditions || []),
                suggestedMedicines: this.validateMedicines(parsed.suggestedMedicines || []),
                recommendations: this.validateRecommendations(parsed.recommendations || []),
                urgency: this.validateUrgency(parsed.urgency || 'medium'),
                suggestedSpecialist: parsed.suggestedSpecialist || 'General Practitioner'
            };

        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            // Return a safe fallback response
            return {
                possibleConditions: [{
                    condition: "General symptoms",
                    confidence: 50,
                    description: "Symptoms require professional evaluation"
                }],
                suggestedMedicines: [{
                    name: "Consult healthcare provider",
                    dosage: "N/A",
                    frequency: "N/A",
                    duration: "N/A",
                    purpose: "Professional medical evaluation",
                    warnings: ["Seek immediate medical attention if symptoms worsen"],
                    confidence: 100
                }],
                recommendations: [
                    "Consult with a healthcare professional",
                    "Monitor symptoms closely",
                    "Seek emergency care if symptoms worsen"
                ],
                urgency: "medium",
                suggestedSpecialist: "General Practitioner"
            };
        }
    }

    validateConditions(conditions) {
        return conditions.slice(0, 5).map(condition => ({
            condition: condition.condition || 'Unknown condition',
            confidence: Math.min(100, Math.max(0, condition.confidence || 50)),
            description: condition.description || 'Requires professional evaluation'
        }));
    }

    validateMedicines(medicines) {
        return medicines.slice(0, 5).map(medicine => ({
            name: medicine.name || 'Consult healthcare provider',
            dosage: medicine.dosage || 'As directed by healthcare provider',
            frequency: medicine.frequency || 'As directed',
            duration: medicine.duration || 'As directed',
            purpose: medicine.purpose || 'Medical treatment',
            warnings: Array.isArray(medicine.warnings) ? medicine.warnings.slice(0, 3) : ['Consult healthcare provider'],
            confidence: Math.min(100, Math.max(0, medicine.confidence || 50))
        }));
    }

    validateRecommendations(recommendations) {
        return Array.isArray(recommendations) ? recommendations.slice(0, 5) : [
            'Consult with a healthcare professional',
            'Monitor symptoms closely'
        ];
    }

    validateUrgency(urgency) {
        const validUrgencies = ['low', 'medium', 'high', 'emergency'];
        return validUrgencies.includes(urgency) ? urgency : 'medium';
    }
}

const geminiService = new GeminiService();

// Submit symptoms for AI analysis
export const submitSymptoms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { symptoms, additionalInfo } = req.body;

        // Validate input
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ 
                message: "Symptoms array is required and cannot be empty" 
            });
        }

        // Validate each symptom
        for (const symptom of symptoms) {
            if (!symptom.name || typeof symptom.name !== 'string') {
                return res.status(400).json({ 
                    message: "Each symptom must have a valid name" 
                });
            }
        }

        // Get user information
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare user info for AI analysis
        const userInfo = {
            age: user.age,
            gender: user.gender,
            existingConditions: additionalInfo?.existingConditions || [],
            currentMedications: additionalInfo?.currentMedications || [],
            allergies: additionalInfo?.allergies || user.allergies || []
        };

        // Create symptom assessment record
        const assessment = new SymptomAssessment({
            userId,
            symptoms,
            additionalInfo: {
                ...userInfo,
                notes: additionalInfo?.notes || ''
            },
            status: 'pending',
            metadata: {
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip || req.connection.remoteAddress
            }
        });

        await assessment.save();

        // Analyze symptoms with Gemini AI
        try {
            const aiAnalysis = await geminiService.analyzeSymptoms(symptoms, userInfo);
            
            // Update assessment with AI analysis
            assessment.aiAnalysis = aiAnalysis;
            assessment.geminiResponse = {
                rawResponse: aiAnalysis.rawResponse,
                model: aiAnalysis.model,
                tokensUsed: aiAnalysis.tokensUsed,
                processingTime: aiAnalysis.processingTime
            };
            assessment.status = 'analyzed';

            // Determine if follow-up is needed
            if (aiAnalysis.urgency === 'high' || aiAnalysis.urgency === 'emergency') {
                assessment.followUp.required = true;
                assessment.followUp.suggestedDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                assessment.followUp.notes = 'High urgency assessment - follow-up recommended within 24 hours';
            }

            await assessment.save();

            res.status(201).json({
                message: "Symptoms analyzed successfully",
                assessment: {
                    id: assessment._id,
                    symptoms: assessment.symptoms,
                    aiAnalysis: assessment.aiAnalysis,
                    status: assessment.status,
                    followUp: assessment.followUp,
                    createdAt: assessment.createdAt
                }
            });

        } catch (aiError) {
            console.error('AI Analysis Error:', aiError);
            
            // Save assessment with error status
            assessment.status = 'pending';
            assessment.geminiResponse = {
                rawResponse: `AI analysis failed: ${aiError.message}`,
                model: 'gemini-pro',
                tokensUsed: 0,
                processingTime: 0
            };
            await assessment.save();

            res.status(500).json({
                message: "Symptoms submitted but AI analysis failed",
                error: aiError.message,
                assessment: {
                    id: assessment._id,
                    status: assessment.status
                }
            });
        }

    } catch (error) {
        console.error('Submit Symptoms Error:', error);
        res.status(500).json({ 
            message: "Failed to submit symptoms", 
            error: error.message 
        });
    }
};

// Get user's symptom assessment history
export const getAssessmentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await SymptomAssessment.getUserHistory(userId, page, limit);

        res.json({
            message: "Assessment history retrieved successfully",
            ...result
        });

    } catch (error) {
        console.error('Get Assessment History Error:', error);
        res.status(500).json({ 
            message: "Failed to get assessment history", 
            error: error.message 
        });
    }
};

// Get specific assessment details
export const getAssessmentDetails = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const userId = req.user.id;

        const assessment = await SymptomAssessment.findOne({ 
            _id: assessmentId, 
            userId 
        });

        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        res.json({
            message: "Assessment details retrieved successfully",
            assessment
        });

    } catch (error) {
        console.error('Get Assessment Details Error:', error);
        res.status(500).json({ 
            message: "Failed to get assessment details", 
            error: error.message 
        });
    }
};

// Get assessments by urgency (for doctors)
export const getAssessmentsByUrgency = async (req, res) => {
    try {
        const { urgency } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        // Verify user is a doctor
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Only doctors can view assessments by urgency." });
        }

        const assessments = await SymptomAssessment.getByUrgency(urgency, limit);

        res.json({
            message: `Assessments with ${urgency} urgency retrieved successfully`,
            assessments: assessments.map(assessment => ({
                id: assessment._id,
                userId: assessment.userId,
                symptoms: assessment.symptoms,
                aiAnalysis: {
                    possibleConditions: assessment.aiAnalysis.possibleConditions,
                    urgency: assessment.aiAnalysis.urgency,
                    suggestedSpecialist: assessment.aiAnalysis.suggestedSpecialist
                },
                createdAt: assessment.createdAt,
                status: assessment.status
            }))
        });

    } catch (error) {
        console.error('Get Assessments By Urgency Error:', error);
        res.status(500).json({ 
            message: "Failed to get assessments by urgency", 
            error: error.message 
        });
    }
};

// Get assessment statistics
export const getAssessmentStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await SymptomAssessment.getStatistics(userId);

        res.json({
            message: "Assessment statistics retrieved successfully",
            statistics: {
                totalAssessments: stats.totalAssessments,
                highUrgencyAssessments: stats.highUrgency,
                averageConfidence: Math.round(stats.averageConfidence || 0),
                mostCommonSymptoms: stats.mostCommonSymptoms.flat().slice(0, 10)
            }
        });

    } catch (error) {
        console.error('Get Assessment Statistics Error:', error);
        res.status(500).json({ 
            message: "Failed to get assessment statistics", 
            error: error.message 
        });
    }
};

// Update assessment status (for doctors)
export const updateAssessmentStatus = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const { status, followUpNotes } = req.body;
        const userId = req.user.id;

        // Verify user is a doctor
        const doctor = await Doctor.findById(userId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Only doctors can update assessment status." });
        }

        const assessment = await SymptomAssessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        // Update status
        assessment.status = status;
        if (followUpNotes) {
            assessment.followUp.notes = followUpNotes;
        }

        await assessment.save();

        res.json({
            message: "Assessment status updated successfully",
            assessment: {
                id: assessment._id,
                status: assessment.status,
                followUp: assessment.followUp
            }
        });

    } catch (error) {
        console.error('Update Assessment Status Error:', error);
        res.status(500).json({ 
            message: "Failed to update assessment status", 
            error: error.message 
        });
    }
};

// Get pending assessments (for doctors)
export const getPendingAssessments = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // Verify user is a doctor
        const doctor = await Doctor.findById(userId);
        if (!doctor) {
            return res.status(403).json({ message: "Access denied. Only doctors can view pending assessments." });
        }

        const skip = (page - 1) * limit;
        
        const assessments = await SymptomAssessment.find({ status: 'pending' })
            .populate('userId', 'name email age gender')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await SymptomAssessment.countDocuments({ status: 'pending' });

        res.json({
            message: "Pending assessments retrieved successfully",
            assessments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalAssessments: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get Pending Assessments Error:', error);
        res.status(500).json({ 
            message: "Failed to get pending assessments", 
            error: error.message 
        });
    }
};

