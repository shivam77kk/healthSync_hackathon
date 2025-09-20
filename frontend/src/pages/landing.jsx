import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePatientClick = () => {
    router.push('/patient-signup');
  };

  const handleDoctorClick = () => {
    router.push('/doctor-signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-purple-900 relative overflow-hidden">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse transition-all duration-1000 ease-out"
          style={{
            top: `${20 + scrollY * 0.1}px`,
            left: `${20 + mousePosition.x * 0.02}px`,
            transform: `scale(${1 + scrollY * 0.0005})`
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 transition-all duration-1000 ease-out"
          style={{
            top: `${160 - scrollY * 0.05}px`,
            right: `${20 + mousePosition.y * 0.02}px`,
            transform: `scale(${1 + scrollY * 0.0003}) rotate(${mousePosition.x * 0.1}deg)`
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 transition-all duration-1000 ease-out"
          style={{
            bottom: `${20 + scrollY * 0.08}px`,
            left: '50%',
            transform: `translateX(-50%) scale(${1 + scrollY * 0.0004}) rotate(${-mousePosition.y * 0.1}deg)`
          }}
        ></div>
        
        {/* Cursor follower orbs */}
        <div 
          className="absolute w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 64}px`,
            top: `${mousePosition.y - 64}px`
          }}
        ></div>
        <div 
          className="absolute w-20 h-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: `${mousePosition.x - 40 + Math.sin(Date.now() * 0.001) * 20}px`,
            top: `${mousePosition.y - 40 + Math.cos(Date.now() * 0.001) * 20}px`
          }}
        ></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `translateY(${-scrollY * (0.1 + Math.random() * 0.2)}px)`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white text-xl font-semibold">HealthSync</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Hero Icon */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-emerald-600/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-emerald-400/20 animate-bounce">
              <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>

          {/* Hero Text */}
          <div className="mb-12 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Your Health,
              <br />
              <span className="text-emerald-300">Simplified</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl leading-relaxed">
              Connect with healthcare professionals and manage your medical records in
              <br />
              one secure, intuitive platform designed for modern healthcare.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">
            {/* Patient Card */}
            <div 
              className={`bg-emerald-800/40 backdrop-blur-sm border border-emerald-600/30 rounded-2xl p-8 text-left transition-all duration-300 cursor-pointer ${
                hoveredCard === 'patient' ? 'transform scale-105 bg-emerald-700/50' : ''
              }`}
              onMouseEnter={() => setHoveredCard('patient')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={handlePatientClick}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">I'm a Patient</h3>
                <p className="text-emerald-200 text-sm leading-relaxed">
                  Access your medical records, book appointments, and
                  <br />
                  track your health journey
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-emerald-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  View Medical Records
                </div>
                <div className="flex items-center gap-3 text-emerald-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Schedule Appointments
                </div>
                <div className="flex items-center gap-3 text-emerald-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Track Visit History
                </div>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group">
                Get Started as Patient
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Doctor Card */}
            <div 
              className={`bg-purple-800/40 backdrop-blur-sm border border-purple-600/30 rounded-2xl p-8 text-left transition-all duration-300 cursor-pointer ${
                hoveredCard === 'doctor' ? 'transform scale-105 bg-purple-700/50' : ''
              }`}
              onMouseEnter={() => setHoveredCard('doctor')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={handleDoctorClick}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">I'm a Doctor</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Manage patients, create reports, and streamline your
                  <br />
                  medical practice
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-purple-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Manage Patients
                </div>
                <div className="flex items-center gap-3 text-purple-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
                  </svg>
                  Create Medical Reports
                </div>
                <div className="flex items-center gap-3 text-purple-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Data Management
                </div>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group">
                Get Started as Doctor
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-white font-medium text-sm">HIPAA Compliant</h4>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-white font-medium text-sm">Real-time Updates</h4>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h4 className="text-white font-medium text-sm">Easy Registration</h4>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-white font-medium text-sm">Modern Interface</h4>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-emerald-200 text-sm">
            © 2024 HealthSync. All rights reserved. | Secure • Private • Professional
          </p>
        </footer>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}