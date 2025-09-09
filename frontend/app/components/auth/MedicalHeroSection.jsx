export default function MedicalHeroSection() {
  return (
    <div className="relative flex items-center justify-center p-8">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-4 -left-4 text-red-600 text-2xl animate-pulse">✦</div>
        <div className="absolute -top-2 left-16 text-blue-600 text-lg animate-bounce">✦</div>
        <div className="absolute top-8 -right-6 text-yellow-600 text-xl animate-pulse">✦</div>
        <div className="absolute bottom-12 -left-8 text-blue-600 text-lg animate-bounce">✦</div>
        <div className="absolute -bottom-4 right-4 text-red-600 text-2xl animate-pulse">✦</div>

        {/* Blue decorative leaves */}
        <div className="absolute -top-8 right-8 w-16 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full transform rotate-45 opacity-80"></div>
        <div className="absolute top-4 -right-12 w-12 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full transform -rotate-12 opacity-70"></div>
        <div className="absolute -bottom-8 -left-12 w-20 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full transform rotate-12 opacity-75"></div>

        {/* Main clipboard */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-t-3xl rounded-b-lg p-6 shadow-2xl">
          {/* Clipboard clip */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-blue-700 to-blue-900 rounded-full shadow-lg">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* Clipboard content */}
          <div className="bg-white rounded-lg p-6 mt-4 shadow-inner">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl font-bold">+</div>
              </div>
            </div>

            {/* Form lines */}
            <div className="space-y-3">
              <div className="h-2 bg-gray-200 rounded-full"></div>
              <div className="h-2 bg-gray-200 rounded-full w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center">
                  <div className="text-blue-600 text-sm">✓</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center">
                  <div className="text-blue-600 text-sm">✓</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full flex-1 w-3/4"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <div className="h-2 bg-gray-200 rounded-full flex-1 w-4/5"></div>
              </div>
            </div>

            {/* More form lines */}
            <div className="mt-6 space-y-2">
              <div className="h-1.5 bg-gray-100 rounded-full"></div>
              <div className="h-1.5 bg-gray-100 rounded-full w-5/6"></div>
              <div className="h-1.5 bg-gray-100 rounded-full w-4/5"></div>
              <div className="h-1.5 bg-gray-100 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Stethoscope */}
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            {/* Stethoscope tubes */}
            <div className="w-24 h-32 border-4 border-blue-700 rounded-full border-l-transparent border-b-transparent transform rotate-45"></div>
            <div className="absolute -bottom-2 -right-2 w-16 h-20 border-4 border-blue-700 rounded-full border-r-transparent border-t-transparent transform -rotate-12"></div>

            {/* Stethoscope head */}
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg border-2 border-blue-700"></div>
          </div>
        </div>

        {/* Medical supplies */}
        <div className="absolute -bottom-12 -left-8">
          {/* Medicine bottle */}
          <div className="w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg">
            <div className="w-8 h-3 bg-blue-700 rounded-t-lg mx-auto"></div>
            <div className="mt-2 mx-2">
              <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
              <div className="h-1 bg-white/70 rounded-full mb-1"></div>
              <div className="h-1 bg-white/70 rounded-full w-3/4"></div>
            </div>
          </div>

          <div className="absolute -top-2 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
            <div className="text-blue-600 text-lg font-bold">+</div>
          </div>
        </div>

        {/* Pen */}
        <div className="absolute -bottom-8 right-4 transform rotate-45">
          <div className="w-2 h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full"></div>
          <div className="w-3 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full -mt-1 -ml-0.5"></div>
          <div className="w-1 h-4 bg-blue-800 rounded-full ml-0.5 -mt-1"></div>
        </div>
      </div>
    </div>
  )
}
