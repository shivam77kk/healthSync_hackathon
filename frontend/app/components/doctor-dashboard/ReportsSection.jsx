"use client"

import { BarChart3 } from "lucide-react"
import Card, { CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"

export default function ReportsSection() {
  const reports = [{ name: "Johnson Ray" }, { name: "Raj Patil" }, { name: "Jay Singh" }]

  return (
    <Card className="border-0 shadow-lg shadow-purple-100/50 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/70">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">View Full Reports</h3>
        </div>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-gray-900 font-medium">{report.name}</span>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md shadow-purple-200 transform transition-all duration-300 hover:scale-110"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
