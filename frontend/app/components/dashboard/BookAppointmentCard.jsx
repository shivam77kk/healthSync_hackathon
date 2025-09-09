import { Calendar, ChevronRight, Plus } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { useRouter } from "next/navigation"

export default function BookAppointmentCard() {
  const router = useRouter()

  const handleBookAppointment = () => {
    router.push('/doctor')
  }

  return (
    <Card 
      onClick={handleBookAppointment}
      className="col-span-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
    >
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
          <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            Book Appointment
          </h3>
        </div>

        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 group-hover:scale-110 group-hover:rotate-3 mb-4">
          <Plus className="w-8 h-8 text-blue-500 transition-transform duration-300 group-hover:rotate-90" />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          Schedule your next visit
        </p>

        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-auto mt-2 transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1" />
      </CardContent>
    </Card>
  )
}
