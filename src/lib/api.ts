import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Intentar leer token directo o desde las distintas keys de zustand
      const directToken = localStorage.getItem('token') || localStorage.getItem('access_token');
      const authStorage = localStorage.getItem('auth-storage');
      let token = directToken;

      if (!token && authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token =
            parsed?.state?.token ||
            parsed?.state?.accessToken ||
            parsed?.state?.access_token ||
            parsed?.token ||
            parsed?.accessToken ||
            parsed?.access_token;
        } catch (e) {
          console.error('Error parseando auth-storage', e);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// QUITAMOS EL REDIRECT AUTOMÁTICO EN 401 PARA EVITAR QUE BORRE EL LOCALSTORAGE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Respuesta de error en API:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;