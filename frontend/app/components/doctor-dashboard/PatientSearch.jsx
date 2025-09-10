"use client"

import { Search, User } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import Card, { CardContent } from "@/app/components/ui/card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/Button"

export default function PatientSearch() {
  const patients = [
    { id: "A123C", name: "Rajesh Kumar", age: 67, gender: "Male", status: "Stable" },
    { id: "A123C", name: "Rajesh Kumar", age: 67, gender: "Male", status: "Stable" },
    { id: "A123C", name: "Rajesh Kumar", age: 67, gender: "Male", status: "Stable" },
  ]

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Search Patient</h3>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search Appointment..."
          className="pl-12 py-4 bg-white/80 backdrop-blur-sm border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-300 text-lg"
        />
      </div>

      {/* Patient Cards */}
      <div className="space-y-4">
        {patients.map((patient, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg shadow-purple-100/50 bg-white/80 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/70 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 transform transition-transform duration-300 hover:scale-110">
                    <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300">
                      <User className="w-6 h-6 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Current status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Patient ID: {patient.id}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Age: {patient.age}</span>
                    <span>Gender: {patient.gender}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 hover:from-purple-200 hover:to-purple-300 border-0 transition-all duration-300 transform hover:scale-105"
                variant="outline"
              >
                View full Information
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
