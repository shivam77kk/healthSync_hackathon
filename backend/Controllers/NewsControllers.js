import fetch from 'node-fetch';

export const getHealthNews = async (req, res) => {
    try {
        const { query = 'health', category = 'health', page = 1, pageSize = 20 } = req.query;
        
        const searchTerm = query || category;
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ message: 'News API key not configured' });
        }

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${searchTerm}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const data = await response.json();
        
        res.status(200).json({
            success: true,
            articles: data.articles || [],
            totalResults: data.totalResults || 0
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch news',
            error: error.message 
        });
    }
};