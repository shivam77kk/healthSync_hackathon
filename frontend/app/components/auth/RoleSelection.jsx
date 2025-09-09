"use client"

import { useState } from "react"
import { User, Stethoscope, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

export default function RoleSelection({ onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState("")

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setTimeout(() => {
      onRoleSelect(role)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to HealthSync</h1>
          <p className="text-gray-600 dark:text-gray-400">Please select your role to continue</p>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => handleRoleSelect("patient")}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === "patient"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">I'm a Patient</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access health dashboard and book appointments</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div
            onClick={() => handleRoleSelect("doctor")}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === "doctor"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">I'm a Doctor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage patients and appointments</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}