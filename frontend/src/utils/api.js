import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const requestId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
    config.headers['x-request-id'] = requestId;

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
