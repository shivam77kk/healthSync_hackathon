"use client"

import { Search, ChevronDown } from "lucide-react"

export default function DoctorSearch({ searchQuery, setSearchQuery, selectedSpecialty, setSelectedSpecialty }) {
  const specialties = ["All Specialties", "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics"]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Doctor</h2>

      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search doctors or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100"
          />
        </div>

        {/* Specialty Dropdown */}
        <div className="relative">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-100 cursor-pointer"
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
