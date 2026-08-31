import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './TokenService';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
  ].some((path) => url.includes(path));
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config) return config;

    // Always enforce credentials for cross-origin cookie authentication
    config.withCredentials = true;

    if (!config.url) return config;

    if (config.url.includes('/auth/refresh')) {
      return config;
    }

    const token = getAccessToken();
    if (token && !isAuthEndpoint(config.url)) {
      if (typeof config.headers?.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || ({} as any);
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const isAuthRoute = isAuthEndpoint(originalRequest.url);

    if (!isUnauthorized || isAuthRoute || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken: string | null) => {
          if (!newToken) {
            return reject(error);
          }
          if (originalRequest.headers) {
            if (typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            } else {
              (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;
            }
          }
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshClient.post('/auth/refresh');
      const newToken: string | null =
        res?.data?.data?.accessToken ||
        res?.data?.accessToken ||
        res?.data?.token ||
        null;

      if (newToken) {
        setAccessToken(newToken);
        (api.defaults.headers.common as any)['Authorization'] = `Bearer ${newToken}`;
        onRefreshed(newToken);

        if (originalRequest.headers) {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          } else {
            (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;
          }
        }
        return api(originalRequest);
      } else {
        clearAccessToken();
        onRefreshed(null);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      clearAccessToken();
      onRefreshed(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
