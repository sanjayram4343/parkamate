import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const parkingAPI = {
  getSlots: () => api.get('/parking/slots'),
  bookSlot: (slotId, bookingData) => api.post(`/parking/slots/${slotId}/book`, bookingData),
  releaseSlot: (slotId) => api.post(`/parking/slots/${slotId}/release`),
  getRecords: () => api.get('/parking/records'),
  getSlotDetails: (slotId) => api.get(`/parking/slots/${slotId}`),
};

export default api;