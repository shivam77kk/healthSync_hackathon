"use client"

import { useState, useEffect } from "react"
import { Globe, Calendar, ExternalLink, Search, Filter } from "lucide-react"
import Sidebar from "../../components/doctor-dashboard/Sidebar"
import Header from "../../components/doctor-dashboard/Header"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function NewsPage() {
  const [activeNav, setActiveNav] = useState("news")
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
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
        `https://newsapi.org/v2/everything?q=${searchTerm}&language=en&sortBy=publishedAt&pageSize=20&apiKey=f3a5b07c4521426d97ee8e8e2dbc61f3`
      )
      
      if (response.ok) {
        const data = await response.json()
        setNews(data.articles || [])
      } else {
        console.error("Failed to fetch news")
        setNews([])
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(searchQuery, category)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              Health News
            </h1>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search health news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
              

            </CardContent>
          </Card>

          {/* News Articles */}
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading health news...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No news articles found</p>
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
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
          </main>
        </div>
      </div>
    </div>
  )
}