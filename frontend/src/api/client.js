import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('repair_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('repair_token');
      localStorage.removeItem('repair_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }
    if (!error.config?.silent) toast.error(error.response?.data?.message || 'Request failed');
    return Promise.reject(error);
  },
);
export default api;
