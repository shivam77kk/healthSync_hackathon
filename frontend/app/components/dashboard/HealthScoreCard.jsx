import { TrendingUp, Heart } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export default function HealthScoreCard({ healthData }) {
  const { score, status, message, trend } = healthData

  return (
    <Card className="col-span-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500 group-hover:animate-pulse" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Health Score</h3>
          <TrendingUp className="w-4 h-4 text-green-500 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              className={`transition-all duration-1000 ${
                score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"
              }`}
              style={{
                animation: "drawCircle 2s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-2xl font-bold transition-all duration-300 group-hover:scale-110 ${
                score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"
              }`}
            >
              {score}%
            </span>
          </div>
        </div>

        <p
          className={`font-semibold mb-1 ${
            score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </CardContent>
    </Card>
  )
}
