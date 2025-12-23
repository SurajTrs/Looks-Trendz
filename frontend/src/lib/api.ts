import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
}

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
}

// Bookings API
export const bookingsAPI = {
  getAvailability: (params: any) => api.get('/bookings/availability', { params }),
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  updateStatus: (id: string, status: string) => 
    api.patch(`/bookings/${id}/status`, { status }),
}

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getBookings: (params: any) => api.get('/admin/bookings', { params }),
  getCustomers: (params: any) => api.get('/admin/customers', { params }),
  getReports: (params: any) => api.get('/admin/reports/revenue', { params }),
}

// Payments API
export const paymentsAPI = {
  createIntent: (data: any) => api.post('/payments/create-intent', data),
}