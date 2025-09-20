import { useState } from 'react';
import { Mic } from 'lucide-react';
import { useRouter } from 'next/router';
import AIHealthAssistantPopup from '../AIHealthAssistantPopup';

export default function AIAssistant() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };

  return (
    <>
    <div 
      className="bg-[#2e7d32] rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
      onClick={handleClick}
    >
      <h3 className="font-bold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">AI Health Assistant</h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg group-hover:bg-gray-100">
          <Mic className="w-8 h-8 text-[#2e7d32] transition-all duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      <p className="text-center text-white text-sm group-hover:text-gray-100 transition-colors duration-300">
        Tap to Speak
      </p>
    </div>
    
    <AIHealthAssistantPopup 
      isOpen={showPopup} 
      onClose={() => setShowPopup(false)} 
    />
    </>
  );
}