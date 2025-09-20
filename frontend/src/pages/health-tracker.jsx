import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function HealthTracker() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Vitals');
  const [healthLogs, setHealthLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  useEffect(() => {
    fetchHealthLogs();
    fetchReminders();
  }, []);

  const fetchHealthLogs = async () => {
    const response = await api.getHealthLogs();
    setHealthLogs(response?.logs || []);
    setLoading(false);
  };

  const fetchReminders = async () => {
    const response = await api.getReminders();
    setReminders(response?.reminders || []);
  };

  const handleLogVital = async (vitalType, value) => {
    try {
      const logData = {
        date: new Date().toISOString(),
        vitals: { [vitalType]: value },
        symptoms: [],
        notes: `${vitalType} logged: ${value}`
      };
      await api.createHealthLog(logData);
      fetchHealthLogs();
    } catch (error) {
      console.error('Error logging vital:', error);
    }
  };

  const tabs = ['Vitals', 'Daily Goals', 'Medications', 'Nutritions'];

  const vitalsData = [
    {
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'Normal',
      time: '09:30 AM',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500',
      icon: '❤️'
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'Normal',
      time: '09:30 AM',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500',
      icon: '💓'
    },
    {
      title: 'Blood Sugar',
      value: '95',
      unit: 'mg/dL',
      status: 'Normal',
      time: '08:00 AM',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-500',
      icon: '🩸'
    },
    {
      title: 'Weight',
      value: '68.5',
      unit: 'kg',
      status: 'Stable',
      time: '07:00 AM',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-500',
      icon: '⚖️'
    },
    {
      title: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'Normal',
      time: '09:30 AM',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-500',
      icon: '🌡️'
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
              <h1 className="text-3xl font-bold text-[#2d5016]">Health Tracker</h1>
              <p className="text-[#4a7c59] text-lg">Monitor your daily health metrics and goals</p>
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

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${
                activeTab === tab
                  ? 'bg-[#4a7c59] text-white shadow-lg'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Vitals Grid */}
        {activeTab === 'Vitals' && (
          <div className="grid grid-cols-3 gap-6">
            {vitalsData.map((vital, index) => (
              <div
                key={index}
                className={`${vital.color} rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{vital.icon}</span>
                    <h3 className={`font-semibold ${vital.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                      {vital.title}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    {vital.time}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {vital.value}
                    </span>
                    <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {vital.unit}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    vital.status === 'Normal' || vital.status === 'Stable' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  } group-hover:font-bold transition-all duration-300`}>
                    {vital.status}
                  </span>
                </div>

                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 group-hover:font-medium">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">
                    {vital.title === 'Weight' ? 'Log Weight' : 
                     vital.title === 'Temperature' ? 'Log Temp' : 'Log Reading'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Other Tab Content Placeholders */}
        {activeTab === 'Daily Goals' && (
          <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Daily Goals</h3>
            <p className="text-gray-500">Track your daily health goals here</p>
          </div>
        )}

        {activeTab === 'Medications' && (
          <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Medications</h3>
            <p className="text-gray-500">Manage your medications here</p>
          </div>
        )}

        {activeTab === 'Nutritions' && (
          <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Nutritions</h3>
            <p className="text-gray-500">Track your nutrition intake here</p>
          </div>
        )}
      </div>
    </div>
  );
}