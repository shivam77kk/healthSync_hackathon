const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

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
  async login(email, password, userType = 'patient') {
    const endpoint = userType === 'doctor' ? '/doctors/login' : '/auth/login';
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response?.accessToken) {
      this.setToken(response.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userType', userType);
        localStorage.setItem('user', JSON.stringify(response.user || response.doctor));
      }
    }
    return response;
  }

  async register(userData, userType = 'patient') {
    const endpoint = userType === 'doctor' ? '/doctors/register' : '/auth/signup';
    return await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async googleLogin(userType = 'patient') {
    if (typeof window !== 'undefined') {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/authgoogle/google?type=${userType}`;
      console.log('Google Auth URL:', url);
      window.location.href = url;
    }
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
      const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : 'patient';
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
      const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : 'patient';
      const endpoint = userType === 'doctor' ? '/appointments/doctor' : '/appointments/user';
      const result = await this.request(endpoint);
      return result || { appointments: [] };
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return { appointments: [] };
    }
  }

  async getDoctorAvailability(doctorId, date) {
    try {
      const result = await this.request(`/appointments/availability/${doctorId}?date=${date}`);
      return result || { availability: null };
    } catch (error) {
      console.error('Failed to fetch doctor availability:', error);
      return { availability: null };
    }
  }

  async getPatientHistory(patientId) {
    try {
      const result = await this.request(`/doctors/patient/${patientId}/history`);
      return result || { patient: null, history: { healthLogs: [], documents: [] } };
    } catch (error) {
      console.error('Failed to fetch patient history:', error);
      return { patient: null, history: { healthLogs: [], documents: [] } };
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

  // Voice Prescription endpoints
  async getVoicePrescriptions() {
    try {
      const result = await this.request('/voice-prescription');
      return result || { prescriptions: [] };
    } catch (error) {
      console.error('Failed to fetch voice prescriptions:', error);
      return { prescriptions: [] };
    }
  }

  async createVoicePrescription(prescriptionData) {
    return await this.request('/voice-prescription/create', {
      method: 'POST',
      body: JSON.stringify(prescriptionData)
    });
  }

  async processVoiceToText(audioData) {
    const formData = new FormData();
    formData.append('audio', audioData);
    
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/voice-prescription/transcribe`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to process voice to text:', error);
      return { transcription: 'Voice processing unavailable' };
    }
  }

  // Report Viewer endpoints
  async getReports(type = null) {
    try {
      const url = type ? `/reports?type=${type}` : '/reports';
      const result = await this.request(url);
      return result || { reports: [] };
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      return { reports: [] };
    }
  }

  async downloadReport(reportId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.blob();
    } catch (error) {
      console.error('Failed to download report:', error);
      throw error;
    }
  }

  async viewReport(reportId) {
    try {
      const result = await this.request(`/reports/${reportId}`);
      return result || {};
    } catch (error) {
      console.error('Failed to view report:', error);
      return {};
    }
  }

  // Voice Notes endpoints
  async getVoiceNotes(type = null) {
    try {
      const url = type ? `/voice-notes?type=${type}` : '/voice-notes';
      const result = await this.request(url);
      return result || { notes: [] };
    } catch (error) {
      console.error('Failed to fetch voice notes:', error);
      return { notes: [] };
    }
  }

  async createVoiceNote(noteData) {
    return await this.request('/voice-notes/create', {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  }

  async deleteVoiceNote(noteId) {
    return await this.request(`/voice-notes/${noteId}`, {
      method: 'DELETE'
    });
  }

  async downloadVoiceNote(noteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/voice-notes/${noteId}/download`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.blob();
    } catch (error) {
      console.error('Failed to download voice note:', error);
      throw error;
    }
  }
}

const api = new ApiService();
export default api;