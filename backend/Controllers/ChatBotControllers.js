import fetch from 'node-fetch';

export const getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const aiApiResponse = await fetch('https://api.example.com/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AI_API_KEY}`
            },
            body: JSON.stringify({ prompt: `Provide a helpful response to this health-related question: ${message}` })
        });

        if (!aiApiResponse.ok) {
            throw new Error(`AI API error: ${aiApiResponse.statusText}`);
        }

        const data = await aiApiResponse.json();
        res.status(200).json({
            message: "Response generated successfully",
            response: data.text 
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ message: "Failed to get chatbot response", error: error.message });
    }
};
