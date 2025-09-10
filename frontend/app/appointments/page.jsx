"use client"

import { useState } from "react"
import Sidebar from "../components/doctor-dashboard/Sidebar"
import Header from "../components/doctor-dashboard/Header"
import AppointmentsHeader from "../components/appointment/AppointmentsHeader"
import AppointmentsGrid from "../components/appointment/AppointmentsGrid"

export default function AppointmentsPage() {
  const [activeNav, setActiveNav] = useState("appointments")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-6 space-y-6">
            <AppointmentsHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <AppointmentsGrid searchTerm={searchTerm} statusFilter={statusFilter} />
          </main>
        </div>
      </div>
    </div>
  )
}
