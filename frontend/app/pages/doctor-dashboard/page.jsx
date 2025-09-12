"use client"

import { useState } from "react"
import Sidebar from "../../components/doctor-dashboard/Sidebar"
import Header from "../../components/doctor-dashboard/Header"
import HeroBanner from "../../components/doctor-dashboard/HeroBanner"
import PatientSearch from "../../components/doctor-dashboard/PatientSearch"
import CalendarWidget from "../../components/doctor-dashboard/CalendarWidget"
import UpcomingAppointments from "../../components/doctor-dashboard/UpcomingAppointments"
import ReportsSection from "../../components/doctor-dashboard/ReportsSection"
import ReportsHeader from "../../components/doctor-dashboard/ReportsHeader"
import ReportsGrid from "../../components/doctor-dashboard/ReportsGrid"

export default function DoctorDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard")

  const renderMainContent = () => {
    switch (activeNav) {
      case "reports":
        return (
          <div className="space-y-6">
            <ReportsHeader />
            <ReportsGrid />
          </div>
        )
      default:
        return (
          <>
            <HeroBanner />
            <PatientSearch />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Header />
          {renderMainContent()}
        </div>

        {/* Right Sidebar - Only show for dashboard */}
        {activeNav === "dashboard" && (
          <div className="w-80 p-6 space-y-6">
            <CalendarWidget />
            <UpcomingAppointments />
            <ReportsSection />
          </div>
        )}
      </div>
    </div>
  )
}