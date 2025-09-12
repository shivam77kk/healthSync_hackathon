"use client"
import { Settings, LogOut, BarChart3, FileText, Clock, Newspaper } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Sidebar({ activeNav, setActiveNav }) {
  const router = useRouter()
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 min-h-screen transition-all duration-300 hover:bg-white/90">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <div className="w-6 h-6 bg-white rounded-md"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-700">
              HealthSync
            </h1>
            <p className="text-sm text-gray-500">AI-Powered HealthCare</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Navigation</p>

          <button
            onClick={() => {
              setActiveNav && setActiveNav("dashboard")
              router.push("/pages/doctor-dashboard")
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              activeNav === "dashboard"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveNav && setActiveNav("reports")
              router.push("/pages/doctor-dashboard")
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              activeNav === "reports"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Medical Reports</span>
          </button>

          <button
            onClick={() => {
              setActiveNav && setActiveNav("appointments")
              router.push("/pages/appointments")
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              activeNav === "appointments"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">Appointments</span>
          </button>



          <button
            onClick={() => {
              setActiveNav && setActiveNav("news")
              router.push("/pages/news")
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              activeNav === "news"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="font-medium">Health News</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 transform hover:scale-105">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          <button 
            onClick={() => window.location.href = "/login"}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
