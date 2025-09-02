 // api.jsx
import axios from 'axios'

// Backend API base URL
const API_BASE_URL = 'http://localhost:5001/api/auth'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getProfile: () => api.get('/me'),
}

export default api
