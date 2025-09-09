"use client"

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useState, useEffect } from "react"

export default function CalendarWidget({ calendarData, onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])

  useEffect(() => {
    try {
      generateCalendar()
    } catch (error) {
      console.error('Error generating calendar:', error)
    }
  }, [currentDate, selectedDate])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: "", isEmpty: true })
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day)
      const isToday = dateObj.toDateString() === new Date().toDateString()
      const isSelected = selectedDate && dateObj.toDateString() === selectedDate.toDateString()
      const hasAppointment = Math.random() > 0.8 // Random appointments for demo

      days.push({
        date: day,
        dateObj,
        isToday,
        isSelected,
        hasAppointment,
        isEmpty: false,
      })
    }

    setCalendarDays(days)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const handleDateClick = (day) => {
    if (day.isEmpty) return

    if (onDateSelect && typeof onDateSelect === 'function') {
      try {
        onDateSelect(day.dateObj)
      } catch (error) {
        console.error('Error in date selection:', error)
      }
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const displayMonth = monthNames[currentDate.getMonth()]
  const displayYear = currentDate.getFullYear()

  return (
    <Card className="col-span-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="pb-3">
        <div className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center justify-between group-hover:bg-blue-600 dark:group-hover:bg-blue-700 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {displayMonth} {displayYear}
          </div>
          <div className="flex gap-1">
            <ChevronLeft
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform duration-200 hover:bg-blue-400 rounded p-0.5"
              onClick={() => navigateMonth(-1)}
            />
            <ChevronRight
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform duration-200 hover:bg-blue-400 rounded p-0.5"
              onClick={() => navigateMonth(1)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-xs">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="text-center text-gray-400 dark:text-gray-500 font-medium p-1">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`text-center p-1 rounded transition-all duration-200 transform hover:scale-110 ${
                day.isEmpty ? "cursor-default" : "cursor-pointer"
              } ${
                day.isSelected
                  ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-300"
                  : day.isToday
                    ? "bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200"
                    : day.isEmpty
                      ? ""
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
              } ${day.hasAppointment && !day.isSelected ? "ring-2 ring-green-300 bg-green-50" : ""}`}
            >
              {day.date}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
