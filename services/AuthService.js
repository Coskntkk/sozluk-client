import api from './api';
import { setAccessToken, clearAccessToken } from './TokenService';

function getUserFromResponse(response) {
    return response.data?.data?.user ?? response.data?.user;
}

class AuthServiceClass {
    async login(credentials) {
        const resp = await api.post('/auth/login', credentials);
        const accessToken = resp?.data?.accessToken || resp?.data?.token || null;
        if (accessToken) {
            setAccessToken(accessToken);
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
        return api.get('/auth/me');
    }

    async register(userData) {
        const resp = await api.post('/auth/register', userData);
        const accessToken = resp?.data?.accessToken || resp?.data?.token || null;
        if (accessToken) {
            setAccessToken(accessToken);
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
        return resp;
    }

    async getMe() {
        return api.get('/auth/me');
    }

    async logout() {
        clearAccessToken();
        return api.get('/auth/logout');
    }

    async refresh() {
        const res = await api.post('/auth/refresh');
        const accessToken = res?.data?.accessToken || res?.data?.token || null;
        if (accessToken) {
            setAccessToken(accessToken);
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
        return res;
    }

    getUserFromResponse(response) {
        return getUserFromResponse(response);
    }
}

const AuthService = new AuthServiceClass();
export default AuthService;
