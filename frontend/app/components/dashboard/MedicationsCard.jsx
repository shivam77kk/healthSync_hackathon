import { Pill, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function MedicationsCard({ medicationsData }) {
  return (
    <Card className="col-span-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-500 group-hover:animate-bounce" />
          Today's Medications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {medicationsData && Array.isArray(medicationsData) ? medicationsData.map((medication, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group/med cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white group-hover/med:text-blue-600 dark:group-hover/med:text-blue-400 transition-colors duration-300">
                    {medication.name}
                  </h4>
                  {medication.isUrgent && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {medication.dosage} • {medication.frequency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{medication.instructions}</p>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    Next dose: {medication.nextDose}
                  </span>
                  <span className={`${medication.pillsLeft <= 5 ? "text-red-600 font-medium" : ""}`}>
                    Pills left: {medication.pillsLeft}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover/med:text-blue-500 dark:group-hover/med:text-blue-400 transition-colors duration-300" />
                {medication.taken && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              </div>
            </div>
          </div>
        )) : <div className="text-gray-500 dark:text-gray-400 text-sm">No medications data available</div>}
      </CardContent>
    </Card>
  )
}
