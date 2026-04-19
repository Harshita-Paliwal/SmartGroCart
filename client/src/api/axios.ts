import axios from 'axios';

const api = axios.create({ baseURL: '/api' });
let authToken: string | null = null;

/**
 * Stores the in-memory auth token used by request interceptors.
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

/**
 * Returns the current auth token for context bootstrapping checks.
 */
export const getAuthToken = () => authToken;

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    authToken = null;
    window.location.href = '/';
  }

  return Promise.reject(error);
});

export default api;
