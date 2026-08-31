import api from './api';
import { ApiResponse, NotificationsResponseData, NotificationItem } from '@/types';

class NotificationServiceClass {
  /**
   * Fetch stored notification history & unread badge count with pagination and optional unread filter
   */
  async getUserNotifications(query?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    read?: boolean;
  }): Promise<ApiResponse<NotificationsResponseData>> {
    const params: Record<string, any> = {
      page: query?.page || 1,
      limit: query?.limit || 20,
    };

    if (query?.unreadOnly !== undefined) {
      params.unreadOnly = query.unreadOnly;
    } else if (query?.read !== undefined) {
      params.read = query.read;
    }

    const queryStr = new URLSearchParams(params).toString();
    const res = await api.get(`/users/me/notifications${queryStr ? `?${queryStr}` : ''}`);
    return res.data;
  }

  /**
   * Mark a single notification item as read
   */
  async markAsRead(notificationId: number | string): Promise<ApiResponse<NotificationItem>> {
    const res = await api.patch(`/users/me/notifications/${notificationId}/read`);
    return res.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    const res = await api.patch('/users/me/notifications/read-all');
    return res.data;
  }
}

const NotificationService = new NotificationServiceClass();
export default NotificationService;
