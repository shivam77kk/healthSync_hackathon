import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AppointmentManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem('fromLanding');
    router.push('/landing');
  };

  const appointments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      type: 'Check-up',
      time: '9:00 AM (30 min)',
      phone: '+1 (555) 123-4567',
      room: 'Room 205',
      priority: 'Normal Priority',
      reason: 'Routine blood pressure check',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Emma Davis',
      age: 28,
      type: 'Consultation',
      time: '2:00 PM (30 min)',
      phone: '+1 (555) 345-6789',
      room: 'Room 201',
      priority: 'Urgent Priority',
      reason: 'Chest pain evaluation',
      status: 'pending'
    }
  ];

  const handleAccept = (id) => {
    console.log('Accepted appointment:', id);
  };

  const handleDecline = (id) => {
    console.log('Declined appointment:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-20 bg-blue-600 flex flex-col items-center py-6 space-y-6">
        {/* Logo */}
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-white text-xs font-semibold">HealthSync</span>

        {/* Navigation Icons */}
        <div className="flex flex-col space-y-4 mt-8">
          <button 
            onClick={() => router.push('/doctor-dashboard')}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
          <button className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 transition-all duration-200 hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button 
            onClick={() => router.push('/patient-history')}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Settings */}
        <div className="mt-auto">
          <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-blue-100 rounded-full py-2 px-4 hover:bg-blue-200 transition-all duration-200 hover:scale-105">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="font-semibold text-gray-800">Sam Cha</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Management</h1>
              <p className="text-gray-600">Manage patient appointments and schedules</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                className={`bg-yellow-50 border border-yellow-200 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'pending' ? 'transform scale-105 shadow-xl' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('pending')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-800">3</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div 
                className={`bg-green-50 border border-green-200 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'confirmed' ? 'transform scale-105 shadow-xl' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('confirmed')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Confirmed</p>
                    <p className="text-3xl font-bold text-green-800">1</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div 
                className={`bg-blue-50 border border-blue-200 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'today' ? 'transform scale-105 shadow-xl' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('today')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Today</p>
                    <p className="text-3xl font-bold text-blue-800">4</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div 
                className={`bg-red-50 border border-red-200 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'urgent' ? 'transform scale-105 shadow-xl' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('urgent')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Urgent</p>
                    <p className="text-3xl font-bold text-red-800">1</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                    activeTab === 'pending'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Pending Requests (3)
                </button>
                <button
                  onClick={() => setActiveTab('confirmed')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                    activeTab === 'confirmed'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Confirmed (1)
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  All Appointments (4)
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-6">
              {appointments.map((appointment, index) => (
                <div 
                  key={appointment.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer ${
                    hoveredAppointment === index ? 'transform scale-102 shadow-xl border-2 border-blue-200' : 'border border-gray-200'
                  }`}
                  onMouseEnter={() => setHoveredAppointment(index)}
                  onMouseLeave={() => setHoveredAppointment(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{appointment.name}</h3>
                            <p className="text-gray-600">Age {appointment.age} • {appointment.type}</p>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            pending
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{appointment.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{appointment.room}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <svg className={`w-5 h-5 ${appointment.priority === 'Urgent Priority' ? 'text-red-500' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className={appointment.priority === 'Urgent Priority' ? 'text-red-600 font-medium' : 'text-orange-600'}>
                                {appointment.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-gray-700">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        </div>

                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleAccept(appointment.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDecline(appointment.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}