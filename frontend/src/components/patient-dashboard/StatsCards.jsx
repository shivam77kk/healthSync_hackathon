import { Heart, Pill, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';

export default function StatsCards({ healthData }) {
  const router = useRouter();

  const handleCardClick = (type) => {
    switch(type) {
      case 'health':
        router.push('/health-tracker');
        break;
      case 'meds':
        router.push('/ai-health-assistant');
        break;
      case 'appointments':
        router.push('/appointments');
        break;
    }
  };

  return (
    <div className="bg-[#2e7d32] rounded-2xl p-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div 
          className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 hover:bg-white/10 rounded-xl p-3"
          onClick={() => handleCardClick('health')}
        >
          <Heart className="w-8 h-8 text-white mb-2 transition-all duration-300 group-hover:scale-125 group-hover:text-red-200" />
          <p className="text-white text-sm group-hover:text-gray-100">Health Score</p>
          <p className="text-white text-2xl font-bold group-hover:text-gray-100">{healthData.healthScore}%</p>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 hover:bg-white/10 rounded-xl p-3"
          onClick={() => handleCardClick('meds')}
        >
          <Pill className="w-8 h-8 text-white mb-2 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-200" />
          <p className="text-white text-sm group-hover:text-gray-100">Active Meds</p>
          <p className="text-white text-2xl font-bold group-hover:text-gray-100">{healthData.activeMeds}</p>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 hover:bg-white/10 rounded-xl p-3"
          onClick={() => handleCardClick('appointments')}
        >
          <TrendingUp className="w-8 h-8 text-white mb-2 transition-all duration-300 group-hover:scale-125 group-hover:text-green-200" />
          <p className="text-white text-sm group-hover:text-gray-100">Appointments</p>
          <p className="text-white text-2xl font-bold group-hover:text-gray-100">{healthData.appointments}</p>
        </div>
      </div>
    </div>
  );
}