import { Calendar } from "lucide-react"
import Card,{ CardContent } from "@/components/ui/card"

export default function WelcomeBanner({ userData }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <Card className="col-span-8 bg-gradient-to-r from-blue-400 to-blue-600 border-0 text-white overflow-hidden group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="bg-blue-800/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm w-fit flex items-center gap-2 transition-all duration-300 group-hover:bg-blue-800/60 text-white font-medium">
              <Calendar className="w-4 h-4 text-white" />
              {currentDate}
            </div>
            <h2 className="text-2xl font-bold transition-all duration-300 group-hover:scale-105 text-white">
              Good Day, {userData.name}!
            </h2>
            <p className="text-white/90 transition-all duration-300 group-hover:text-white font-medium">
              {userData.greeting}
            </p>
          </div>
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?w=2000"
              alt="Doctor illustration"
              className="w-32 h-32 object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/387/387561.png"
              }}
            />
            <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-2xl animate-pulse group-hover:bg-blue-200/30"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
