import fetch from 'node-fetch';

export const getHealthNews = async (req, res) => {
    try {
        const { query = 'health', page = 1, pageSize = 20 } = req.query;
        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey) {
            // Graceful fallback when API key is missing
            return res.status(200).json({
                message: "News API key not configured. Returning fallback articles.",
                news: [
                    {
                        title: "Health tips for everyday wellness",
                        description: "Simple habits to improve your daily health and wellbeing.",
                        url: "https://example.com/health-tips",
                        publishedAt: new Date().toISOString(),
                        source: { name: "HealthSync" }
                    },
                    {
                        title: "Understanding seasonal flu and prevention",
                        description: "How to protect yourself during flu season.",
                        url: "https://example.com/seasonal-flu",
                        publishedAt: new Date(Date.now() - 86400000).toISOString(),
                        source: { name: "HealthSync" }
                    }
                ]
            });
        }

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            // Graceful fallback on API error
            return res.status(200).json({
                message: "External news service temporarily unavailable. Returning fallback articles.",
                news: []
            });
        }

        const data = await response.json();
        res.status(200).json({
            message: "Health news retrieved successfully",
            news: data.articles || []
        });

    } catch (error) {
        console.error("News API error:", error);
        res.status(200).json({ 
            message: "News service error. Returning fallback articles.",
            news: []
        });
    }
};
