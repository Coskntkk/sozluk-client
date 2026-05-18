import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './TokenService';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: `${apiUrl}/api/v1`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshPromise = null;

const isAuthEndpoint = (url) => {
    if (!url) return false;
    return [
        '/auth/login',
        '/auth/register',
        '/auth/refresh',
    ].some(path => url.includes(path));
};

const getStoredAccessToken = () => getAccessToken();

api.interceptors.request.use(
    async (config) => {
        if (!config || !config.url) return config;

        if (config.url.includes('/auth/refresh')) {
            return config;
        }

        if (isRefreshing && refreshPromise) {
            try {
                await refreshPromise;
            } catch (err) {
                // If refresh failed, continue so the original request can fail cleanly.
            }
        }

        const token = getStoredAccessToken();
        if (token && !isAuthEndpoint(config.url)) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (requestError) => Promise.reject(requestError)
);

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        const expiredMessage = error.response?.data?.message === 'Access token expired';
        const isUnauthorized = error.response?.status === 401;

        if (!isUnauthorized || !expiredMessage) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshClient.post('/auth/refresh')
                .then((res) => {
                    const newToken = res?.data?.accessToken || res?.data?.token || null;
                    if (newToken) {
                        setAccessToken(newToken);
                        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                    }
                    return newToken;
                })
                .catch((refreshError) => {
                    clearAccessToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                    throw refreshError;
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        try {
            const newToken = await refreshPromise;
            if (newToken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

// Create a separate axios instance to call refresh endpoint without interceptors
const refreshClient = axios.create({
    baseURL: api.defaults.baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

export default api;
