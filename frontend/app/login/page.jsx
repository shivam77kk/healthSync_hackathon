"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MedicalHeroSection from "../components/auth/MedicalHeroSection"
import ThemeToggle from "../components/ThemeToggle"
import { userAPI } from "@/services/api"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("isAuthenticated")
      if (isAuth === "true") {
        router.push("/")
      }
    }
  }, [router])

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError("Please enter your password")
      setIsLoading(false)
      return
    }

    try {
      const response = await userAPI.login({
        email: formData.email,
        password: formData.password
      })
      
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("isAuthenticated", "true")
      
      router.push("/")
    } catch (err) {
      setError("Invalid email or password")
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-6xl flex items-center justify-center gap-12 lg:gap-20">
            <div className="hidden lg:block flex-1 max-w-lg">
              <MedicalHeroSection />
            </div>

            <div className="flex-1 max-w-md">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h1>
                  <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
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
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 rounded-xl py-4 px-6 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-600"
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
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Sign in with Google</span>
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
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-center">Demo: Use any email and password to login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
