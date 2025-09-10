"use client"

import { Calendar, Video } from "lucide-react"
import Card, { CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"

export default function UpcomingAppointments() {
  const appointments = [
    { doctor: "Dr.Johnson", time: "Tomorrow, 2:00 PM", type: "Cardiology Follow-up" },
    { doctor: "Dr.Johnson", time: "Tomorrow, 2:00 PM", type: "Cardiology Follow-up" },
  ]

  return (
    <Card className="border-0 shadow-lg shadow-purple-100/50 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/70">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-purple-50 rounded-xl transform transition-all duration-300 hover:bg-purple-100 hover:scale-105"
            >
              <div>
                <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                <p className="text-sm text-gray-600">{appointment.time}</p>
                <p className="text-sm text-gray-500">{appointment.type}</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200 transform transition-all duration-300 hover:scale-110">
                <Video className="w-4 h-4 mr-2" />
                Join Video Call
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
