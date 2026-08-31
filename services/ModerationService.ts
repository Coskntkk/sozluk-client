import api from './api';
import {
  ApiResponse,
  PaginatedResponse,
  Report,
  RookieEntry,
  UpdateReportDto,
  UpdateUserRoleDto,
  ReportStatusId,
  AdminStats,
  User,
} from '@/types';

class ModerationServiceClass {
  // Reports
  async getReports(query?: {
    page?: number;
    limit?: number;
    statusId?: ReportStatusId | number;
  }): Promise<ApiResponse<PaginatedResponse<Report>>> {
    const queryStr = new URLSearchParams(query as any).toString();
    const res = await api.get(`/moderation/reports?${queryStr}`);
    return res.data;
  }

  async updateReport(
    reportId: number | string,
    dto: UpdateReportDto
  ): Promise<ApiResponse<Report>> {
    const res = await api.patch(`/moderation/reports/${reportId}`, dto);
    return res.data;
  }

  // Rookie Queue
  async getRookieEntries(query?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<RookieEntry>>> {
    const queryStr = new URLSearchParams(query as any).toString();
    const res = await api.get(`/moderation/rookies/entries?${queryStr}`);
    return res.data;
  }

  async approveRookieEntry(entryId: number | string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/moderation/rookies/entries/${entryId}/approve`);
    return res.data;
  }

  async promoteRookie(userId: number | string): Promise<ApiResponse<any>> {
    const res = await api.post(`/moderation/rookies/${userId}/promote`);
    return res.data;
  }

  // Admin Role Mutation
  async updateUserRole(
    userId: number | string,
    dto: UpdateUserRoleDto
  ): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/users/${userId}/role`, dto);
    return res.data;
  }

  // Admin System Stats
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    const res = await api.get('/admin/stats');
    return res.data;
  }

  // Admin Moderator Management
  async getModerators(): Promise<ApiResponse<User[]>> {
    const res = await api.get('/admin/moderators');
    return res.data;
  }

  async addModerator(username: string): Promise<ApiResponse<any>> {
    const res = await api.post('/admin/moderators', { username });
    return res.data;
  }

  async removeModerator(idOrUsername: string | number): Promise<ApiResponse<any>> {
    const res = await api.delete(`/admin/moderators/${idOrUsername}`);
    return res.data;
  }
}

const ModerationService = new ModerationServiceClass();
export default ModerationService;
