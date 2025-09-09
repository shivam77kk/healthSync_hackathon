"use client"
import { useState } from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import WelcomeBanner from "@/components/dashboard/WelcomeBanner"
import CalendarWidget from "@/components/dashboard/CalendarWidget"
import HealthScoreCard from "@/components/dashboard/HealthScoreCard"
import AppointmentCard from "@/components/dashboard/AppointmentCard"
import GoalsCard from "@/components/dashboard/GoalsCard"
import AIAssistant from "@/components/dashboard/AIAssistant"
import MedicationsCard from "@/components/dashboard/MedicationsCard"
import BookAppointmentCard from "@/components/dashboard/BookAppointmentCard"

const dashboardData = {
  user: {
    id: "user_123",
    name: "Sam",
    greeting: "Have a nice Monday!",
    avatar: "/api/users/123/avatar",
  },

  healthScore: {
    score: 100,
    status: "Excellent!",
    message: "Keep up the great work!",
    trend: "up",
    lastUpdated: "2024-01-15T10:30:00Z",
  },

  nextAppointment: {
    id: "apt_456",
    doctor: "Dr.Johnson",
    date: "Tomorrow",
    time: "2:00 PM",
    type: "Cardiology Follow-up",
    location: "Virtual",
    isVideoCall: true,
    meetingLink: "/appointments/456/join",
  },

  todaysGoals: [
    {
      id: "goal_steps",
      type: "steps",
      current: 6543,
      target: 10000,
      unit: "steps",
      percentage: 65.43,
    },
    {
      id: "goal_water",
      type: "water",
      current: 6,
      target: 8,
      unit: "glasses",
      percentage: 75,
    },
  ],

  aiAssistant: {
    isListening: false,
    isAvailable: true,
    quickCommands: ["When is my Next Appointment?", "Show me my health score breakdown?", "Record my new symptoms"],
  },

  medications: [
    {
      id: "med_1",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily with meals",
      instructions: "Take with food to reduce stomach upset",
      nextDose: "8:00 AM",
      pillsLeft: 25,
      isUrgent: false,
      taken: false,
    },
    {
      id: "med_2",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily in morning",
      instructions: "Take at the same time each morning",
      nextDose: "8:00 AM",
      pillsLeft: 15,
      isUrgent: true,
      taken: false,
    },
  ],

  calendar: {
    month: "December",
    year: 2015,
    days: [
      { day: "SUN", date: null },
      { day: "MON", date: null },
      { day: "TUE", date: 1, active: true, hasEvent: false },
      { day: "WED", date: 2, active: false, hasEvent: true },
      { day: "THU", date: 3, active: true, hasEvent: false },
      { day: "FRI", date: 4, active: false, hasEvent: false },
      { day: "SAT", date: 5, active: false, hasEvent: true },
      { day: "", date: 6, active: false, hasEvent: false },
      { day: "", date: 7, active: true, hasEvent: false },
      { day: "", date: 8, active: false, hasEvent: false },
      { day: "", date: 9, active: false, hasEvent: false },
      { day: "", date: 10, active: true, hasEvent: true },
      { day: "", date: 11, active: false, hasEvent: false },
      { day: "", date: 12, active: false, hasEvent: false },
      { day: "", date: 13, active: false, hasEvent: false },
      { day: "", date: 14, active: false, hasEvent: false },
      { day: "", date: 15, active: false, hasEvent: false },
      { day: "", date: 16, active: false, hasEvent: false },
      { day: "", date: 17, active: true, hasEvent: false },
      { day: "", date: 18, active: false, hasEvent: false },
      { day: "", date: 19, active: false, hasEvent: false },
      { day: "", date: 20, active: false, hasEvent: false },
      { day: "", date: 21, active: true, hasEvent: false },
      { day: "", date: 22, active: false, hasEvent: false },
      { day: "", date: 23, active: false, hasEvent: false },
      { day: "", date: 24, active: false, hasEvent: false },
      { day: "", date: 25, active: false, hasEvent: false },
      { day: "", date: 26, active: false, hasEvent: false },
      { day: "", date: 27, active: false, hasEvent: false },
      { day: "", date: 28, active: false, hasEvent: false },
      { day: "", date: 29, active: true, hasEvent: false },
      { day: "", date: 30, active: false, hasEvent: false },
      { day: "", date: 31, active: false, hasEvent: false },
    ],
  },
}

export default function HealthSyncDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    console.log("[v0] Selected date:", date.toDateString())
    // Here you could trigger API calls to fetch appointments for selected date
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />

      <div className="ml-64 p-6">
        <Header />

        <div className="grid grid-cols-12 gap-6">
          <WelcomeBanner userData={dashboardData.user} />
          <CalendarWidget
            calendarData={dashboardData.calendar}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <HealthScoreCard healthData={dashboardData.healthScore} />
          <AppointmentCard appointmentData={dashboardData.nextAppointment} />
          <GoalsCard goalsData={dashboardData.todaysGoals} />
          <AIAssistant assistantData={dashboardData.aiAssistant} />
          <MedicationsCard medicationsData={dashboardData.medications} />
          <BookAppointmentCard />
        </div>
      </div>
    </div>
  )
}
