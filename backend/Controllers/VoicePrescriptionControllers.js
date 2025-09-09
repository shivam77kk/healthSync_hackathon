export const processVoicePrescription = async (req, res) => {
    try {
        const { transcript, symptoms } = req.body;
        
        if (!transcript && !symptoms) {
            return res.status(400).json({ message: "Transcript or symptoms required" });
        }
        
        const text = transcript || symptoms;
        const lowerText = text.toLowerCase();
        
        let prescription = {
            date: new Date().toISOString(),
            symptoms: text,
            recommendations: [],
            warnings: "This is AI-generated guidance. Please consult a healthcare professional for proper medical advice."
        };
        
        // Generate recommendations based on symptoms
        if (lowerText.includes('headache') || lowerText.includes('head pain')) {
            prescription.recommendations = [
                "Rest in a dark, quiet room",
                "Apply cold compress to forehead",
                "Stay hydrated with water",
                "Consider over-the-counter pain relief as directed"
            ];
        } else if (lowerText.includes('fever') || lowerText.includes('temperature')) {
            prescription.recommendations = [
                "Rest and stay hydrated",
                "Monitor temperature regularly",
                "Light clothing and cool environment",
                "Consider fever reducer if temperature exceeds 101°F"
            ];
        } else if (lowerText.includes('cough') || lowerText.includes('cold')) {
            prescription.recommendations = [
                "Get plenty of rest",
                "Drink warm fluids like tea with honey",
                "Use a humidifier",
                "Avoid smoke and irritants"
            ];
        } else if (lowerText.includes('stomach') || lowerText.includes('nausea')) {
            prescription.recommendations = [
                "Try the BRAT diet (bananas, rice, applesauce, toast)",
                "Stay hydrated with small sips of water",
                "Avoid dairy and fatty foods",
                "Rest and avoid solid foods temporarily"
            ];
        } else {
            prescription.recommendations = [
                "Maintain adequate rest",
                "Stay hydrated",
                "Eat nutritious meals",
                "Monitor symptoms and seek medical attention if they worsen"
            ];
        }
        
        res.status(200).json({
            message: "Voice prescription processed successfully",
            prescription
        });
        
    } catch (error) {
        console.error('Voice prescription error:', error);
        res.status(500).json({ 
            message: "Error processing voice prescription", 
            error: error.message 
        });
    }
};

export const savePrescription = async (req, res) => {
    try {
        const { prescription, userId } = req.body;
        
        // In a real app, you would save to database
        // For now, just return success
        
        res.status(201).json({
            message: "Prescription saved successfully",
            prescriptionId: Date.now().toString()
        });
        
    } catch (error) {
        console.error('Save prescription error:', error);
        res.status(500).json({ 
            message: "Error saving prescription", 
            error: error.message 
        });
    }
};