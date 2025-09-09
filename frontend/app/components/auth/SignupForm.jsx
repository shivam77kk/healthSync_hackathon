"use client"

import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { userAPI } from "@/services/api"

export default function SignupForm({ role, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    bloodGroup: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ 
        name: "Google User", 
        email: "user@gmail.com", 
        role: role,
        profileImage: "https://via.placeholder.com/40"
      }))
      onSuccess?.()
      setIsLoading(false)
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.name.trim()) {
      setError("Please enter your full name")
      setIsLoading(false)
      return
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Simulate registration for demo
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          role: role,
          age: formData.age,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup
        }))
        onSuccess?.()
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError("Registration failed. Please try again.")
      onError?.("Registration failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create a Account</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 !bg-white dark:!bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 rounded-xl py-4 px-6 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:!bg-gray-100 dark:disabled:!bg-gray-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="!text-gray-700 dark:!text-gray-200 font-medium">Sign in with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="email"
                placeholder="Email..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
              required
            />

            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white bg-white dark:bg-gray-700"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-white bg-white dark:bg-gray-700"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:!bg-gray-500 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="!text-white">Creating Account...</span>
                </div>
              ) : (
                <span className="!text-white">Create Account</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
