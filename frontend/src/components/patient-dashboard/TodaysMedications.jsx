import { useRouter } from 'next/router';

export default function TodaysMedications() {
  const router = useRouter();
  
  const medications = [
    {
      name: 'Melatonin',
      description: 'Take with food to reduce stomach upset',
      nextDose: '8:00 AM',
      pillsLeft: 25
    },
    {
      name: 'Melatonin',
      description: 'Take with food to reduce stomach upset',
      nextDose: '8:00 AM', 
      pillsLeft: 25
    }
  ];

  return (
    <div 
      className="bg-[#2e7d32] rounded-2xl p-4 h-64 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
      onClick={() => router.push('/ai-health-assistant')}
    >
      <h3 className="font-bold text-white mb-4 text-lg group-hover:text-gray-100 transition-colors duration-300">Today's Medications</h3>
      
      <div className="space-y-3">
        {medications.map((med, index) => (
          <div 
            key={index}
            className="bg-[#1b5e20] p-3 rounded-lg transition-all duration-300 hover:bg-[#0d4715] hover:scale-105"
          >
            <div className="mb-2">
              <h4 className="font-semibold text-white text-sm">{med.name}</h4>
              <p className="text-xs text-white opacity-90">{med.description}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-white">
              <span>Next dose: {med.nextDose}</span>
              <span>Pills left: {med.pillsLeft}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}