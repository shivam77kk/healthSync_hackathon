# Symptom Assessment API Documentation

## Overview
This document describes the AI-powered symptom assessment feature integrated into the HealthSync healthcare application. The feature uses Google's Gemini AI to analyze user symptoms and provide medicine suggestions, possible conditions, and medical recommendations.

## Features
- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent symptom analysis
- **Medicine Suggestions**: Provides over-the-counter medication recommendations
- **Condition Assessment**: Suggests possible conditions based on symptoms
- **Urgency Classification**: Categorizes symptoms by urgency level
- **Specialist Recommendations**: Suggests appropriate medical specialists
- **Comprehensive Tracking**: Full history and statistics of assessments
- **Doctor Dashboard**: Allows doctors to review and manage assessments

## API Endpoints

### 1. Submit Symptoms for Analysis
**POST** `/api/symptom-assessment/submit`

Submit symptoms for AI analysis and get medicine suggestions.

**Request Body:**
```json
{
  "symptoms": [
    {
      "name": "headache",
      "severity": "moderate",
      "duration": "2 days",
      "description": "throbbing pain in temples"
    },
    {
      "name": "fever",
      "severity": "mild",
      "duration": "1 day",
      "description": "low grade fever"
    }
  ],
  "additionalInfo": {
    "existingConditions": ["hypertension"],
    "currentMedications": ["lisinopril"],
    "allergies": ["penicillin"],
    "notes": "Started after exposure to cold weather"
  }
}
```

**Response:**
```json
{
  "message": "Symptoms analyzed successfully",
  "assessment": {
    "id": "assessment_id",
    "symptoms": [...],
    "aiAnalysis": {
      "possibleConditions": [
        {
          "condition": "Viral upper respiratory infection",
          "confidence": 85,
          "description": "Common cold with headache and low-grade fever"
        }
      ],
      "suggestedMedicines": [
        {
          "name": "Acetaminophen",
          "dosage": "500mg",
          "frequency": "Every 6 hours",
          "duration": "3-5 days",
          "purpose": "Pain relief and fever reduction",
          "warnings": ["Do not exceed 4g per day", "Check for liver conditions"],
          "confidence": 90
        }
      ],
      "recommendations": [
        "Get adequate rest",
        "Stay well hydrated",
        "Monitor temperature regularly"
      ],
      "urgency": "medium",
      "suggestedSpecialist": "General Practitioner"
    },
    "status": "analyzed",
    "followUp": {
      "required": false,
      "suggestedDate": null,
      "notes": null
    },
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Get Assessment History
**GET** `/api/symptom-assessment/history?page=1&limit=20`

Retrieve user's symptom assessment history.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "message": "Assessment history retrieved successfully",
  "assessments": [
    {
      "id": "assessment_id",
      "symptoms": [...],
      "aiAnalysis": {
        "possibleConditions": [...],
        "urgency": "medium",
        "suggestedSpecialist": "General Practitioner"
      },
      "status": "analyzed",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAssessments": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get Assessment Details
**GET** `/api/symptom-assessment/:assessmentId`

Get detailed information about a specific assessment.

**Response:**
```json
{
  "message": "Assessment details retrieved successfully",
  "assessment": {
    "id": "assessment_id",
    "userId": "user_id",
    "symptoms": [...],
    "additionalInfo": {...},
    "aiAnalysis": {...},
    "geminiResponse": {
      "rawResponse": "AI response text",
      "model": "gemini-pro",
      "tokensUsed": 1500,
      "processingTime": 2500
    },
    "status": "analyzed",
    "followUp": {...},
    "metadata": {...},
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### 4. Get Assessment Statistics
**GET** `/api/symptom-assessment/statistics`

Get user's assessment statistics and insights.

**Response:**
```json
{
  "message": "Assessment statistics retrieved successfully",
  "statistics": {
    "totalAssessments": 25,
    "highUrgencyAssessments": 3,
    "averageConfidence": 78,
    "mostCommonSymptoms": [
      "headache",
      "fever",
      "cough",
      "fatigue",
      "nausea"
    ]
  }
}
```

### 5. Get Pending Assessments (Doctor Only)
**GET** `/api/symptom-assessment/doctor/pending?page=1&limit=20`

Retrieve assessments pending doctor review.

**Response:**
```json
{
  "message": "Pending assessments retrieved successfully",
  "assessments": [
    {
      "id": "assessment_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 35,
        "gender": "male"
      },
      "symptoms": [...],
      "aiAnalysis": {...},
      "createdAt": "2024-01-01T12:00:00Z",
      "status": "pending"
    }
  ],
  "pagination": {...}
}
```

### 6. Get Assessments by Urgency (Doctor Only)
**GET** `/api/symptom-assessment/doctor/urgency/:urgency?limit=50`

Get assessments filtered by urgency level.

**Path Parameters:**
- `urgency`: low, medium, high, or emergency

**Response:**
```json
{
  "message": "Assessments with high urgency retrieved successfully",
  "assessments": [
    {
      "id": "assessment_id",
      "userId": {...},
      "symptoms": [...],
      "aiAnalysis": {
        "possibleConditions": [...],
        "urgency": "high",
        "suggestedSpecialist": "Emergency Medicine"
      },
      "createdAt": "2024-01-01T12:00:00Z",
      "status": "analyzed"
    }
  ]
}
```

### 7. Update Assessment Status (Doctor Only)
**PUT** `/api/symptom-assessment/doctor/:assessmentId/status`

Update the status of an assessment.

**Request Body:**
```json
{
  "status": "reviewed",
  "followUpNotes": "Patient should follow up in 3 days if symptoms persist"
}
```

**Response:**
```json
{
  "message": "Assessment status updated successfully",
  "assessment": {
    "id": "assessment_id",
    "status": "reviewed",
    "followUp": {
      "required": true,
      "suggestedDate": "2024-01-04T12:00:00Z",
      "notes": "Patient should follow up in 3 days if symptoms persist"
    }
  }
}
```

## Database Schema

### SymptomAssessment Model
```javascript
{
  userId: ObjectId, // Reference to User
  symptoms: [{
    name: String,
    severity: String, // mild, moderate, severe
    duration: String,
    description: String
  }],
  additionalInfo: {
    age: Number,
    gender: String,
    existingConditions: [String],
    currentMedications: [String],
    allergies: [String],
    notes: String
  },
  aiAnalysis: {
    possibleConditions: [{
      condition: String,
      confidence: Number,
      description: String
    }],
    suggestedMedicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      purpose: String,
      warnings: [String],
      confidence: Number
    }],
    recommendations: [String],
    urgency: String, // low, medium, high, emergency
    suggestedSpecialist: String
  },
  geminiResponse: {
    rawResponse: String,
    model: String,
    tokensUsed: Number,
    processingTime: Number
  },
  status: String, // pending, analyzed, reviewed, archived
  followUp: {
    required: Boolean,
    suggestedDate: Date,
    notes: String
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    assessmentVersion: String
  }
}
```

## Environment Variables Required

Add this to your `.env` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

## Gemini AI Integration

### Features
- **Intelligent Analysis**: Uses Google's Gemini Pro model for medical analysis
- **Safety Settings**: Configured with appropriate safety filters
- **Structured Output**: Returns structured JSON responses
- **Error Handling**: Graceful fallback for API failures
- **Token Tracking**: Monitors API usage and costs

### AI Prompt Engineering
The system uses carefully crafted prompts that:
- Include patient demographics and medical history
- Request structured JSON responses
- Emphasize safety and professional consultation
- Focus on over-the-counter medications
- Provide confidence scores for all suggestions

## Security and Privacy

### Data Protection
- All assessments are tied to authenticated users
- Sensitive medical data is encrypted in transit
- Access controls prevent unauthorized data access
- Audit trail for all assessment activities

### AI Safety
- Safety settings configured to block harmful content
- Medical disclaimers in all AI responses
- Emphasis on professional medical consultation
- No specific medical diagnoses provided

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "Symptoms array is required and cannot be empty"
}
```

**401 Unauthorized:**
```json
{
  "message": "Access denied. Authentication required."
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Only doctors can view assessments by urgency."
}
```

**404 Not Found:**
```json
{
  "message": "Assessment not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to analyze symptoms",
  "error": "Gemini API error: API key not configured"
}
```

## Usage Examples

### Frontend Integration

```javascript
// Submit symptoms for analysis
const submitSymptoms = async (symptoms, additionalInfo) => {
  try {
    const response = await fetch('/api/symptom-assessment/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        symptoms,
        additionalInfo
      })
    });
    
    const data = await response.json();
    return data.assessment;
  } catch (error) {
    console.error('Error submitting symptoms:', error);
  }
};

