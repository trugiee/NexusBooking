import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (idToken) => api.post('/auth/google', { idToken })
};

export const cottages = {
  getAll: () => api.get('/cottages')
};

export const addons = {
  getAll: () => api.get('/addons')
};

export const bookings = {
  getAll: () => api.get('/bookings'),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
  verifyPayment: (id) => api.post(`/bookings/${id}/verify-payment`)
};

export const payments = {
  createCheckout: (data) => api.post('/create-checkout', data)
};

export const admin = {
  getUsers: () => api.get('/users'),
  createStaff: (userData) => api.post('/admin/users', userData),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  createCottage: (data) => api.post('/admin/cottages', data),
  updateCottage: (id, data) => api.patch(`/admin/cottages/${id}`, data),
  deleteCottage: (id) => api.delete(`/admin/cottages/${id}`),
  createAddon: (data) => api.post('/admin/addons', data),
  updateAddon: (id, data) => api.patch(`/admin/addons/${id}`, data),
  deleteAddon: (id) => api.delete(`/admin/addons/${id}`)
};

export const users = {
  updateProfile: (data) => api.put('/users/profile', data)
};
