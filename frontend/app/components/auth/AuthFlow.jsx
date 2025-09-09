"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import { Button } from "../ui/button"

export default function AuthFlow({ role, onBack, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {isLogin ? "Sign In" : "Sign Up"} as {role === "doctor" ? "Doctor" : "Patient"}
            </h1>
          </div>
        </div>

        {isLogin ? (
          <LoginForm role={role} onSuccess={onAuthSuccess} />
        ) : (
          <SignupForm role={role} onSuccess={onAuthSuccess} />
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  )
}