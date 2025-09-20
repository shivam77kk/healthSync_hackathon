import mongoose from "mongoose";

const healthAssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: {
        general: {
            fever: {
                type: Boolean,
                default: false
            },
            headache: {
                type: Boolean,
                default: false
            },
            fatigue: {
                type: Boolean,
                default: false
            },
            dizziness: {
                type: Boolean,
                default: false
            }
        },
        respiratory: {
            cough: {
                type: Boolean,
                default: false
            },
            soreThroat: {
                type: Boolean,
                default: false
            },
            shortnessOfBreath: {
                type: Boolean,
                default: false
            },
            chestPain: {
                type: Boolean,
                default: false
            }
        },
        digestive: {
            nausea: {
                type: Boolean,
                default: false
            }
        },
        musculoskeletal: {
            muscleAches: {
                type: Boolean,
                default: false
            }
        },
        customSymptoms: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                trim: true
            }
        }]
    },
    duration: {
        type: String,
        required: true,
        trim: true,
        // e.g., "2 days", "1 week", "3 days"
    },
    additionalInfo: {
        type: String,
        trim: true,
        // Additional details about symptoms, triggers, or concerns
    },
    severity: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
        // 1-10 scale for symptom severity
    },
    aiPrediction: {
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'low'
        },
        possibleConditions: [{
            name: {
                type: String,
                required: true
            },
            confidence: {
                type: Number,
                min: 0,
                max: 100,
                required: true
            },
            description: {
                type: String
            }
        }],
        recommendations: [{
            type: String,
            required: true
        }],
        urgency: {
            type: String,
            enum: ['non-urgent', 'moderate', 'urgent', 'emergency'],
            default: 'non-urgent'
        },
        aiModel: {
            type: String,
            default: 'gemini-pro'
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['pending', 'analyzed', 'reviewed', 'completed'],
        default: 'pending'
    },
    followUpRequired: {
        type: Boolean,
        default: false
    },
    doctorReview: {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        },
        notes: {
            type: String,
            trim: true
        },
        diagnosis: {
            type: String,
            trim: true
        },
        treatment: {
            type: String,
            trim: true
        },
        reviewDate: {
            type: Date
        }
    }
}, { timestamps: true });

// Indexes for better performance
healthAssessmentSchema.index({ userId: 1, createdAt: -1 });
healthAssessmentSchema.index({ 'aiPrediction.riskLevel': 1 });
healthAssessmentSchema.index({ status: 1 });
healthAssessmentSchema.index({ 'aiPrediction.urgency': 1 });

// Method to get all selected symptoms as an array
healthAssessmentSchema.methods.getSelectedSymptoms = function() {
    const selectedSymptoms = [];
    
    // General symptoms
    if (this.symptoms.general.fever) selectedSymptoms.push('Fever');
    if (this.symptoms.general.headache) selectedSymptoms.push('Headache');
    if (this.symptoms.general.fatigue) selectedSymptoms.push('Fatigue');
    if (this.symptoms.general.dizziness) selectedSymptoms.push('Dizziness');
    
    // Respiratory symptoms
    if (this.symptoms.respiratory.cough) selectedSymptoms.push('Cough');
    if (this.symptoms.respiratory.soreThroat) selectedSymptoms.push('Sore Throat');
    if (this.symptoms.respiratory.shortnessOfBreath) selectedSymptoms.push('Shortness of Breath');
    if (this.symptoms.respiratory.chestPain) selectedSymptoms.push('Chest Pain');
    
    // Digestive symptoms
    if (this.symptoms.digestive.nausea) selectedSymptoms.push('Nausea');
    
    // Musculoskeletal symptoms
    if (this.symptoms.musculoskeletal.muscleAches) selectedSymptoms.push('Muscle Aches');
    
    // Custom symptoms
    this.symptoms.customSymptoms.forEach(symptom => {
        selectedSymptoms.push(symptom.name);
    });
    
    return selectedSymptoms;
};

// Method to generate symptom summary for AI analysis
healthAssessmentSchema.methods.generateSymptomSummary = function() {
    const selectedSymptoms = this.getSelectedSymptoms();
    let summary = `Symptoms: ${selectedSymptoms.join(', ')}\n`;
    summary += `Duration: ${this.duration}\n`;
    summary += `Severity (1-10): ${this.severity}\n`;
    
    if (this.additionalInfo) {
        summary += `Additional Information: ${this.additionalInfo}\n`;
    }
    
    if (this.symptoms.customSymptoms.length > 0) {
        summary += `Custom Symptoms Details:\n`;
        this.symptoms.customSymptoms.forEach(symptom => {
            summary += `- ${symptom.name}`;
            if (symptom.description) {
                summary += `: ${symptom.description}`;
            }
            summary += '\n';
        });
    }
    
    return summary;
};

// Method to check if immediate medical attention is needed
healthAssessmentSchema.methods.requiresImmediateAttention = function() {
    return this.aiPrediction.urgency === 'emergency' || 
           this.aiPrediction.riskLevel === 'critical' ||
           this.severity >= 8;
};

const HealthAssessment = mongoose.model("HealthAssessment", healthAssessmentSchema);

export default HealthAssessment;