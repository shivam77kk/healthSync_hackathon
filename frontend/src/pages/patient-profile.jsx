import { useState, useEffect } from 'react';
import { User, Heart, Phone, Shield, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function PatientProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await api.getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#c8e6c9] flex items-center justify-center">
        <div className="text-xl text-[#2d5016]">Loading...</div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-[#2d5016]">Patient Profile</h1>
              <p className="text-[#4a7c59] text-lg">Manage your personal and medical information</p>
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

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-[#a8d5ba] rounded-2xl flex items-center justify-center group-hover:bg-[#95c9a7] transition-colors duration-300">
              <span className="text-[#2d5016] text-2xl font-bold">SJ</span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-2 group-hover:text-[#4a7c59] transition-colors duration-300">
                {profile?.name || 'Sarah Johnson'}
              </h2>
              
              <div className="grid grid-cols-3 gap-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>Age: {profile?.age || '34'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{profile?.gender || 'Female'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🩸</span>
                  <span>Blood Type: {profile?.bloodGroup || 'O+'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-[#4a7c59] group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-[#2d5016] group-hover:text-[#4a7c59] transition-colors duration-300">
                Personal Information
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                  <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                    {profile?.name?.split(' ')[0] || 'Sarah'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                  <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                    {profile?.name?.split(' ')[1] || 'Johnson'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                  <span>✉️</span>
                  <span>{profile?.email || 'sarah.johnson@email.com'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Phone Number</label>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Address</label>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                  <span>📍</span>
                  <span>123 Main St, New York, NY 10001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="w-5 h-5 text-[#4a7c59] group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-[#2d5016] group-hover:text-[#4a7c59] transition-colors duration-300">
                Medical Information
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Blood Group</label>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 group-hover:bg-red-100 transition-colors duration-300">
                    <span className="text-red-600 font-semibold">O+</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Date of Birth</label>
                  <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                    {profile?.age || '34'} years
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Allergies</label>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 group-hover:bg-red-100 transition-colors duration-300">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-semibold">Allergies</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">Penicillin</span>
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">Shellfish</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Medical Conditions</label>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 group-hover:bg-orange-100 transition-colors duration-300">
                  <div className="flex space-x-2">
                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">Hypertension</span>
                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">Mild asthma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl">🚨</span>
              <h3 className="text-xl font-semibold text-[#2d5016] group-hover:text-[#4a7c59] transition-colors duration-300">
                Emergency Contact
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Contact Person</label>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>John Johnson (Spouse)</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Emergency Phone</label>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 987-6543</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-5 h-5 text-[#4a7c59] group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-[#2d5016] group-hover:text-[#4a7c59] transition-colors duration-300">
                Insurance Information
              </h3>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Insurance Details</label>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 group-hover:bg-blue-100 transition-colors duration-300">
                <span className="text-blue-600 font-semibold">Blue Cross Blue Shield - Policy #BC12345678</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}