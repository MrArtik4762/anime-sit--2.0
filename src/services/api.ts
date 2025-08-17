import axios from 'axios';

const API_BASE = import.meta.env.VITE_ANILIBRIA_BASE || 'https://anilibria.top/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

api.interceptors.response.use(
  res => res,
  err => {
    // централизованная обработка ошибок
    if (err.response) {
      console.error('API error:', err.response.status, err.response.data);
    } else {
      console.error('Network error', err.message);
    }
    return Promise.reject(err);
  }
);

export default api;