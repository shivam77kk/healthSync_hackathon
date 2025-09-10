"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../../components/dashboard/Sidebar"
import Header from "../../../components/dashboard/Header"
import DoctorTabs from "../../../components/doctor/DoctorTabs"
import DoctorSearch from "../../../components/doctor/DoctorSearch"
import DoctorCard from "../../../components/doctor/DoctorCard"

export default function DoctorInteractionPage() {
  const [activeTab, setActiveTab] = useState("book")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      date: "2024-01-20",
      time: "2:00 PM",
      status: "confirmed",
      type: "Follow-up"
    },
    {
      id: 2,
      doctorName: "Dr. Priya Sharma",
      specialty: "Dermatology",
      date: "2024-01-25",
      time: "10:30 AM",
      status: "confirmed",
      type: "Consultation"
    }
  ])

  useEffect(() => {
    setDoctors([
      {
        _id: '1',
        name: 'Dr. Rajesh Kumar',
        qualifications: 'Cardiology',
        experience: 15,
        profileImage: null
      },
      {
        _id: '2', 
        name: 'Dr. Priya Sharma',
        qualifications: 'Dermatology',
        experience: 10,
        profileImage: null
      }
    ])
  }, [])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.qualifications && doctor.qualifications.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleBookAppointment = (doctorId) => {
    const date = prompt("Enter appointment date (YYYY-MM-DD):")
    const time = prompt("Enter appointment time (e.g., 2:00 PM):")
    const reason = prompt("Enter reason for visit:") || "General consultation"
    
    if (!date || !time) {
      alert("Please provide both date and time")
      return
    }

    const doctor = doctors.find(d => d._id === doctorId)
    const newAppointment = {
      id: Date.now(),
      doctorName: doctor?.name || "Doctor",
      specialty: doctor?.qualifications || "General",
      date: date,
      time: time,
      status: "confirmed",
      type: reason
    }
    
    setAppointments(prev => [...prev, newAppointment])
    alert("Appointment booked successfully!")
  }

  const handleViewProfile = (doctorId) => {
    console.log("Viewing profile for doctor:", doctorId)
  }

  const handleReschedule = (appointmentId) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):")
    
    if (newDate) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, date: newDate, status: "rescheduled" }
            : apt
        )
      )
      alert("Appointment rescheduled successfully!")
    }
  }

  const handleCancel = (appointmentId) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      alert("Appointment cancelled successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="ml-64">
        <Header />

        <main className="p-6">
          <DoctorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {activeTab === "book" ? (
              <>
                <DoctorSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedSpecialty={selectedSpecialty}
                  setSelectedSpecialty={setSelectedSpecialty}
                />

                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">Loading doctors...</div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No doctors found</div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={{
                          id: doctor._id,
                          name: doctor.name,
                          specialty: doctor.qualifications || "General Medicine",
                          hospital: "Hospital",
                          rating: 4.8,
                          experience: `${doctor.experience} years exp.`,
                          availability: "Available Now",
                          waitTime: "15 mins",
                          consultationFee: "₹800",
                          languages: ["English", "Hindi"],
                          profileImage: doctor.profileImage || "/doctor-avatar.png",
                          isAvailable: true,
                        }}
                        onBookAppointment={handleBookAppointment}
                        onViewProfile={handleViewProfile}
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">My Appointments</h3>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800">{appointment.doctorName}</h4>
                            <p className="text-gray-600">{appointment.specialty}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>📅 {appointment.date}</span>
                              <span>🕐 {appointment.time}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Type: {appointment.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReschedule(appointment.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}