

export const getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json({
            message: "Response generated successfully",
            response: data.choices[0].message.content
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ 
            message: "I'm here to help with your health questions!",
            response: "I'm here to help with your health questions! Ask me about symptoms, medications, diet, exercise, sleep, or stress management."
        });
    }
};
