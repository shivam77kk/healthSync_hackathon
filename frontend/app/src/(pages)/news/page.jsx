"use client"

import { useState, useEffect } from "react"
import { Globe, Calendar, ExternalLink, Search } from "lucide-react"
import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

export default function NewsPage() {
  const [news, setNews] = useState([
    {
      title: "New Breakthrough in Heart Disease Treatment",
      description: "Researchers have discovered a new treatment method that could revolutionize heart disease care.",
      url: "#",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "Health News" }
    },
    {
      title: "Benefits of Regular Exercise for Mental Health",
      description: "Studies show that regular physical activity can significantly improve mental well-being and reduce anxiety.",
      url: "#",
      urlToImage: null,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      source: { name: "Wellness Today" }
    },
    {
      title: "Nutrition Guidelines Updated for 2024",
      description: "Health authorities release new dietary recommendations focusing on plant-based nutrition.",
      url: "#",
      urlToImage: null,
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      source: { name: "Nutrition Weekly" }
    }
  ])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("health")

  const categories = [
    { id: "health", name: "Health" },
    { id: "medical", name: "Medical" },
    { id: "fitness", name: "Fitness" },
    { id: "nutrition", name: "Nutrition" }
  ]

  const fetchNews = async (query = "health", cat = "health") => {
    setLoading(true)
    try {
      const searchTerm = query || cat
      const response = await fetch(
        `http://localhost:5000/api/news/health-news?query=${searchTerm}&category=${cat}&pageSize=20`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.articles && data.articles.length > 0) {
          setNews(data.articles)
        }
      }
    } catch (error) {
      console.log("Using fallback news data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category !== "health") {
      fetchNews(searchQuery, category)
    }
  }, [category])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNews(searchQuery, category)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="ml-64 p-6">
        <Header />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              Health News
            </h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 items-center mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search health news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category === cat.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading health news...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No news articles found</p>
              </div>
            ) : (
              news.map((article, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{article.source?.name}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(article.url, '_blank')}
                            className="flex items-center gap-2"
                          >
                            Read More
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}