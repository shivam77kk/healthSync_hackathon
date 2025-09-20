 import HealthLog from '../models/HealthTrackerSchema.js';
 import User from '../models/userSchema.js';
 import fetch from 'node-fetch';


 export const getSpecialistSuggestion = async (req, res) => {
     try {
         const userId = req.user.id;
         const { latestSymptoms, latestVitals } = req.body;

         if (!latestSymptoms && !latestVitals) {
             return res.status(400).json({ message: "Symptoms or vitals are required for analysis." });
         }

         const user = await User.findById(userId);

         const aiPrompt = `
         You are a highly skilled medical AI assistant. Analyze the following patient symptoms and vitals to suggest the most appropriate medical specialist. Provide a brief, one-sentence reason for your suggestion. Do not provide a diagnosis or medical advice.

         Patient Data:
         - Symptoms: ${latestSymptoms ? latestSymptoms.join(', ') : 'None provided'}
         - Vitals: ${JSON.stringify(latestVitals)}
         - Age: ${user.age}
         - Gender: ${user.gender}
         - Blood Group: ${user.bloodGroup}

         Based on this data, which medical specialist should the patient consult?
        `;

         // Check if AI API key is configured
         if (!process.env.AI_API_KEY) {
             // Return a fallback suggestion based on symptoms
             const fallbackSuggestion = generateFallbackSuggestion(latestSymptoms, latestVitals, user);
             return res.status(200).json({
                 message: "Specialist suggestion generated successfully (fallback mode).",
                 suggestion: fallbackSuggestion,
                 note: "AI API not configured. This is a basic suggestion based on symptoms."
             });
         }

         const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${process.env.AI_API_KEY}`
             },
             body: JSON.stringify({
                 model: "gpt-3.5-turbo",
                 messages: [
                     {
                         role: "system",
                         content: "You are a medical AI assistant. Suggest the most appropriate medical specialist based on symptoms and vitals. Provide only the specialist type and a brief reason."
                     },
                     {
                         role: "user",
                         content: aiPrompt
                     }
                 ],
                 max_tokens: 150,
                 temperature: 0.3
             })
         });
        
         if (!aiResponse.ok) {
             throw new Error(`AI API error: ${aiResponse.statusText}`);
         }

         const data = await aiResponse.json();

         res.status(200).json({
             message: "Specialist suggestion generated successfully.",
             suggestion: data.choices[0].message.content.trim()
        });

     } catch (error) {
         console.error("AI Triage error:", error);
         // Provide fallback suggestion on error
         const fallbackSuggestion = generateFallbackSuggestion(latestSymptoms, latestVitals, user);
         res.status(200).json({
             message: "Specialist suggestion generated successfully (fallback mode).",
             suggestion: fallbackSuggestion,
             note: "AI service temporarily unavailable. This is a basic suggestion based on symptoms."
         });
     }
 };

 // Fallback function to generate basic specialist suggestions
 function generateFallbackSuggestion(symptoms, vitals, user) {
     if (!symptoms || symptoms.length === 0) {
         return "General Practitioner - No specific symptoms provided for analysis.";
     }

     const symptomText = symptoms.join(', ').toLowerCase();
     
     // Basic symptom-to-specialist mapping
     if (symptomText.includes('heart') || symptomText.includes('chest') || symptomText.includes('cardiac')) {
         return "Cardiologist - Heart or chest-related symptoms detected.";
     }
     if (symptomText.includes('head') || symptomText.includes('brain') || symptomText.includes('neurological')) {
         return "Neurologist - Neurological symptoms detected.";
     }
     if (symptomText.includes('skin') || symptomText.includes('rash') || symptomText.includes('dermatitis')) {
         return "Dermatologist - Skin-related symptoms detected.";
     }
     if (symptomText.includes('eye') || symptomText.includes('vision') || symptomText.includes('visual')) {
         return "Ophthalmologist - Eye or vision-related symptoms detected.";
     }
     if (symptomText.includes('bone') || symptomText.includes('joint') || symptomText.includes('muscle')) {
         return "Orthopedist - Musculoskeletal symptoms detected.";
     }
     if (symptomText.includes('stomach') || symptomText.includes('digestive') || symptomText.includes('gastro')) {
         return "Gastroenterologist - Digestive system symptoms detected.";
     }
     if (symptomText.includes('lung') || symptomText.includes('breathing') || symptomText.includes('respiratory')) {
         return "Pulmonologist - Respiratory symptoms detected.";
     }
     
     // Check vitals for urgent conditions
     if (vitals) {
         if (vitals.bloodPressure && vitals.bloodPressure.includes('180')) {
             return "Emergency Medicine - High blood pressure detected, immediate evaluation needed.";
         }
         if (vitals.heartRate && vitals.heartRate > 120) {
             return "Cardiologist - Elevated heart rate detected.";
         }
         if (vitals.temperature && vitals.temperature > 103) {
             return "Emergency Medicine - High fever detected, immediate evaluation needed.";
         }
     }
     
     return "General Practitioner - General symptoms detected, primary care evaluation recommended.";
 }
