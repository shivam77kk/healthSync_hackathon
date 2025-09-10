"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MedicalHeroSection from "../../../components/auth/MedicalHeroSection"
import ThemeToggle from "../../../components/ThemeToggle"
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton"
import { userAPI } from "../services/api"

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
      
      // Pre-fill email from previous login
      const savedEmail = localStorage.getItem("lastLoginEmail")
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }))
      }
    }
  }, [router])



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
      localStorage.setItem("lastLoginEmail", formData.email)
      
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
                  <GoogleSignInButton isLoading={isLoading} />

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
