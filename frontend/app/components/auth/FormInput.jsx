"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function FormInput({ type, placeholder, value, onChange, required = false, icon: Icon }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400`}
        placeholder={placeholder}
        required={required}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  )
}
