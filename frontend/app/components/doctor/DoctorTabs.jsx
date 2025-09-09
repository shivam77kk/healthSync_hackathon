"use client"

export default function DoctorTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setActiveTab("appointments")}
        className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform ${
          activeTab === "appointments"
            ? "bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-102"
        }`}
      >
        Appointments
      </button>
      <button
        onClick={() => setActiveTab("book")}
        className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform ${
          activeTab === "book"
            ? "bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-102"
        }`}
      >
        Book an Appointment
      </button>
    </div>
  )
}
