"use client"

import { Search, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/input"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      localStorage.removeItem('accessToken')
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
    }
  }
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-white/80 backdrop-blur-sm border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-300"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 transition-colors duration-300">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="hover:bg-red-50 transition-colors duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600 hover:text-red-600" />
        </Button>
        <Avatar className="cursor-pointer transform transition-transform duration-300 hover:scale-110">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
