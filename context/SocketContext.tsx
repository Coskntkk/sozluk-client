import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SocketService from '@/services/SocketService';
import NotificationService from '@/services/NotificationService';
import { infoNote } from '@/utils/ToastNotify';
import { NotificationItem, NotificationPayload } from '@/types';

interface SocketContextValue {
  socketService: typeof SocketService;
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  loading: boolean;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const SocketContext = createContext<SocketContextValue>({
  socketService: SocketService,
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  loading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  refreshNotifications: async () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const lastNotifiedRef = useRef<Map<string, number>>(new Map());

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      const res: any = await NotificationService.getUserNotifications({ page: 1, limit: 20 });
      const data = res?.data?.data || res?.data || res;
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount ?? 0);
        setTotalCount(data.meta?.total ?? data.total ?? (data.notifications || []).length);
      }
    } catch {
      // Ignored if unauthenticated or network error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // 1. Immediately populate stored previous notifications on login / mount
      fetchHistory();

      // 2. Connect socket and listen strictly for live incoming updates
      SocketService.connect();

      const unsubscribe = SocketService.onNotification((payload: NotificationPayload) => {
        if (!payload?.message) return;

        const notifKey = payload.id
          ? `notif-${payload.id}`
          : `notif-${payload.message}-${payload.createdAt || ''}`;

        const now = Date.now();
        const lastTime = lastNotifiedRef.current.get(notifKey) || 0;

        // Prevent duplicate toasts within 3s window
        if (now - lastTime < 3000) {
          return;
        }
        lastNotifiedRef.current.set(notifKey, now);

        // Prepend new incoming notification
        const newItem: NotificationItem = {
          id: payload.id || Date.now(),
          userId: user.id || 0,
          message: payload.message,
          link: payload.data?.link,
          read: false,
          type: payload.type,
          data: payload.data,
          createdAt: payload.createdAt || new Date().toISOString(),
        };

        setNotifications((prev) => [newItem, ...prev.slice(0, 49)]);
        setUnreadCount((prev) => prev + 1);
        setTotalCount((prev) => prev + 1);

        // Show live toast banner
        infoNote(`🔔 ${payload.message}`, notifKey);
      });

      // 3. Cleanup on unmount / logout
      return () => {
        unsubscribe();
        SocketService.disconnect();
      };
    } else {
      SocketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      setTotalCount(0);
    }
  }, [isAuthenticated, user, fetchHistory]);

  const markAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socketService: SocketService,
        notifications,
        unreadCount,
        totalCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchHistory,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
