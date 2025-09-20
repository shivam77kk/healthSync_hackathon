import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PatientHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPatient, setHoveredPatient] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem('fromLanding');
    router.push('/landing');
  };

  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      bloodType: 'Blood: O+',
      lastVisit: 'Last visit: 3/15/2024',
      conditions: ['Hypertension', 'Mild asthma'],
      allergies: ['Allergies: Penicillin, Shellfish']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      bloodType: 'Blood: O+',
      lastVisit: 'Last visit: 3/15/2024',
      conditions: ['Hypertension', 'Mild asthma'],
      allergies: ['Allergies: Penicillin, Shellfish']
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      bloodType: 'Blood: O+',
      lastVisit: 'Last visit: 3/15/2024',
      conditions: ['Hypertension', 'Mild asthma'],
      allergies: ['Allergies: Penicillin, Shellfish']
    }
  ];

  const handleViewPatient = (patientId) => {
    console.log('Viewing patient:', patientId);
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
          <button 
            onClick={() => router.push('/appointment-management')}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 transition-all duration-200 hover:scale-110">
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
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Patient History</h1>
                  <p className="text-gray-600">View patient records and medical history</p>
                </div>
              </div>
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
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-4">
              {patients.map((patient, index) => (
                <div 
                  key={patient.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer ${
                    hoveredPatient === index ? 'transform scale-102 shadow-xl border-2 border-blue-200' : 'border border-gray-200'
                  }`}
                  onMouseEnter={() => setHoveredPatient(index)}
                  onMouseLeave={() => setHoveredPatient(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">SJ</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
                        </div>
                        <div className="flex items-center space-x-6 text-gray-600 mb-3">
                          <span>{patient.age} years • {patient.gender}</span>
                          <span>{patient.bloodType}</span>
                          <span>{patient.lastVisit}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          {patient.conditions.map((condition, idx) => (
                            <span 
                              key={idx}
                              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2 text-red-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-sm font-medium">{patient.allergies[0]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewPatient(patient.id)}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">View</span>
                    </button>
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