import api from './api';
import { setAccessToken, clearAccessToken } from './TokenService';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, User, ApiResponse } from '@/types';

class AuthServiceClass {
  getUserFromResponse(response: any): User | null {
    return (
      response?.data?.data?.user ??
      response?.data?.user ??
      response?.data?.data ??
      null
    );
  }

  async login(credentials: LoginDto): Promise<any> {
    const resp = await api.post('/auth/login', credentials);
    const accessToken =
      resp?.data?.data?.accessToken ||
      resp?.data?.accessToken ||
      resp?.data?.token ||
      null;

    if (accessToken) {
      setAccessToken(accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    return api.get('/auth/me');
  }

  async register(userData: RegisterDto): Promise<any> {
    const resp = await api.post('/auth/register', userData);
    const accessToken =
      resp?.data?.data?.accessToken ||
      resp?.data?.accessToken ||
      resp?.data?.token ||
      null;

    if (accessToken) {
      setAccessToken(accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    return resp;
  }

  async getMe(): Promise<any> {
    return api.get('/auth/me');
  }

  async logout(): Promise<any> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
      delete api.defaults.headers.common.Authorization;
    }
  }

  async refresh(): Promise<any> {
    const res = await api.post('/auth/refresh');
    const accessToken =
      res?.data?.data?.accessToken ||
      res?.data?.accessToken ||
      res?.data?.token ||
      null;

    if (accessToken) {
      setAccessToken(accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    return res;
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<ApiResponse> {
    const res = await api.post('/auth/forgot-password', data);
    return res.data;
  }

  async resetPassword(data: ResetPasswordDto): Promise<ApiResponse> {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  }
}

const AuthService = new AuthServiceClass();
export default AuthService;
