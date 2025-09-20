import { Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const handleLogout = async () => {
    await logout();
    sessionStorage.removeItem('fromLanding');
    router.push('/landing');
  };

  return (
    <header className="bg-[#c8e6c9] p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-4 py-3 bg-white/70 border-0 rounded-full text-gray-600 placeholder-gray-500 focus:outline-none focus:bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-[#a5d6a7] rounded-full py-2 px-6 hover:bg-[#95c9a7] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="font-semibold text-gray-800">{user?.name || 'Sam Cha'}</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
