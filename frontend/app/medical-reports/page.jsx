"use client"
import { useState } from "react"
import Sidebar from "../components/doctor-dashboard/Sidebar"
import Header from "../components/doctor-dashboard/Header"
import ReportsHeader from "../components/dashboard/ReportsHeader"
import ReportsGrid from "../components/dashboard/ReportsGrid"

export default function MedicalReportsPage() {
  const [activeNav, setActiveNav] = useState("reports")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-6 space-y-6">
            <ReportsHeader />
            <ReportsGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
