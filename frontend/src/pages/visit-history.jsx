import { useState, useEffect } from 'react';
import { RotateCcw, Clock, Star, FileText } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function VisitHistory() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitHistory();
  }, []);

  const fetchVisitHistory = async () => {
    const response = await api.getAppointments();
    setAppointments(response?.appointments || []);
    setLoading(false);
  };

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const visits = [
    {
      doctor: 'Dr. Michael Johnson',
      specialty: 'Cardiologist',
      status: 'Completed',
      date: 'March 15, 2024 at 10:30 AM',
      location: 'Heart Care Center',
      reason: 'Regular Check-up',
      rating: '5/5',
      notes: 'Blood pressure normal, recommended lifestyle changes'
    },
    {
      doctor: 'Dr. Michael Johnson',
      specialty: 'Cardiologist',
      status: 'Completed',
      date: 'March 15, 2024 at 10:30 AM',
      location: 'Heart Care Center',
      reason: 'Regular Check-up',
      rating: '5/5',
      notes: 'Blood pressure normal, recommended lifestyle changes'
    },
    {
      doctor: 'Dr. Michael Johnson',
      specialty: 'Cardiologist',
      status: 'Completed',
      date: 'March 15, 2024 at 10:30 AM',
      location: 'Heart Care Center',
      reason: 'Regular Check-up',
      rating: '5/5',
      notes: 'Blood pressure normal, recommended lifestyle changes'
    }
  ];

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#4a7c59] rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">+</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2d5016]">Visit History</h1>
              <p className="text-[#4a7c59] text-lg">Your complete medical visit history with doctors</p>
            </div>
          </div>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-[#4a7c59] px-6 py-3 rounded-full hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
            <span className="text-white font-medium">{user?.name || 'Sam Cha'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#4a7c59] rounded-2xl p-6 hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a8d5ba] text-sm mb-1 group-hover:text-white transition-colors duration-300">Total Visits</p>
                <p className="text-white text-3xl font-bold">24</p>
              </div>
              <RotateCcw className="w-8 h-8 text-[#a8d5ba] group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
            </div>
          </div>

          <div className="bg-[#7ba889] rounded-2xl p-6 hover:bg-[#6b9c7a] transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#d4e6d4] text-sm mb-1 group-hover:text-white transition-colors duration-300">This Year</p>
                <p className="text-white text-3xl font-bold">8</p>
              </div>
              <Clock className="w-8 h-8 text-[#d4e6d4] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          <div className="bg-[#95c9a7] rounded-2xl p-6 hover:bg-[#7ba889] transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2d5016] text-sm mb-1 group-hover:text-white transition-colors duration-300">Avg Rating</p>
                <p className="text-[#2d5016] text-3xl font-bold group-hover:text-white transition-colors duration-300">4.7</p>
              </div>
              <Star className="w-8 h-8 text-[#2d5016] group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          <div className="bg-[#a8d5ba] rounded-2xl p-6 hover:bg-[#95c9a7] transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2d5016] text-sm mb-1 group-hover:text-white transition-colors duration-300">Last Visit</p>
                <p className="text-[#2d5016] text-3xl font-bold group-hover:text-white transition-colors duration-300">8 days</p>
              </div>
              <FileText className="w-8 h-8 text-[#2d5016] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Recent Visits */}
        <div>
          <h2 className="text-2xl font-bold text-[#2d5016] mb-6">Recent Visits</h2>
          
          <div className="space-y-4">
            {visits.map((visit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:bg-[#f8fdf9] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#4a7c59] rounded-full flex items-center justify-center group-hover:bg-[#3d6b4a] transition-colors duration-300">
                      <span className="text-white font-bold text-lg">DMJ</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#2d5016] group-hover:text-[#4a7c59] transition-colors duration-300">
                          {visit.doctor}
                        </h3>
                        <span className="bg-[#a8d5ba] text-[#2d5016] px-3 py-1 rounded-full text-sm font-medium group-hover:bg-[#4a7c59] group-hover:text-white transition-all duration-300">
                          {visit.specialty}
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm group-hover:bg-gray-300 transition-colors duration-300">
                          {visit.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{visit.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Reason: {visit.reason}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📍</span>
                          <span>{visit.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4" />
                          <span>Rating: {visit.rating}</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#f0f9f0] rounded-lg p-3 group-hover:bg-[#e8f5e8] transition-colors duration-300">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {visit.notes}
                        </p>
                      </div>
                    </div>
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