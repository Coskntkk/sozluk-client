import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NotificationService from '@/services/NotificationService';
import { useSocket } from '@/context/SocketContext';
import Pagination from '@/components/shared/Pagination';
import { useTranslation } from 'react-i18next';
import { NotificationItem } from '@/types';
import moment from 'moment';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'unread';

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation('notifications');
  moment.locale(i18n.language);
  const router = useRouter();
  const { markAsRead: markContextRead, markAllAsRead: markContextAllRead, unreadCount } = useSocket();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const fetchPage = async (tab: TabType, page: number) => {
    try {
      setLoading(true);
      const res: any = await NotificationService.getUserNotifications({
        page,
        limit: 10,
        unreadOnly: tab === 'unread',
      });
      const data = res?.data?.data || res?.data || res;
      if (data) {
        setItems(data.notifications || []);
        const total = data.meta?.total ?? data.total ?? (data.notifications || []).length;
        const totalPages =
          data.meta?.totalPages ??
          data.totalPages ??
          Math.ceil(total / 10) ??
          1;

        setPagination({
          page: data.meta?.page ?? page,
          totalPages: totalPages > 0 ? totalPages : 1,
          total,
          limit: 10,
        });
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPage(activeTab, 1);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchPage(activeTab, newPage);
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.read && item.id) {
      try {
        await NotificationService.markAsRead(item.id);
        markContextRead(item.id);
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
      } catch {
        // Ignore
      }
    }

    onClose();

    if (item.link) {
      const destination = item.link.startsWith('/titles/')
        ? item.link.replace('/titles/', '/t/')
        : item.link;
      router.push(destination);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markContextAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      if (activeTab === 'unread') {
        fetchPage('unread', 1);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col max-h-[85vh] border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🔔</span>
              <span>{t('all_notifications', 'All Notifications')}</span>
            </h2>
            {unreadCount > 0 && (
              <span className="text-[11px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                {unreadCount} {t('unread', 'unread')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition cursor-pointer"
              >
                {t('mark_all_read', 'Mark all read')}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 text-base leading-none p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-3 px-6 pt-3 border-b border-gray-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300'
                : 'border-transparent text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {t('all_notifications', 'All Notifications')}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('unread')}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'unread'
                ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-300'
                : 'border-transparent text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {t('unread_only', 'Unread Only')} ({unreadCount})
          </button>
        </div>

        {/* Notifications Scroll List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-gray-50 dark:divide-slate-800 min-h-[250px]">
          {loading ? (
            <div className="py-16 text-center text-xs text-gray-400 dark:text-slate-500">
              {t('loading', 'Loading notifications...')}
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 dark:text-slate-500 space-y-1">
              <span className="text-2xl block">📭</span>
              <p>
                {activeTab === 'unread'
                  ? t('no_unread', 'No unread notifications right now.')
                  : t('no_history', 'No notifications found in your history.')}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`py-3.5 px-3 rounded-xl transition cursor-pointer flex items-start gap-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/80 ${
                  !item.read ? 'bg-sky-50/50 dark:bg-sky-950/40 font-medium' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">
                  {item.type === 'vote'
                    ? '👍'
                    : item.type === 'entry'
                    ? '✍️'
                    : item.type === 'follow'
                    ? '👥'
                    : '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${!item.read ? 'text-gray-900 dark:text-slate-100 font-semibold' : 'text-gray-600 dark:text-slate-400'}`}>
                    {item.message}
                  </p>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 block">
                    {moment(item.createdAt).format('DD.MM.YYYY HH:mm')} ({moment(item.createdAt).fromNow()})
                  </span>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400 shrink-0 mt-2" title={t('unread', 'Unread')} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer with Pagination */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 dark:text-slate-500">
            {t('total', 'Total')}: {pagination.total}
          </span>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
