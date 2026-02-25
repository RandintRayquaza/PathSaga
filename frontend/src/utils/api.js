import axios from 'axios';
import { store } from '../redux/store'; // assuming store is exported from here

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    // Get the auth state directly from the Redux store
    const state = store.getState();
    const token = state.auth.user?.token || state.auth.user?.stsTokenManager?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 60;
      console.warn(`[API] Rate limited. Try again in ${retryAfter}s.`);
    } else {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
