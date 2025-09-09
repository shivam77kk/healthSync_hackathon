"use client"

export default function MedicalIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-96">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Decorative stars - updated positions and colors */}
        <div className="absolute top-4 left-8 w-6 h-6 text-red-400 animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 w-4 h-4 text-blue-400 animate-pulse delay-300">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-4 w-3 h-3 text-yellow-400 animate-pulse delay-500">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>
        <div className="absolute top-20 right-4 w-5 h-5 text-red-300 animate-pulse delay-700">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>

        {/* Enhanced decorative leaves */}
        <div className="absolute top-8 right-8 w-20 h-24 text-blue-300 opacity-70 animate-float">
          <svg viewBox="0 0 100 120" fill="currentColor">
            <path d="M20 20 Q50 5 80 25 Q75 65 50 85 Q25 75 20 40 Z" />
            <path d="M25 30 Q45 25 65 40 Q60 60 45 75 Q35 70 25 50 Z" />
            <path d="M30 35 Q40 32 50 42 Q48 52 42 60 Q38 58 30 48 Z" />
          </svg>
        </div>
        <div className="absolute bottom-12 left-8 w-16 h-20 text-blue-400 opacity-60 animate-float delay-1000">
          <svg viewBox="0 0 80 100" fill="currentColor">
            <path d="M15 15 Q40 5 65 20 Q60 50 40 70 Q20 60 15 35 Z" />
            <path d="M20 25 Q35 20 50 30 Q48 45 38 55 Q28 50 20 35 Z" />
          </svg>
        </div>
      </div>

      {/* Main clipboard illustration - enhanced design */}
      <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
        {/* Clipboard base with improved styling */}
        <div className="w-72 h-96 bg-white rounded-xl shadow-2xl border-4 border-blue-600 relative overflow-hidden">
          {/* Clipboard clip - enhanced */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-blue-600 rounded-t-xl shadow-lg"></div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-inner"></div>

          {/* Medical cross - enhanced with shadow */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-3 bg-white rounded-full"></div>
            <div className="absolute w-3 h-10 bg-white rounded-full"></div>
          </div>

          {/* Form lines - improved spacing and styling */}
          <div className="absolute top-36 left-8 right-8 space-y-4">
            <div className="h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded-full w-3/5"></div>
          </div>

          {/* Enhanced checkboxes */}
          <div className="absolute top-52 left-8 space-y-5">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 border-3 border-blue-400 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="h-3 bg-gray-200 rounded-full w-36"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 border-3 border-blue-400 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="h-3 bg-gray-200 rounded-full w-32"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 border-3 border-blue-400 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="h-3 bg-gray-200 rounded-full w-28"></div>
            </div>
          </div>

          {/* Bottom form lines */}
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
            <div className="h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Enhanced stethoscope */}
        <div className="absolute -right-12 top-20 animate-float delay-500">
          <div className="relative">
            {/* Stethoscope tubes with gradient effect */}
            <div className="w-3 h-36 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform rotate-12 shadow-lg"></div>
            <div className="absolute top-32 -right-1 w-3 h-24 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform -rotate-45 shadow-lg"></div>
            <div className="absolute top-52 right-14 w-3 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform rotate-45 shadow-lg"></div>

            {/* Enhanced stethoscope head */}
            <div className="absolute top-68 right-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-4 border-blue-700 shadow-xl"></div>

            {/* Enhanced earpieces */}
            <div className="absolute -top-3 -left-2 w-5 h-5 bg-blue-900 rounded-full shadow-md"></div>
            <div className="absolute -top-3 right-1 w-5 h-5 bg-blue-900 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Enhanced pen */}
        <div className="absolute -bottom-8 -left-12 transform rotate-45 animate-float delay-300">
          <div className="w-3 h-24 bg-gradient-to-b from-blue-800 to-blue-900 rounded-full shadow-lg"></div>
          <div className="w-3 h-10 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full shadow-md"></div>
          <div className="w-2 h-6 bg-gray-800 rounded-full ml-0.5 shadow-sm"></div>
        </div>

        {/* Enhanced medical supplies */}
        <div className="absolute -bottom-12 -right-8 space-y-3 animate-float delay-700">
          <div className="w-16 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg border-3 border-blue-600 flex items-center justify-center shadow-lg">
            <div className="w-6 h-2 bg-white rounded-full"></div>
            <div className="absolute w-2 h-6 bg-white rounded-full"></div>
          </div>
          <div className="w-16 h-8 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg border-3 border-blue-500 shadow-md"></div>
          <div className="w-14 h-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg border-2 border-blue-400 shadow-sm"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
