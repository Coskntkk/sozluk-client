import api from './api';
import { ApiResponse, PaginatedResponse, UserProfile, Entry, UpdateUserDto } from '@/types';

class UserServiceClass {
  async getUser(username: string): Promise<ApiResponse<UserProfile>> {
    const res = await api.get(`/users/${username}`);
    return res.data;
  }

  async getUserEntries(
    username: string,
    query?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<Entry>>> {
    const queryStr = new URLSearchParams(query as any).toString();
    const res = await api.get(`/users/${username}/entries?${queryStr}`);
    return res.data;
  }

  async getUserVotes(
    username: string,
    query?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<Entry>>> {
    const queryStr = new URLSearchParams(query as any).toString();
    const res = await api.get(`/users/${username}/votes?${queryStr}`);
    return res.data;
  }

  async followUser(username: string): Promise<ApiResponse<any>> {
    const res = await api.post(`/users/${username}/follow`);
    return res.data;
  }

  async unfollowUser(username: string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/users/${username}/follow`);
    return res.data;
  }

  async updateMe(data: UpdateUserDto): Promise<ApiResponse<UserProfile>> {
    const res = await api.put('/users/me', data);
    return res.data;
  }
}

const UserService = new UserServiceClass();
export default UserService;
