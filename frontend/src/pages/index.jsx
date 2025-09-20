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

export default function PatientDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Always redirect to landing page first
  useEffect(() => {
    router.push('/landing');
  }, [router]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to landing page...</p>
      </div>
    </div>
  );
}