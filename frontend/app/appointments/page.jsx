"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import { Search, Mic } from "lucide-react"
import { appointmentAPI } from "@/services/api"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("appointments")
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getUserAppointments()
      setAppointments(response.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (id) => {
    try {
      await appointmentAPI.cancelAppointment(id)
      fetchAppointments()
    } catch (error) {
      console.error('Error canceling appointment:', error)
      alert('Failed to cancel appointment. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "booked": return "text-green-600 bg-green-50"
      case "completed": return "text-orange-600 bg-orange-50" 
      case "rescheduled": return "text-blue-600 bg-blue-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="ml-64">
        <Header />
        
        <main className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "appointments"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "book"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Book an Appointment
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-sm rounded-full text-green-600 bg-green-50">Booked</span>
                  <span className="px-3 py-1 text-sm rounded-full text-orange-600 bg-orange-50">Completed</span>
                  <span className="px-3 py-1 text-sm rounded-full text-blue-600 bg-blue-50">Rescheduled</span>
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No appointments found</div>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment._id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {appointment.doctorId?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{appointment.doctorId?.name || 'Doctor Name'}</h3>
                            <p className="text-blue-600 text-sm">{appointment.doctorId?.qualifications || 'Specialty'}</p>
                            <p className="text-gray-500 text-sm">Hospital</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{new Date(appointment.date).toLocaleDateString()}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3">{appointment.reason || 'No notes available'}</p>
                      <div className="flex gap-2 mt-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="col-span-4 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <div className="bg-blue-500 text-white p-4 rounded-xl mb-4">
                  <h3 className="font-semibold">December 2015</h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="p-2 font-medium text-gray-500">{day}</div>
                  ))}
                  {Array.from({length: 31}, (_, i) => i + 1).map(date => (
                    <div key={date} className={`p-2 rounded-full cursor-pointer hover:bg-blue-50 ${
                      [2, 5, 10, 17, 21, 29].includes(date) ? 'bg-blue-500 text-white' : 'text-gray-700'
                    }`}>
                      {date}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <h3 className="font-bold text-xl text-gray-800 mb-4">AI Health Assistant</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-center text-gray-600 mb-6">Tap to Speak</p>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Quick Commands</h4>
                  <div className="space-y-2">
                    {[
                      "When is my Next Appointment?",
                      "When is my Next Appointment?", 
                      "When is my Next Appointment?"
                    ].map((command, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {command}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}