"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const authStatus = localStorage.getItem("isAuthenticated")
        const userData = localStorage.getItem("user")

        console.log("[v0] Checking auth status:", { authStatus, hasUserData: !!userData })

        if (authStatus === "true" && userData) {
          try {
            const user = JSON.parse(userData)
            console.log("[v0] User authenticated:", user.name)
            setIsAuthenticated(true)
          } catch (error) {
            console.error("[v0] Error parsing user data:", error)
            localStorage.removeItem("isAuthenticated")
            localStorage.removeItem("user")
            router.push("/login")
          }
        } else {
          console.log("[v0] User not authenticated, redirecting to login")
          router.push("/login")
        }
      }

      setIsLoading(false)
    }

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return children
}
