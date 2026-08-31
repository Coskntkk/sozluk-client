export interface NotificationItem {
  id: number;
  userId: number;
  message: string;
  link?: string;
  read: boolean;
  type?: 'vote' | 'entry' | 'follow' | 'system' | string;
  data?: {
    entryId?: number;
    topicId?: number;
    topicName?: string;
    topicSlug?: string;
    followerId?: number;
    username?: string;
    voteValue?: number;
    link?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationPayload {
  id?: number;
  message: string;
  type: 'vote' | 'entry' | 'follow' | 'system' | string;
  data?: {
    entryId?: number;
    topicId?: number;
    topicName?: string;
    topicSlug?: string;
    followerId?: number;
    username?: string;
    voteValue?: number;
    link?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface NotificationsResponseData {
  notifications: NotificationItem[];
  unreadCount: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
