import axios from 'axios';

// Create a base URL depending on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://server.brtmultisoft.com' // Production server URL from env or fallback
  : ''; // In development, use the proxy from package.json

// Create an axios instance with the base URL
const api = axios.create({
  baseURL
});

// Add a request interceptor to set the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
