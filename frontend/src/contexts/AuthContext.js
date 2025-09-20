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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      try {
        await api.verifyAuth();
        const userProfile = await api.getUserProfile();
        if (userProfile && userProfile.name !== 'Sam Cha') {
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Don't clear token on network errors, only on actual auth failures
        if (error.message === 'Unauthorized') {
          api.clearToken();
          localStorage.removeItem('token');
        }
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
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
      api.clearToken();
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};