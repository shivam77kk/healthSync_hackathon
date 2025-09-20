export default function HealthGoals({ healthData }) {
  const goals = [
    { id: 'water', label: 'Water Intake', progress: healthData?.waterIntake || 75, color: '#000000' },
    { id: 'steps', label: 'Steps', progress: healthData?.steps || 65, color: '#4caf50' },
    { id: 'sleep', label: 'Sleep', progress: healthData?.sleep || 85, color: '#2e7d32' }
  ];

  const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(totalProgress / 100) * circumference} ${circumference}`;

  return (
    <div className="bg-[#2e7d32] rounded-2xl p-6 h-64 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
      <h2 className="text-xl font-bold text-white mb-6">Today's Health Goals</h2>
      
      <div className="flex items-center justify-between h-full">
        <div className="space-y-4 flex-1">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center space-x-4 group">
              <span className="text-white font-medium flex-1">{goal.label}</span>
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: goal.color }}></div>
            </div>
          ))}
        </div>
        
        <div className="ml-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#a5d6a7"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1b5e20"
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}