import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { token, userType, user } = router.query;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType || 'patient');
      sessionStorage.setItem('fromLanding', 'true');
      
      if (user) {
        try {
          const userData = JSON.parse(decodeURIComponent(user));
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Redirect based on user type
      if (userType === 'doctor') {
        router.replace('/doctor-dashboard');
      } else {
        router.replace('/');
      }
    } else {
      router.push('/patient-signin');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}