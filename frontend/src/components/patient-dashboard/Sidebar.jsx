import { Home, Calendar, FileText, Clock, MessageSquare, CreditCard, Settings, Shield, PlayCircle, Mic, LogOut } from 'lucide-react';
import { HeartHandshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('home');

  // Set active item based on current route
  useEffect(() => {
    if (router.pathname === '/appointments') {
      setActiveItem('calendar');
    } else if (router.pathname === '/medical-reports') {
      setActiveItem('file');
    } else if (router.pathname === '/visit-history') {
      setActiveItem('clock');
    } else if (router.pathname === '/health-tracker') {
      setActiveItem('heart');
    } else if (router.pathname === '/health-assessment') {
      setActiveItem('play');
    } else if (router.pathname === '/ai-health-assistant') {
      setActiveItem('message');
    } else if (router.pathname === '/voice-prescription') {
      setActiveItem('mic');
    } else if (router.pathname === '/report-viewer') {
      setActiveItem('file-report');
    } else if (router.pathname === '/voice-notes') {
      setActiveItem('voice-notes');
    } else if (router.pathname === '/') {
      setActiveItem('home');
    }
  }, [router.pathname]);

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    if (itemId === 'calendar') {
      router.push('/appointments');
    } else if (itemId === 'file') {
      router.push('/medical-reports');
    } else if (itemId === 'clock') {
      router.push('/visit-history');
    } else if (itemId === 'heart') {
      router.push('/health-tracker');
    } else if (itemId === 'play') {
      router.push('/health-assessment');
    } else if (itemId === 'message') {
      router.push('/ai-health-assistant');
    } else if (itemId === 'mic') {
      router.push('/voice-prescription');
    } else if (itemId === 'file-report') {
      router.push('/report-viewer');
    } else if (itemId === 'voice-notes') {
      router.push('/voice-notes');
    } else if (itemId === 'home') {
      router.push('/patient-dashboard');
    } else if (itemId === 'logout') {
      handleLogout();
    }
  };

  const handleLogout = async () => {
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
  };

  const menuItems = [
    { id: 'home', icon: Home },
    { id: 'calendar', icon: Calendar },
    { id: 'file-report', icon: FileText },
    { id: 'clock', icon: Clock },
    { id: 'heart', icon: HeartHandshake },
    { id: 'play', icon: PlayCircle },
    { id: 'message', icon: MessageSquare },
    { id: 'voice-notes', icon: Mic },
    { id: 'settings', icon: Settings }
  ];

  return (
    <div className="w-20 bg-[#0A3E1D] min-h-screen flex flex-col">
      <div className="p-3 text-center">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-1 mx-auto">
          <Shield className="w-6 h-6 text-[#0A3E1D]" />
        </div>
        <div className="text-[8px] font-bold text-white leading-none break-words px-1">
          HealthSync
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full h-12 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                activeItem === item.id 
                  ? 'bg-[#083319]' 
                  : 'hover:bg-[#083319]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all duration-300 hover:scale-125 ${
                activeItem === item.id 
                  ? 'text-gray-100' 
                  : 'text-white'
              }`} />
            </button>
          ))}
        </div>
      </nav>
      
      {/* Logout Button */}
      <div className="px-2 pb-4">
        <button
          onClick={() => handleNavigation('logout')}
          className="w-full h-12 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-red-600 bg-red-500"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-white transition-all duration-300 hover:scale-125" />
        </button>
      </div>
    </div>
  );
}