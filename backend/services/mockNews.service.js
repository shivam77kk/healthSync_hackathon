// Mock news service for testing when NEWS_API_KEY is not available
export const getMockHealthNews = () => {
    return {
        status: "ok",
        totalResults: 5,
        articles: [
            {
                source: { id: null, name: "Health News Mock" },
                author: "Dr. Smith",
                title: "10 Essential Health Tips for Better Living",
                description: "Discover the top 10 health tips that can transform your daily life and improve your overall well-being.",
                url: "https://example.com/health-tips",
                urlToImage: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400",
                publishedAt: new Date().toISOString(),
                content: "A comprehensive guide to maintaining good health through proper nutrition, exercise, and lifestyle choices..."
            },
            {
                source: { id: null, name: "Medical Times Mock" },
                author: "Dr. Johnson",
                title: "Latest Breakthrough in AI Health Diagnostics",
                description: "Artificial Intelligence is revolutionizing healthcare diagnostics with new breakthrough technologies.",
                url: "https://example.com/ai-health",
                urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                content: "New AI technologies are helping doctors diagnose diseases faster and more accurately than ever before..."
            },
            {
                source: { id: null, name: "Wellness Weekly Mock" },
                author: "Sarah Wilson",
                title: "Mental Health Awareness: Breaking the Stigma",
                description: "Understanding the importance of mental health and how to support those who need help.",
                url: "https://example.com/mental-health",
                urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                content: "Mental health is just as important as physical health, yet it often receives less attention..."
            },
            {
                source: { id: null, name: "Nutrition Today Mock" },
                author: "Dr. Martinez",
                title: "The Power of Plant-Based Nutrition",
                description: "How plant-based diets can improve your health and reduce the risk of chronic diseases.",
                url: "https://example.com/plant-based",
                urlToImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
                publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                content: "Plant-based nutrition has been linked to numerous health benefits including reduced inflammation..."
            },
            {
                source: { id: null, name: "Fitness Focus Mock" },
                author: "Coach Thompson",
                title: "Home Workouts: Staying Fit Without a Gym",
                description: "Effective home workout routines that require no equipment and can be done anywhere.",
                url: "https://example.com/home-workouts",
                urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                content: "You don't need expensive gym equipment to stay in shape. These home workouts are perfect for busy schedules..."
            }
        ]
    };
};

export default getMockHealthNews;