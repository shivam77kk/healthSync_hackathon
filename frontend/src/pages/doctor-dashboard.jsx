import { useState, useEffect } from 'react';
import { Search, Home, Calendar, Users, FileText, Clock, Mic, Settings, AlertTriangle, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, userType, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user came from landing page and is a doctor
    const fromLanding = sessionStorage.getItem('fromLanding');
    const storedUserType = localStorage.getItem('userType');
    
    if (!fromLanding) {
      router.push('/landing');
      return;
    }
    
    if (storedUserType === 'patient') {
      router.push('/patient-dashboard');
      return;
    }
    
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const appointmentsRes = await api.getAppointments();
      setAppointments(appointmentsRes?.appointments || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const todaysAppointments = [
    { id: 1, name: 'Sarah Johnson', time: '9:00 AM', type: 'Check-up', status: 'In Progress' },
    { id: 2, name: 'Robert Smith', time: '10:30 AM', type: 'Follow-up', status: 'Upcoming' },
    { id: 3, name: 'Emma Davis', time: '2:00 PM', type: 'Consultation', status: 'Scheduled' }
  ];

  const recentPatients = [
    { id: 'SJ', name: 'Sarah Johnson', age: 34, lastVisit: '2 days ago', bloodPressure: '120/80', meds: 'Lisinopril', nextVisit: 'March 25' },
    { id: 'RS', name: 'Robert Smith', age: 45, lastVisit: '1 week ago', cholesterol: '180 mg/dL', meds: 'Atorvastatin', nextVisit: 'March 28' },
    { id: 'ED', name: 'Emma Davis', age: 28, lastVisit: '3 days ago', heartRate: '72 bpm', meds: 'None', nextVisit: 'April 5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-20 bg-blue-600 flex flex-col items-center py-6 space-y-8">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">+</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-6">
          <button className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110 bg-blue-500">
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => router.push('/appointment-management')}
            className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Calendar className="w-6 h-6" />
          </button>
          <button 
            onClick={() => router.push('/patient-history')}
            className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Users className="w-6 h-6" />
          </button>
          <button 
            onClick={() => router.push('/medical-reports')}
            className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <FileText className="w-6 h-6" />
          </button>
          <button className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110">
            <Clock className="w-6 h-6" />
          </button>
          <button 
            onClick={() => router.push('/voice-prescription')}
            className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mt-auto space-y-4">
          <button className="p-3 text-white hover:bg-blue-500 rounded-xl transition-all duration-300 hover:scale-110">
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={async () => {
              try {
                await logout();
                sessionStorage.removeItem('fromLanding');
                router.push('/landing');
              } catch (error) {
                console.error('Logout error:', error);
                // Force logout even if API call fails
                sessionStorage.removeItem('fromLanding');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                router.push('/landing');
              }
            }}
            className="p-3 text-white hover:bg-red-500 bg-red-600 rounded-xl transition-all duration-300 hover:scale-110"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400 absolute ml-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-80 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            />
          </div>
          
          <div className="flex items-center space-x-3 bg-blue-200 px-6 py-3 rounded-full hover:bg-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">{(user?.name || 'Sam Cha').split(' ').map(n => n[0]).join('')}</span>
            </div>
            <span className="text-blue-800 font-medium">{user?.name || 'Sam Cha'}</span>
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Good Day, {user?.name?.split(' ')[0] || 'Sam'}!</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Patients</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-blue-200 text-xs">+2 from yesterday</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800">8</p>
                <p className="text-gray-500 text-xs">Next appointment: 9:30 AM</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Prescriptions</p>
                <p className="text-3xl font-bold text-gray-800">25</p>
                <p className="text-gray-500 text-xs">3 pending review</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-red-500 text-xs">Requires attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Schedule</h2>
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-blue-100 text-sm">{appointment.time} - {appointment.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    appointment.status === 'In Progress' ? 'bg-blue-400 text-blue-100' :
                    appointment.status === 'Upcoming' ? 'bg-yellow-400 text-yellow-800' :
                    'bg-green-400 text-green-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Critical Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 cursor-pointer">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Drug Interaction</p>
                  <p className="text-red-600 text-sm">John Doe - Warfarin + Aspirin</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all duration-300 cursor-pointer">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-800">Allergy Warning</p>
                  <p className="text-yellow-600 text-sm">Mary Johnson - Penicillin allergy</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 cursor-pointer">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Prescription Approved</p>
                  <p className="text-green-600 text-sm">Lisa Brown - Completed successfully</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patient Summaries */}
        <div className="mt-8 bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Patient Summaries</h2>
          <div className="grid grid-cols-3 gap-6">
            {recentPatients.map((patient, index) => (
              <div 
                key={index}
                className="p-4 border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-300"
                onClick={() => router.push(`/patient-history?id=${patient.id}`)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {patient.id}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{patient.name}</p>
                    <p className="text-gray-500 text-sm">Age {patient.age}, Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {patient.bloodPressure && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Pressure:</span>
                      <span className="font-medium">{patient.bloodPressure}</span>
                    </div>
                  )}
                  {patient.cholesterol && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cholesterol:</span>
                      <span className="font-medium">{patient.cholesterol}</span>
                    </div>
                  )}
                  {patient.heartRate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heart Rate:</span>
                      <span className="font-medium">{patient.heartRate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Meds:</span>
                    <span className="font-medium">{patient.meds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Visit:</span>
                    <span className="font-medium">{patient.nextVisit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}