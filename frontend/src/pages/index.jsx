import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/patient-dashboard/Sidebar';
import Header from '../components/patient-dashboard/Header';
import WelcomeSection from '../components/patient-dashboard/WelcomeSection';
import HealthGoals from '../components/patient-dashboard/HealthGoals';
import StatsCards from '../components/patient-dashboard/StatsCards';
import NextAppointment from '../components/patient-dashboard/NextAppointment';
import AIAssistant from '../components/patient-dashboard/AIAssistant';
import TodaysMedications from '../components/patient-dashboard/TodaysMedications';
import api from '../utils/api';

export default function Dashboard() {
  const router = useRouter();
  
  // Check if user came from landing page, if not redirect to landing
  useEffect(() => {
    const fromLanding = sessionStorage.getItem('fromLanding');
    if (!fromLanding) {
      router.push('/landing');
      return;
    }
  }, [router]);

  const { user, loading: authLoading } = useAuth();
  const [healthData, setHealthData] = useState({
    healthScore: 92,
    activeMeds: 3,
    appointments: 2,
    waterIntake: 75,
    steps: 65,
    sleep: 85
  });
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      // Allow demo mode - don't require authentication for dashboard view
      
      const [appointmentsRes, remindersRes, healthRes] = await Promise.allSettled([
        api.getAppointments(),
        api.getReminders(),
        api.getHealthLogs()
      ]);
      
      const appointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value?.appointments || [] : [];
      const reminders = remindersRes.status === 'fulfilled' ? remindersRes.value?.reminders || [] : [];
      
      setAppointments(appointments);
      setReminders(reminders);
      
      setHealthData(prev => ({
        ...prev,
        appointments: appointments.length,
        activeMeds: reminders.length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <WelcomeSection />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <HealthGoals healthData={healthData} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NextAppointment />
                    <AIAssistant />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <StatsCards healthData={healthData} />
                  <TodaysMedications />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}