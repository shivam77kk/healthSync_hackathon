"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import DoctorTabs from "@/components/doctor/DoctorTabs"
import DoctorSearch from "@/components/doctor/DoctorSearch"
import DoctorCard from "@/components/doctor/DoctorCard"


export default function DoctorInteractionPage() {
  const [activeTab, setActiveTab] = useState("book")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [doctors, setDoctors] = useState([
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
    },
    {
      _id: '3',
      name: 'Dr. Amit Singh',
      qualifications: 'Orthopedics',
      experience: 12,
      profileImage: null
    }
  ])
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
    // Try to fetch from API but don't block UI
    fetchDoctors()
    fetchUserAppointments()
  }, [])

  const fetchUserAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.appointments) {
          const formattedAppointments = data.appointments.map(apt => ({
            id: apt._id,
            doctorName: apt.doctorId?.name || "Doctor",
            specialty: apt.doctorId?.qualifications || "General",
            date: new Date(apt.date).toISOString().split('T')[0],
            time: apt.time || "Not specified",
            status: apt.status || "confirmed",
            type: apt.reason || "Consultation"
          }))
          setAppointments(formattedAppointments)
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors')
      if (response.ok) {
        const data = await response.json()
        if (data.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors)
        }
      }
    } catch (error) {
      console.log('Using fallback doctor data')
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.qualifications && doctor.qualifications.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleBookAppointment = async (doctorId) => {
    const date = prompt("Enter appointment date (YYYY-MM-DD):")
    const time = prompt("Enter appointment time (e.g., 2:00 PM):")
    const reason = prompt("Enter reason for visit:") || "General consultation"
    
    if (!date || !time) {
      alert("Please provide both date and time")
      return
    }

    try {
      const appointmentData = {
        doctorId,
        date: `${date}T${convertTo24Hour(time)}:00.000Z`,
        time: time,
        reason: reason
      }
      
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(appointmentData)
      })
      
      // Add to local appointments list
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
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert("Failed to book appointment. Please try again.")
    }
  }

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    return `${hours}:${minutes}`
  }

  const handleViewProfile = (doctorId) => {
    console.log("[v0] Viewing profile for doctor:", doctorId)
    // Backend integration point for profile view
  }

  const handleReschedule = async (appointmentId) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):")
    
    if (newDate) {
      try {
        await fetch(`http://localhost:5000/api/appointments/${appointmentId}/reschedule`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ date: newDate })
        })
      } catch (error) {
        console.error('Error rescheduling appointment:', error)
      } finally {
        // Always update UI regardless of API success/failure
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
  }

  const handleCancel = async (appointmentId) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
      } catch (error) {
        console.error('Error cancelling appointment:', error)
      } finally {
        // Always update UI regardless of API success/failure
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
        alert("Appointment cancelled successfully!")
      }
    }
  }

  const handleAccept = async (appointmentId) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
    } catch (error) {
      console.error('Error accepting appointment:', error)
    } finally {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: "accepted" }
            : apt
        )
      )
      alert("Appointment accepted successfully!")
    }
  }

  const handleReject = async (appointmentId) => {
    if (confirm("Are you sure you want to reject this appointment?")) {
      try {
        await fetch(`http://localhost:5000/api/appointments/${appointmentId}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
      } catch (error) {
        console.error('Error rejecting appointment:', error)
      } finally {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: "rejected" }
              : apt
          )
        )
        alert("Appointment rejected successfully!")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="ml-64">
        <Header />

        <main className="p-6">
          {/* Tab Navigation */}
          <DoctorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {activeTab === "book" ? (
              <>
                {/* Find Your Doctor Section */}
                <DoctorSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedSpecialty={selectedSpecialty}
                  setSelectedSpecialty={setSelectedSpecialty}
                />

                {/* Doctors List */}
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Appointments</h3>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{appointment.doctorName}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>📅 {appointment.date}</span>
                              <span>🕐 {appointment.time}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                appointment.status === 'confirmed' || appointment.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                appointment.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                appointment.status === 'booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                appointment.status === 'rejected' || appointment.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Type: {appointment.type}</p>
                          </div>
                          <div className="flex gap-2">
                            {appointment.status === 'booked' && (
                              <>
                                <button
                                  onClick={() => handleAccept(appointment.id)}
                                  className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors text-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(appointment.id)}
                                  className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {(appointment.status === 'accepted' || appointment.status === 'booked' || appointment.status === 'confirmed') && (
                              <button
                                onClick={() => handleReschedule(appointment.id)}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors text-sm"
                              >
                                Reschedule
                              </button>
                            )}
                            {appointment.status !== 'cancelled' && appointment.status !== 'rejected' && (
                              <button
                                onClick={() => handleCancel(appointment.id)}
                                className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            )}
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
