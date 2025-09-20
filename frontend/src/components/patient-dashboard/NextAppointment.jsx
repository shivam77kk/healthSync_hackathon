import { useRouter } from 'next/router';

export default function NextAppointment() {
  const router = useRouter();

  return (
    <div className="bg-[#2e7d32] rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
      <h3 className="font-bold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">Next Appointment</h3>
      
      <div className="space-y-2">
        <p className="font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">Dr. Johnson</p>
        <p className="text-white text-sm group-hover:text-gray-200 transition-colors duration-300">Tomorrow, 2:00 PM</p>
        <p className="text-white text-xs group-hover:text-gray-200 transition-colors duration-300">Cardiology Follow-up</p>
      </div>
      
      <button 
        onClick={() => router.push('/appointments')}
        className="w-full bg-[#1b5e20] text-white py-2 px-4 rounded-lg mt-4 text-sm transition-all duration-300 hover:bg-[#0d4715] hover:scale-105 hover:shadow-lg"
      >
        Join Video Call
      </button>
    </div>
  );
}