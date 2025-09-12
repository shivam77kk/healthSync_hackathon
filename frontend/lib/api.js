const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Login API error:', error)
      // Fallback to mock for development
      return { success: true, token: 'mock-token' }
    }
  },
  
  register: async (userData) => {
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
      // Fallback to mock for development
      return { success: true, user: { name: userData.name, email: userData.email } }
    }
  },
  
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      return { success: true }
    } catch (error) {
      console.error('Logout API error:', error)
      return { success: true }
    }
  }
}

export const userAPI = {
  register: async (userData) => {
    return api.register(userData)
  }
}