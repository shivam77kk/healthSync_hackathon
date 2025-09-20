import { useState, useEffect } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function Appointments() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const response = await api.getAppointments();
    setAppointments(response?.appointments || []);
    setLoading(false);
  };

  const fetchDoctors = async () => {
    const response = await api.getDoctors();
    setDoctors(response?.doctors || []);
  };

  const handleBookAppointment = async (doctorId) => {
    try {
      const appointmentData = {
        doctorId,
        date: new Date().toISOString(),
        reason: 'Regular checkup'
      };
      await api.bookAppointment(appointmentData);
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const specialties = [
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Dermatology', icon: '👁️' },
    { name: 'Neurology', icon: '🧠' },
    { name: 'Orthopedics', icon: '🦴' }
  ];

  const hospitals = [
    {
      name: 'City General Hospital',
      location: 'Downtown, New York',
      distance: '2.4km',
      rating: 4.5,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'City General Hospital',
      location: 'Downtown, New York',
      distance: '2.4km',
      rating: 4.5,
      image: '/api/placeholder/60/60'
    }
  ];

  const availableDoctors = [
    {
      name: 'Dr. Michael Johnson',
      specialty: 'Cardiology',
      experience: '5+ Years',
      location: 'City General Hospital',
      time: 'Today 3:00 PM',
      fee: '$50',
      image: '/api/placeholder/50/50'
    },
    {
      name: 'Dr. Michael Johnson',
      specialty: 'Cardiology',
      experience: '5+ Years',
      location: 'City General Hospital',
      time: 'Today 3:00 PM',
      fee: '$50',
      image: '/api/placeholder/50/50'
    },
    {
      name: 'Dr. Michael Johnson',
      specialty: 'Cardiology',
      experience: '5+ Years',
      location: 'City General Hospital',
      time: 'Today 3:00 PM',
      fee: '$50',
      image: '/api/placeholder/50/50'
    },
    {
      name: 'Dr. Michael Johnson',
      specialty: 'Cardiology',
      experience: '5+ Years',
      location: 'City General Hospital',
      time: 'Today 5:30 PM',
      fee: '$50',
      image: '/api/placeholder/50/50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#4a7c59] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">+</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d5016]">Book an Appointment</h1>
              <p className="text-[#4a7c59]">Find and book appointments with top-rated doctors</p>
            </div>
          </div>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-[#4a7c59] px-4 py-2 rounded-full hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
            <span className="text-white font-medium">{user?.name || 'Sam Cha'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] transition-all duration-300 hover:shadow-md"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] text-gray-500 transition-all duration-300 hover:shadow-md hover:border-[#4a7c59]"
          >
            <option value="">Select Specialty</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
            <option value="neurology">Neurology</option>
          </select>
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] text-gray-500 transition-all duration-300 hover:shadow-md hover:border-[#4a7c59]"
          >
            <option value="">Select Location</option>
            <option value="downtown">Downtown</option>
            <option value="uptown">Uptown</option>
          </select>
          
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] text-gray-500 transition-all duration-300 hover:shadow-md hover:border-[#4a7c59]"
          >
            <option value="">Select Date</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* My Appointments Section */}
          {appointments.length > 0 && (
            <div className="col-span-2 mb-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">My Appointments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appointment, index) => (
                  <div key={appointment._id || index} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{appointment.doctorId?.name || 'Dr. Unknown'}</h3>
                        <p className="text-sm text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                        <p className="text-xs text-gray-400">{appointment.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Left Column */}
          <div className="space-y-6">
            {/* Popular Specialties */}
            <div className="bg-[#4a7c59] rounded-2xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Popular Specialties</h2>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty, index) => (
                  <button
                    key={index}
                    className="bg-white rounded-lg p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{specialty.icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#4a7c59] transition-colors duration-300">{specialty.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hospitals */}
            <div className="space-y-4">
              {hospitals.map((hospital, index) => (
                <div key={index} className="bg-[#4a7c59] rounded-2xl p-4 hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#a8d5ba] rounded-lg"></div>
                      <div>
                        <h3 className="text-white font-semibold">{hospital.name}</h3>
                        <div className="flex items-center space-x-2 text-[#a8d5ba] text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.location}</span>
                          <span>{hospital.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{hospital.rating}</span>
                      </div>
                      <button className="bg-[#a8d5ba] text-[#2d5016] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#95c9a7] transition-all duration-300 hover:scale-105 hover:shadow-md">
                        View Doctor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Available Doctors */}
          <div>
            <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Available Doctors</h2>
            <div className="space-y-4">
              {availableDoctors.map((doctor, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#f8fdf9] group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#a8d5ba] rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{doctor.experience}</span>
                          <span>{doctor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{doctor.time}</div>
                      <div className="text-sm text-gray-600">{doctor.fee}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}