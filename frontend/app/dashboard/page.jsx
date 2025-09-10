"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/app/components/doctor-dashboard/Sidebar"
import Header from "@/app/components/doctor-dashboard/Header"
import HeroBanner from "@/app/components/doctor-dashboard/HeroBanner"
import PatientSearch from "@/app/components/doctor-dashboard/PatientSearch"
import CalendarWidget from "@/app/components/doctor-dashboard/CalendarWidget"
import UpcomingAppointments from "@/app/components/doctor-dashboard/UpcomingAppointments"
import ReportsSection from "@/app/components/doctor-dashboard/ReportsSection"

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const router = useRouter()



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Header />

          <HeroBanner />

          <PatientSearch />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-6 space-y-6">
          <CalendarWidget />

          <UpcomingAppointments />

          <ReportsSection />
        </div>
      </div>
    </div>
  )
}