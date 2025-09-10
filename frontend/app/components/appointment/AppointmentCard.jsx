"use client"

export default function AppointmentCard({ appointment, onStatusChange, animationDelay = 0 }) {
  const { id, patientName, age, gender, date, time, type, reason, status } = appointment

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Consultation":
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )
      case "Follow-up":
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        )
      case "Checkup":
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 border-0 hover:shadow-xl hover:shadow-purple-200/70 transform transition-all duration-300 hover:scale-[1.02] animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Patient Info Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{patientName}</h3>
          <p className="text-gray-600 text-sm">
            {age} years • {gender}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-700 text-sm">
            {new Date(date).toLocaleDateString()} at {time}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {getTypeIcon(type)}
          <span className="text-gray-700 text-sm font-medium">{type}</span>
        </div>

        <div className="flex items-start gap-3">
          <svg className="h-4 w-4 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-gray-600 text-sm leading-relaxed">{reason}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {status === "Pending" ? (
          <>
            <button
              onClick={() => onStatusChange(id, "Accepted")}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium shadow-lg shadow-green-200/50"
            >
              Accept
            </button>
            <button
              onClick={() => onStatusChange(id, "Rejected")}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-200/50"
            >
              Reject
            </button>
          </>
        ) : status === "Accepted" ? (
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-200/50">
            View Details
          </button>
        ) : (
          <div className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-lg text-center text-sm">
            No actions available
          </div>
        )}
      </div>

      {/* Notes Section (placeholder) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200">
          + Add Notes
        </button>
      </div>
    </div>
  )
}
