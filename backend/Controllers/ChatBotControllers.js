

export const getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
        if (!apiKey) {
            // Graceful fallback if no API key configured
            return res.status(200).json({
                message: "AI service not configured. Responding in fallback mode.",
                response: "I'm here to help with your health questions! While AI is not fully configured, you can ask me about general wellness, symptoms, medications, diet, exercise, sleep, or stress management. For serious concerns, please consult a healthcare professional."
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful health assistant. Provide accurate, helpful health information but always recommend consulting healthcare professionals for serious concerns."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            // Graceful fallback on API error
            return res.status(200).json({ 
                message: "AI service temporarily unavailable. Responding in fallback mode.",
                response: "I'm here to help with your health questions! Please try again later. If this is urgent, contact a healthcare professional immediately."
            });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || "I'm here to help with your health questions!";
        res.status(200).json({
            message: "Response generated successfully",
            response: content
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        // Graceful fallback on unexpected errors
        res.status(200).json({ 
            message: "AI service error. Responding in fallback mode.",
            response: "I'm here to help with your health questions! Ask me about symptoms, medications, diet, exercise, sleep, or stress management. For serious or worsening symptoms, seek professional medical help." 
        });
    }
};
