import { Clock, Video, User, MapPin } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"

export default function AppointmentCard({ appointmentData }) {
  const { doctor, date, time, type, location, isVideoCall } = appointmentData

  return (
    <Card className="col-span-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500 group-hover:animate-spin transition-all duration-300" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Next Appointment</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="font-medium text-gray-800 dark:text-white">{doctor}</p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {date}, {time}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{type}</p>
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:scale-105 group/btn">
            <Video className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
            {isVideoCall ? "Join Video Call" : "View Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
