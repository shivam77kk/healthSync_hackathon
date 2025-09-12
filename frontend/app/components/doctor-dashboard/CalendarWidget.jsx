"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function CalendarWidget() {
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <Card className="border-0 shadow-lg shadow-purple-100/50 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/70">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">November</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index} className="p-2 font-medium text-gray-500">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => (
            <button
              key={day}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200 transform hover:scale-110"
            >
              {day}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