// Get assessment history
const getHistory = async (page = 1) => {
  const response = await fetch(`/api/symptom-assessment/history?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

### Doctor Dashboard Integration

```javascript
// Get pending assessments
const getPendingAssessments = async () => {
  const response = await fetch('/api/symptom-assessment/doctor/pending', {
    headers: {
      'Authorization': `Bearer ${doctorToken}`
    }
  });
  
  return await response.json();
};

// Update assessment status
const updateStatus = async (assessmentId, status, notes) => {
  const response = await fetch(`/api/symptom-assessment/doctor/${assessmentId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${doctorToken}`
    },
    body: JSON.stringify({
      status,
      followUpNotes: notes
    })
  });
  
  return await response.json();
};
```

## Testing

### Test Scenarios

1. **Submit Valid Symptoms**
   - Test with various symptom combinations
   - Verify AI analysis and medicine suggestions
   - Check urgency classification

2. **Error Handling**
   - Test with missing symptoms
   - Test with invalid data
   - Test API key configuration

3. **Doctor Functions**
   - Test pending assessments retrieval
   - Test status updates
   - Test urgency filtering

4. **History and Statistics**
   - Test pagination
   - Test statistics calculation
   - Test data retrieval

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key configuration
   - Verify API quota and limits
   - Check network connectivity

2. **Assessment Failures**
   - Review symptom data format
   - Check user authentication
   - Verify database connection

3. **Performance Issues**
   - Monitor API response times
   - Check database query performance
   - Review token usage

## Support

For issues with:
- **Gemini API**: Check Google AI documentation
- **API Endpoints**: Review server logs and error messages
- **Database**: Verify MongoDB connection and schema
- **Authentication**: Check JWT token validity

