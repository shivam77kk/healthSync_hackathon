import mongoose from 'mongoose';

const symptomAssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe'],
            default: 'moderate'
        },
        duration: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        }
    }],
    additionalInfo: {
        age: {
            type: Number
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        existingConditions: [{
            type: String,
            trim: true
        }],
        currentMedications: [{
            type: String,
            trim: true
        }],
        allergies: [{
            type: String,
            trim: true
        }],
        notes: {
            type: String,
            trim: true
        }
    },
    aiAnalysis: {
        possibleConditions: [{
            condition: {
                type: String,
                required: true
            },
            confidence: {
                type: Number,
                min: 0,
                max: 100
            },
            description: {
                type: String
            }
        }],
        suggestedMedicines: [{
            name: {
                type: String,
                required: true
            },
            dosage: {
                type: String
            },
            frequency: {
                type: String
            },
            duration: {
                type: String
            },
            purpose: {
                type: String
            },
            warnings: [{
                type: String
            }],
            confidence: {
                type: Number,
                min: 0,
                max: 100
            }
        }],
        recommendations: [{
            type: String
        }],
        urgency: {
            type: String,
            enum: ['low', 'medium', 'high', 'emergency'],
            default: 'medium'
        },
        suggestedSpecialist: {
            type: String
        }
    },
    geminiResponse: {
        rawResponse: {
            type: String
        },
        model: {
            type: String,
            default: 'gemini-pro'
        },
        tokensUsed: {
            type: Number
        },
        processingTime: {
            type: Number // in milliseconds
        }
    },
    status: {
        type: String,
        enum: ['pending', 'analyzed', 'reviewed', 'archived'],
        default: 'pending'
    },
    followUp: {
        required: {
            type: Boolean,
            default: false
        },
        suggestedDate: {
            type: Date
        },
        notes: {
            type: String
        }
    },
    metadata: {
        userAgent: {
            type: String
        },
        ipAddress: {
            type: String
        },
        assessmentVersion: {
            type: String,
            default: '1.0'
        }
    }
}, { 
    timestamps: true 
});

// Indexes for better performance
symptomAssessmentSchema.index({ userId: 1, createdAt: -1 });
symptomAssessmentSchema.index({ status: 1 });
symptomAssessmentSchema.index({ 'aiAnalysis.urgency': 1 });
symptomAssessmentSchema.index({ createdAt: -1 });

// Virtual for assessment age in days
symptomAssessmentSchema.virtual('assessmentAge').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to get severity score
symptomAssessmentSchema.methods.getSeverityScore = function() {
    const severityScores = { mild: 1, moderate: 2, severe: 3 };
    return this.symptoms.reduce((total, symptom) => {
        return total + (severityScores[symptom.severity] || 0);
    }, 0);
};

// Method to check if follow-up is needed
symptomAssessmentSchema.methods.needsFollowUp = function() {
    const highUrgency = this.aiAnalysis.urgency === 'high' || this.aiAnalysis.urgency === 'emergency';
    const highSeverity = this.getSeverityScore() >= 6; // 2 severe symptoms
    const ageInDays = this.assessmentAge;
    
    return highUrgency || highSeverity || ageInDays >= 7;
};

// Static method to get assessments by urgency
symptomAssessmentSchema.statics.getByUrgency = async function(urgency, limit = 50) {
    return await this.find({ 'aiAnalysis.urgency': urgency })
        .populate('userId', 'name email age gender')
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Static method to get user's assessment history
symptomAssessmentSchema.statics.getUserHistory = async function(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const assessments = await this.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await this.countDocuments({ userId });

    return {
        assessments,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAssessments: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

// Static method to get statistics
symptomAssessmentSchema.statics.getStatistics = async function(userId = null) {
    const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
    
    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalAssessments: { $sum: 1 },
                highUrgency: {
                    $sum: {
                        $cond: [
                            { $in: ['$aiAnalysis.urgency', ['high', 'emergency']] },
                            1,
                            0
                        ]
                    }
                },
                averageConfidence: {
                    $avg: {
                        $avg: '$aiAnalysis.suggestedMedicines.confidence'
                    }
                },
                mostCommonSymptoms: {
                    $push: '$symptoms.name'
                }
            }
        }
    ]);

    return stats[0] || {
        totalAssessments: 0,
        highUrgency: 0,
        averageConfidence: 0,
        mostCommonSymptoms: []
    };
};

// Ensure virtual fields are serialized
symptomAssessmentSchema.set('toJSON', {
    virtuals: true
});

const SymptomAssessment = mongoose.model('SymptomAssessment', symptomAssessmentSchema);

export default SymptomAssessment;

