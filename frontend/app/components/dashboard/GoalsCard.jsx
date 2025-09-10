import { Target, Footprints, Droplets } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Progress } from "../ui/progress"


export default function GoalsCard({ goalsData }) {
  return (
    <Card className="col-span-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-500 group-hover:animate-pulse" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Today's Goals</h3>
        </div>

        <div className="space-y-4">
          {goalsData && Array.isArray(goalsData) ? goalsData.map((goal, index) => {
            const IconComponent = goal.type === "steps" ? Footprints : Droplets
            const percentage = (goal.current / goal.target) * 100

            return (
              <div key={index} className="group/goal">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/goal:text-blue-500 transition-colors duration-300" />
                    <span className="capitalize text-gray-800 dark:text-white">{goal.type}</span>
                  </div>
                  <span className="text-gray-800 dark:text-white">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2 transition-all duration-500 group-hover/goal:h-3" />
              </div>
            )
          }) : <div className="text-gray-500 dark:text-gray-400 text-sm">No goals data available</div>}
        </div>
      </CardContent>
    </Card>
  )
}
