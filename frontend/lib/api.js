const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

console.log('API Base URL:', API_BASE_URL)

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const api = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  },

  googleLogin() {
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      return await response.json()
    } catch (error) {
      console.error('Logout API error:', error)
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Register API error:', error)
      throw error
    }
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test`)
      return await response.json()
    } catch (error) {
      console.error('Connection test failed:', error)
      throw error
    }
  }
}