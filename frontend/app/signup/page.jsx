"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      window.location.href = "/"
    }, 2000)
  }

  const handleGoogleSignup = () => {
    // Handle Google signup
    console.log("Google signup clicked")
  }

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
    </svg>
  )

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-50 to-pink-50 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 text-red-400 text-2xl animate-pulse">+</div>
        <div className="absolute top-32 right-32 text-blue-400 text-xl animate-bounce">+</div>
        <div className="absolute bottom-32 left-16 text-yellow-400 text-lg animate-pulse">+</div>
        <div className="absolute top-40 left-1/3 text-red-400 text-xl animate-bounce">+</div>
        <div className="absolute bottom-20 right-20 text-blue-400 text-2xl animate-pulse">+</div>
        <div className="absolute top-1/3 right-16 text-yellow-400 text-lg animate-bounce">+</div>

        {/* Main illustration container */}
        <div className="relative z-10 animate-fade-in-up">
          {/* Clipboard */}
          <div className="relative">
            <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-2xl">
              {/* Clipboard base */}
              <rect x="50" y="60" width="200" height="280" rx="15" fill="white" stroke="#4F46E5" strokeWidth="3" />

              {/* Clipboard clip */}
              <rect x="120" y="30" width="60" height="40" rx="20" fill="#4F46E5" />
              <circle cx="150" cy="45" r="8" fill="white" />

              {/* Medical cross */}
              <circle cx="100" cy="120" r="25" fill="#EF4444" />
              <rect x="92" y="105" width="16" height="30" fill="white" />
              <rect x="85" y="112" width="30" height="16" fill="white" />

              {/* Document lines */}
              <rect x="130" y="110" width="80" height="4" rx="2" fill="#E5E7EB" />
              <rect x="130" y="125" width="60" height="4" rx="2" fill="#E5E7EB" />
              <rect x="130" y="140" width="70" height="4" rx="2" fill="#E5E7EB" />

              {/* Checkboxes */}
              <rect x="70" y="180" width="20" height="20" rx="4" fill="#8B5CF6" />
              <path d="M75 188 L82 195 L95 182" stroke="white" strokeWidth="2" fill="none" />
              <rect x="100" y="185" width="60" height="4" rx="2" fill="#E5E7EB" />

              <rect x="70" y="220" width="20" height="20" rx="4" fill="#8B5CF6" />
              <path d="M75 228 L82 235 L95 222" stroke="white" strokeWidth="2" fill="none" />
              <rect x="100" y="225" width="80" height="4" rx="2" fill="#E5E7EB" />

              {/* More document lines */}
              <rect x="70" y="270" width="120" height="4" rx="2" fill="#E5E7EB" />
              <rect x="70" y="285" width="100" height="4" rx="2" fill="#E5E7EB" />
              <rect x="70" y="300" width="90" height="4" rx="2" fill="#E5E7EB" />
            </svg>

            {/* Stethoscope */}
            <svg width="120" height="200" viewBox="0 0 120 200" className="absolute -right-8 top-32 animate-float">
              <path
                d="M20 50 Q30 40 40 50 Q50 60 60 50 Q70 40 80 50 L80 120 Q80 140 70 150 Q60 160 50 150 Q40 140 40 120 L40 100"
                stroke="#4F46E5"
                strokeWidth="4"
                fill="none"
              />
              <circle cx="20" cy="50" r="12" fill="#4F46E5" />
              <circle cx="80" cy="50" r="12" fill="#4F46E5" />
              <circle cx="50" cy="150" r="20" fill="#FCD34D" />
              <circle cx="50" cy="150" r="12" fill="#F59E0B" />
            </svg>

            {/* Medicine bottles */}
            <div className="absolute -left-16 bottom-0 space-y-4">
              <div className="w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg relative animate-bounce-slow">
                <div className="w-8 h-4 bg-blue-600 rounded-t-lg mx-auto"></div>
                <div className="absolute bottom-2 left-2 w-3 h-8 bg-yellow-400 rounded"></div>
                <div className="absolute bottom-2 right-2 w-3 h-6 bg-yellow-400 rounded"></div>
              </div>
              <div
                className="w-12 h-16 bg-gradient-to-b from-teal-400 to-teal-500 rounded-lg relative animate-bounce-slow"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="w-6 h-3 bg-teal-600 rounded-t-lg mx-auto"></div>
                <div className="absolute bottom-1 left-1 w-2 h-6 bg-white rounded"></div>
                <div className="absolute bottom-1 right-1 w-2 h-4 bg-white rounded"></div>
              </div>
            </div>

            {/* Pen */}
            <svg
              width="80"
              height="20"
              viewBox="0 0 80 20"
              className="absolute bottom-8 left-8 rotate-12 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <rect x="0" y="8" width="60" height="4" fill="#FCD34D" />
              <rect x="55" y="6" width="20" height="8" fill="#F59E0B" />
              <rect x="70" y="7" width="8" height="6" fill="#92400E" />
              <circle cx="5" cy="10" r="3" fill="#EF4444" />
            </svg>

            {/* Decorative leaves */}
            <svg width="60" height="80" viewBox="0 0 60 80" className="absolute -top-4 -left-8 animate-sway">
              <path
                d="M10 70 Q20 50 30 70 Q40 50 50 70 Q45 40 40 20 Q35 10 30 20 Q25 10 20 20 Q15 40 10 70"
                fill="#10B981"
                opacity="0.7"
              />
            </svg>

            <svg
              width="40"
              height="60"
              viewBox="0 0 40 60"
              className="absolute top-8 right-4 animate-sway"
              style={{ animationDelay: "1.5s" }}
            >
              <path
                d="M5 50 Q15 35 25 50 Q30 35 35 50 Q32 25 28 10 Q25 5 22 10 Q20 5 18 10 Q14 25 5 50"
                fill="#06B6D4"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 h-14"
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
                  fill="#FBBC04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                required
              />

              <Input
                type="email"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Passwords.."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-14"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {"Already have an account? "}
              <a
                href="#"
                className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-all duration-300"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
