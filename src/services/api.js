import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const baseConfig = {
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
};

/** Client sans intercepteur : login et refresh uniquement (évite les boucles). */
export const authClient = axios.create(baseConfig);

/** Client principal, avec JWT automatique et refresh transparent. */
const api = axios.create(baseConfig);

let handlers = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  onTokenRefreshed: () => {},
  onSessionExpired: () => {},
};

/** Appelé par authStore pour brancher l'API sur la session (évite un import circulaire). */
export function configureApi(next) {
  handlers = { ...handlers, ...next };
}

api.interceptors.request.use((config) => {
  const token = handlers.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = handlers.getRefreshToken();
  if (!refresh) throw new Error('NO_REFRESH_TOKEN');
  const { data } = await authClient.post('/auth/token/refresh/', { refresh });
  handlers.onTokenRefreshed(data.access, data.refresh);
  return data.access;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        handlers.onSessionExpired();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
