import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAIService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found in environment variables. AI features will be limited.');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        this.model = null;
    }

    async initializeModel() {
        if (!this.genAI) {
            throw new Error('Gemini AI not properly configured. Please check GEMINI_API_KEY.');
        }
        
        if (!this.model) {
            this.model = this.genAI.getGenerativeModel({ 
                model: "gemini-pro",
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            });
        }
        return this.model;
    }

    async analyzeSymptoms(symptomsSummary, userAge, userGender) {
        try {
            await this.initializeModel();
            
            const prompt = `
As a medical AI assistant, analyze the following patient symptoms and provide a health assessment. 
Please provide a structured response with the following information:

Patient Information:
- Age: ${userAge || 'Not specified'}
- Gender: ${userGender || 'Not specified'}

${symptomsSummary}

Please analyze these symptoms and provide:
1. Risk Level (low, medium, high, critical)
2. Possible Conditions (with confidence percentage and brief description)
3. Recommendations for the patient
4. Urgency Level (non-urgent, moderate, urgent, emergency)
5. Overall Confidence in analysis (0-100%)

IMPORTANT: 
- This is for informational purposes only and should not replace professional medical advice
- Always recommend consulting a healthcare professional for proper diagnosis
- Be conservative with risk assessment
- If symptoms suggest serious conditions, recommend immediate medical attention

Please format your response as JSON with the following structure:
{
  "riskLevel": "low|medium|high|critical",
  "possibleConditions": [
    {
      "name": "Condition Name",
      "confidence": 85,
      "description": "Brief description of the condition"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "urgency": "non-urgent|moderate|urgent|emergency",
  "confidence": 75,
  "disclaimer": "This analysis is for informational purposes only. Please consult with a healthcare professional for proper medical diagnosis and treatment."
}
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Try to parse JSON from the response
            let analysis;
            try {
                // Extract JSON from the response (it might have extra text)
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No valid JSON found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError);
                // Fallback response if JSON parsing fails
                analysis = {
                    riskLevel: 'medium',
                    possibleConditions: [
                        {
                            name: 'Symptom Analysis Required',
                            confidence: 50,
                            description: 'Unable to fully analyze symptoms. Please consult a healthcare professional.'
                        }
                    ],
                    recommendations: [
                        'Consult with a healthcare professional for proper evaluation',
                        'Monitor symptoms and seek medical attention if they worsen',
                        'Stay hydrated and get adequate rest'
                    ],
                    urgency: 'moderate',
                    confidence: 50,
                    disclaimer: 'This analysis is for informational purposes only. Please consult with a healthcare professional for proper medical diagnosis and treatment.'
                };
            }

            // Validate and sanitize the response
            analysis = this.validateAndSanitizeResponse(analysis);
            
            return {
                success: true,
                data: analysis,
                rawResponse: text
            };

        } catch (error) {
            console.error('Error analyzing symptoms with Gemini AI:', error);
            
            // Return a safe fallback response
            return {
                success: false,
                error: error.message,
                data: {
                    riskLevel: 'medium',
                    possibleConditions: [
                        {
                            name: 'Analysis Unavailable',
                            confidence: 0,
                            description: 'AI analysis temporarily unavailable. Please consult a healthcare professional.'
                        }
                    ],
                    recommendations: [
                        'Consult with a healthcare professional for proper symptom evaluation',
                        'Monitor symptoms closely',
                        'Seek immediate medical attention if symptoms worsen or if you feel unwell'
                    ],
                    urgency: 'moderate',
                    confidence: 0,
                    disclaimer: 'AI analysis is temporarily unavailable. Please consult with a healthcare professional for proper medical diagnosis and treatment.'
                }
            };
        }
    }

    validateAndSanitizeResponse(analysis) {
        // Ensure required fields exist with valid values
        const validRiskLevels = ['low', 'medium', 'high', 'critical'];
        const validUrgencyLevels = ['non-urgent', 'moderate', 'urgent', 'emergency'];

        return {
            riskLevel: validRiskLevels.includes(analysis.riskLevel) ? analysis.riskLevel : 'medium',
            possibleConditions: Array.isArray(analysis.possibleConditions) ? 
                analysis.possibleConditions.map(condition => ({
                    name: condition.name || 'Unknown Condition',
                    confidence: Math.min(Math.max(condition.confidence || 0, 0), 100),
                    description: condition.description || 'No description available'
                })) : [],
            recommendations: Array.isArray(analysis.recommendations) ? 
                analysis.recommendations.filter(rec => typeof rec === 'string') : 
                ['Consult with a healthcare professional'],
            urgency: validUrgencyLevels.includes(analysis.urgency) ? analysis.urgency : 'moderate',
            confidence: Math.min(Math.max(analysis.confidence || 0, 0), 100),
            disclaimer: analysis.disclaimer || 'This analysis is for informational purposes only. Please consult with a healthcare professional for proper medical diagnosis and treatment.'
        };
    }

    async generateHealthTips(symptoms) {
        try {
            await this.initializeModel();

            const prompt = `
Based on the following symptoms, provide general health tips and lifestyle recommendations that might help manage these symptoms. 
Keep the advice general, safe, and emphasize the importance of professional medical consultation.

Symptoms: ${symptoms.join(', ')}

Please provide 5-7 general health tips in JSON format:
{
  "tips": [
    "Health tip 1",
    "Health tip 2"
  ]
}
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Try to parse JSON from the response
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const tips = JSON.parse(jsonMatch[0]);
                    return {
                        success: true,
                        data: tips.tips || []
                    };
                }
            } catch (parseError) {
                console.error('Failed to parse health tips response:', parseError);
            }

            // Fallback tips
            return {
                success: true,
                data: [
                    'Stay hydrated by drinking plenty of water',
                    'Get adequate rest and sleep',
                    'Eat a balanced diet rich in nutrients',
                    'Consult with a healthcare professional for proper evaluation',
                    'Monitor your symptoms and seek medical attention if they worsen'
                ]
            };

        } catch (error) {
            console.error('Error generating health tips:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    isConfigured() {
        return this.genAI !== null;
    }
}

// Create a singleton instance
const geminiService = new GeminiAIService();

export default geminiService;