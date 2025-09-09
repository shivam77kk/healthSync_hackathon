"use client"

import { Star, Clock, DollarSign, Globe } from "lucide-react"

export default function DoctorCard({ doctor, onBookAppointment, onViewProfile }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
      <div className="flex items-start gap-6">
        {/* Doctor Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
            <img src="/doctor-profile.png" alt={doctor.name} className="w-full h-full object-cover" />
          </div>
          {doctor.isAvailable && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
              <p className="text-blue-500 font-semibold text-lg">{doctor.specialty}</p>
              <p className="text-gray-500">{doctor.hospital}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold text-gray-800">{doctor.rating}</span>
              </div>
              <p className="text-gray-500 text-sm">{doctor.experience}</p>
            </div>
          </div>

          {/* Availability Status */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600">Availability</span>
              <span className="text-sm font-semibold text-green-600">{doctor.availability}</span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Wait Time</p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">{doctor.waitTime}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Consultation</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">{doctor.consultationFee}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Languages</p>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">{doctor.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onBookAppointment(doctor.id)}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Book Appointment
            </button>
            <button
              onClick={() => onViewProfile(doctor.id)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
