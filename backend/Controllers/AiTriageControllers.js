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
/        `;

         const aiResponse = await fetch('https://api.example.com/ai/generate', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${process.env.AI_API_KEY}`
             },
             body: JSON.stringify({ prompt: aiPrompt })
         });
        
         if (!aiResponse.ok) {
             throw new Error(`AI API error: ${aiResponse.statusText}`);
         }

        const data = await aiResponse.json();

         res.status(200).json({
             message: "Specialist suggestion generated successfully.",
             suggestion: data.text 
        });

     } catch (error) {
         console.error("AI Triage error:", error);
         res.status(500).json({ message: "Failed to get specialist suggestion", error: error.message });
     }
 };
