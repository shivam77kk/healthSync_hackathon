"use client"

import { useState } from "react"
import AppointmentCard from "./AppointmentCard"

export default function AppointmentsGrid({ searchTerm, statusFilter }) {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Sam Doe",
      age: 34,
      gender: "Male",
      date: "2025-01-15",
      time: "10:30 AM",
      type: "Consultation",
      reason: "Chest pain and shortness of breath",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Yash Chavan",
      age: 28,
      gender: "Male",
      date: "2025-01-15",
      time: "2:00 PM",
      type: "Follow-up",
      reason: "Post-surgery checkup",
      status: "Accepted",
    },
    {
      id: 3,
      patientName: "Asmi Patil",
      age: 45,
      gender: "Female",
      date: "2025-01-16",
      time: "9:00 AM",
      type: "Checkup",
      reason: "Regular health screening",
      status: "Pending",
    },
    {
      id: 4,
      patientName: "Yash Bhosale",
      age: 52,
      gender: "Male",
      date: "2025-01-16",
      time: "11:15 AM",
      type: "Consultation",
      reason: "Heart palpitations and dizziness",
      status: "Rejected",
    },
    {
      id: 5,
      patientName: "Saksham Nikam",
      age: 38,
      gender: "Male",
      date: "2025-01-17",
      time: "3:30 PM",
      type: "Follow-up",
      reason: "Diabetes management review",
      status: "Accepted",
    },
    {
      id: 6,
      patientName: "Sanika Jagde",
      age: 29,
      gender: "Female",
      date: "2025-01-18",
      time: "1:00 PM",
      type: "Consultation",
      reason: "Persistent headaches",
      status: "Pending",
    },
  ])

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date.includes(searchTerm) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = statusFilter === "All" || appointment.status === statusFilter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment, index) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onStatusChange={handleStatusChange}
            animationDelay={index * 100}
          />
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No appointments found</div>
          <div className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  )
}
