import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('patient');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') || 'patient';
    const storedUser = localStorage.getItem('user');
    
    setUserType(storedUserType);
    
    if (token) {
      api.setToken(token);
      try {
        await api.verifyAuth();
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Ensure userType is set correctly
          if (!localStorage.getItem('userType')) {
            localStorage.setItem('userType', 'patient');
          }
        } else {
          const userProfile = await api.getUserProfile();
          if (userProfile && userProfile.user) {
            setUser(userProfile.user);
            localStorage.setItem('user', JSON.stringify(userProfile.user));
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        api.clearToken();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      }
    }
    setLoading(false);
  };

  const login = async (email, password, type = 'patient') => {
    try {
      const response = await api.login(email, password, type);
      if (response.user || response.doctor) {
        const userData = response.user || response.doctor;
        setUser(userData);
        setUserType(type);
        localStorage.setItem('userType', type);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData, type = 'patient') => {
    try {
      const response = await api.register(userData, type);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      setUserType('patient');
      api.clearToken();
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  };

  const googleLogin = (type = 'patient') => {
    api.googleLogin(type);
  };

  const value = {
    user,
    userType,
    login,
    register,
    logout,
    googleLogin,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};