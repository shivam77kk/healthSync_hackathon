"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MedicalHeroSection from "../../../components/auth/MedicalHeroSection"
import SignupForm from "../../../components/auth/SignupForm"
import ThemeToggle from "../../../components/ThemeToggle"

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("isAuthenticated")
      if (isAuth === "true") {
        router.push("/")
      }
    }
  }, [router])

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
              <SignupForm />

              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}