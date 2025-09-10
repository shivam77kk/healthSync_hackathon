"use client"

import { Settings, LogOut, BarChart3, Stethoscope, Calendar, Globe } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/" },
  { id: "doctor", label: "Doctor Interaction", icon: Stethoscope, href: "/doctor" },
  { id: "reports", label: "Reports & Records", icon: BarChart3, href: "/reports" },
  { id: "news", label: "Global News", icon: Globe, href: "/news" },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("userRole")
    window.location.reload()
  }

  const handleNavigation = (href) => {
    router.push(href)
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-blue-100 dark:border-gray-700 transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-3">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800 dark:text-white">HealthSync</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered HealthCare</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-4">Navigation</h3>

          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`p-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                    : "hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:scale-110"
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-8 left-6 right-6 space-y-2">
          <div 
            onClick={() => router.push('/settings')}
            className="p-3 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 group-hover:rotate-90 transition-all duration-300" />
              <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">Settings</span>
            </div>
          </div>

          <div
            onClick={handleLogout}
            className="p-3 rounded-lg transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400 dark:text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" />
              <span className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
