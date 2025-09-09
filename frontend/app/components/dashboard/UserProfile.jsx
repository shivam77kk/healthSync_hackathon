"use client"

import { useState, useRef } from "react"
import { User, Settings, LogOut, Camera } from "lucide-react"
import { userAPI } from "@/services/api"

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : { name: 'User', email: 'user@example.com' }
    }
    return { name: 'User', email: 'user@example.com' }
  })
  const fileInputRef = useRef(null)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profileImage', file)

    try {
      const response = await userAPI.uploadProfileImage(formData)
      setUser(prev => ({ ...prev, profileImage: response.profileImage }))
      localStorage.setItem('user', JSON.stringify({ ...user, profileImage: response.profileImage }))
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await userAPI.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center overflow-hidden">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button 
              onClick={() => window.location.href = '/settings'}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}