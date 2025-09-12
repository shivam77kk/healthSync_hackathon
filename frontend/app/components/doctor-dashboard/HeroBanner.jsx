"use client"

import { Calendar } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export default function HeroBanner() {
  return (
    <Card className="mb-8 overflow-hidden border-0 shadow-xl shadow-purple-200/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-200/70">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Calendar className="w-5 h-5" />
              <span className="text-purple-100">Aug 28,2021 2:00PM</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 animate-slide-up">Good Day, Sam!!</h2>
            <p className="text-purple-100 animate-slide-up animation-delay-200">Have a nice Monday!</p>
          </div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20">
            <div className="w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
