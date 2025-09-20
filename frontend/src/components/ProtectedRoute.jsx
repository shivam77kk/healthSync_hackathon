import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAuth = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push('/login');
    }
  }, [user, loading, requireAuth, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return children;
}