import fetch from 'node-fetch';

export const getHealthNews = async (req, res) => {
    try {

        const apiKey = process.env.NEWS_API_KEY; 
        const url = `https://api.example.com/health?apiKey=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching news: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json({
            message: "Health news retrieved successfully",
            news: data.articles || []
        });

    } catch (error) {
        console.error("News API error:", error);
        res.status(500).json({ message: "Failed to retrieve health news", error: error.message });
    }
};
