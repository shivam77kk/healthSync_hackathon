import { useState } from "react"
import { Search, Bell, X, Calendar, Pill, Heart } from "lucide-react"
import { Button } from "../ui/button"
import UserProfile from "./UserProfile"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
  }

  const getIcon = (type) => {
    switch(type) {
      case "appointment": return <Calendar className="w-4 h-4 text-blue-500" />
      case "medication": return <Pill className="w-4 h-4 text-green-500" />
      case "health": return <Heart className="w-4 h-4 text-red-500" />
      default: return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div></div>
      <div className="flex items-center gap-4 relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md focus:scale-105 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:animate-pulse" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </div>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(false)}
                  className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 transition-colors ${
                        notification.unread 
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" 
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800 dark:text-white text-sm">
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                  className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Mark all as read
                </Button>
              </div>
            </div>
          )}
        </div>

        <UserProfile />
        {showNotifications && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
        )}
      </div>
    </div>
  )
}
