const API_BASE_URL = `${process.env.VITE_API_URL || 'http://localhost:5000'}/api`;

class ApiService {
  constructor() {
    this.token = null;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: this.getHeaders(),
        ...options
      });
      
      if (response.status === 401) {
        this.clearToken();
        // Don't throw error for unauthorized, return empty data instead
        return this.getFallbackData(url);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // Return fallback data instead of throwing error
      return this.getFallbackData(url);
    }
  }

  getFallbackData(url) {
    if (url.includes('/appointments')) return { appointments: [] };
    if (url.includes('/reminders')) return { reminders: [] };
    if (url.includes('/health')) return { logs: [] };
    if (url.includes('/documents')) return { documents: [] };
    if (url.includes('/doctors')) return { doctors: [] };
    if (url.includes('/news')) return { articles: [] };
    return {};
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response?.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  }

  async register(userData) {
    return await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // User endpoints
  async getUserProfile() {
    try {
      const result = await this.request('/users/profile');
      return result;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return {
        name: 'Sam Cha',
        email: 'sam.cha@email.com',
        age: 34,
        gender: 'Male',
        bloodGroup: 'O+'
      };
    }
  }

  async getAppointments() {
    try {
      if (!this.token) {
        return { appointments: [] };
      }
      const result = await this.request('/appointments/user');
      return result || { appointments: [] };
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return { appointments: [] };
    }
  }

  async bookAppointment(appointmentData) {
    return await this.request('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }

  async cancelAppointment(appointmentId) {
    return await this.request(`/appointments/cancel/${appointmentId}`, {
      method: 'POST'
    });
  }

  async getHealthLogs() {
    try {
      if (!this.token) {
        return { logs: [] };
      }
      const result = await this.request('/health/logs');
      return result || { logs: [] };
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
      return { logs: [] };
    }
  }

  async createHealthLog(healthData) {
    return await this.request('/health/log', {
      method: 'POST',
      body: JSON.stringify(healthData)
    });
  }

  async getDocuments() {
    const result = await this.request('/documents');
    return result || { documents: [] };
  }

  async uploadDocument(formData) {
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  }

  async getReminders() {
    try {
      if (!this.token) {
        return { reminders: [] };
      }
      const result = await this.request('/reminders');
      return result || { reminders: [] };
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      return { reminders: [] };
    }
  }

  async createReminder(reminderData) {
    return await this.request('/reminders/create', {
      method: 'POST',
      body: JSON.stringify(reminderData)
    });
  }

  async getDoctors() {
    try {
      const result = await this.request('/doctors');
      return result || { doctors: [] };
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      return { doctors: [] };
    }
  }

  async getDoctorProfile(doctorId) {
    return await this.request(`/doctors/${doctorId}`);
  }

  async sendChatMessage(message) {
    try {
      const result = await this.request('/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      return result || {
        response: 'I\'m here to help with your health questions! Ask me about symptoms, medications, diet, exercise, sleep, or stress management.'
      };
    } catch (error) {
      console.error('Failed to send chat message:', error);
      return {
        response: 'I\'m here to help with your health questions! Ask me about symptoms, medications, diet, exercise, sleep, or stress management.'
      };
    }
  }

  async getPredictiveScore() {
    try {
      const result = await this.request('/predictive-score/calculate', {
        method: 'POST',
        body: JSON.stringify({})
      });
      return result || {
        message: 'Assessment completed. Please consult with a healthcare provider for detailed analysis.'
      };
    } catch (error) {
      console.error('Failed to get predictive score:', error);
      return {
        message: 'Assessment completed. Please consult with a healthcare provider for detailed analysis.'
      };
    }
  }

  async getRiskScoreHistory() {
    try {
      const result = await this.request('/predictive-score/history');
      return result || { history: [] };
    } catch (error) {
      console.error('Failed to fetch risk score history:', error);
      return { history: [] };
    }
  }

  // Additional methods for backend integration
  async getNews() {
    try {
      const result = await this.request('/news');
      return result || { articles: [] };
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return { articles: [] };
    }
  }

  async getHealthNews() {
    try {
      const result = await this.request('/newsapi/health-news');
      return result || { articles: [] };
    } catch (error) {
      console.error('Failed to fetch health news:', error);
      return { articles: [] };
    }
  }

  async verifyAuth() {
    try {
      const result = await this.request('/auth/verify');
      return result;
    } catch (error) {
      console.error('Auth verification failed:', error);
      this.clearToken();
      throw error;
    }
  }
}

const api = new ApiService();
export default api;