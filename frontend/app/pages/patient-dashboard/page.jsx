"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/dashboard/Sidebar"
import Header from "../../components/dashboard/Header"
import WelcomeBanner from "../../components/dashboard/WelcomeBanner"
import CalendarWidget from "../../components/dashboard/CalendarWidget"
import HealthScoreCard from "../../components/dashboard/HealthScoreCard"
import AppointmentCard from "../../components/dashboard/AppointmentCard"
import GoalsCard from "../../components/dashboard/GoalsCard"
import AIAssistant from "../../components/dashboard/AIAssistant"
import MedicationsCard from "../../components/dashboard/MedicationsCard"
import BookAppointmentCard from "../../components/dashboard/BookAppointmentCard"

import UserProfile from "../../components/dashboard/UserProfile"
import { Upload, FileText, Image, File, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

const dashboardData = {
  user: {
    id: "user_123",
    name: "Patient",
    greeting: `Have a nice ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}!`,
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
  medications: [],
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
    ],
  },
}

export default function PatientDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeView, setActiveView] = useState("dashboard")
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const router = useRouter()
  
  const medicationsData = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "8:00 AM",
      taken: true,
      color: "bg-blue-500",
      nextDose: "Tomorrow 8:00 AM",
      pillsLeft: 28
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "8:00 AM, 8:00 PM",
      taken: false,
      color: "bg-green-500",
      nextDose: "Today 8:00 PM",
      pillsLeft: 45
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "9:00 AM",
      taken: true,
      color: "bg-yellow-500",
      nextDose: "Tomorrow 9:00 AM",
      pillsLeft: 60
    },
    {
      id: 4,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      time: "7:00 AM",
      taken: false,
      color: "bg-red-500",
      nextDose: "Today 7:00 AM",
      pillsLeft: 15
    }
  ]

  const handleDateSelect = (date) => {
    if (date && typeof date === 'object' && date.toDateString) {
      setSelectedDate(date)
      console.log("Selected date:", date.toDateString())
    }
  }

  const getFileIcon = (type) => {
    if (type.includes('image')) return <Image className="w-6 h-6 text-blue-500" />
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />
    return <File className="w-6 h-6 text-gray-500" />
  }

  const handleFileUpload = (files) => {
    setIsUploading(true)
    files.forEach((file) => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type || 'unknown',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: file.type.includes('image') ? 'Imaging' : file.type.includes('pdf') ? 'Lab Reports' : 'Documents'
      }
      setTimeout(() => {
        setUploadedFiles(prev => [...prev, newFile])
        setIsUploading(false)
      }, 1000)
    })
  }

  const deleteFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
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
          </div>
        )
      case "appointments":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <AppointmentCard appointmentData={dashboardData.nextAppointment} />
            </div>
            <div className="col-span-12">
              <BookAppointmentCard />
            </div>
          </div>
        )
      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Reports & Records</h1>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const files = Array.from(e.dataTransfer.files)
                    handleFileUpload(files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-center cursor-pointer transition-all duration-300 p-8 rounded-lg border-2 border-dashed ${
                    isDragging ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    isDragging ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {isDragging ? 'Drop files here' : 'Upload Medical Documents'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: PDF, PNG, JPG, JPEG, DOC, DOCX, PPT, PPTX (Max 10MB)
                  </p>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-blue-600 mt-2">Uploading...</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="hidden"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Uploaded Documents ({uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No documents uploaded yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <h4 className="font-medium text-gray-800">{file.name}</h4>
                            <p className="text-sm text-gray-600">
                              {file.category} • {file.size} • {file.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100">
                            <Download className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteFile(file.id)}
                            className="hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      case "medications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">My Medications</h1>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Medication
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicationsData.map((med) => (
                <Card key={med.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-4 h-4 rounded-full ${med.color}`}></div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.taken ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {med.taken ? 'Taken' : 'Pending'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{med.name}</h3>
                    <p className="text-gray-600 mb-1">{med.dosage} • {med.frequency}</p>
                    <p className="text-sm text-gray-500 mb-3">Time: {med.time}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next dose:</span>
                        <span className="font-medium">{med.nextDose}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pills left:</span>
                        <span className={`font-medium ${
                          med.pillsLeft < 20 ? 'text-red-600' : 'text-gray-900'
                        }`}>{med.pillsLeft}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={med.taken ? "outline" : "default"}
                        className="flex-1"
                      >
                        {med.taken ? 'Taken' : 'Mark Taken'}
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Medication Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicationsData.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${med.color}`}></div>
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-600">{med.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.taken ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {med.taken ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
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
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="ml-64 p-6">
        <Header />
        {renderContent()}
      </div>
    </div>
  )
}