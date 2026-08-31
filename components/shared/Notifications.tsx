import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/tr';
import 'moment/locale/fr';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import NotificationsModal from './NotificationsModal';
import { NotificationItem } from '@/types';

const Notifications: React.FC = () => {
  const { t, i18n } = useTranslation('notifications');
  moment.locale(i18n.language);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifications, unreadCount, totalCount, loading, markAsRead, markAllAsRead } = useSocket();

  // Show top 5 latest notifications in sidebar widget
  const topNotifications = notifications.slice(0, 5);

  const handleClick = async (notif: NotificationItem) => {
    if (!notif.read && notif.id) {
      await markAsRead(notif.id);
    }

    if (notif.link) {
      const destination = notif.link.startsWith('/titles/')
        ? notif.link.replace('/titles/', '/t/')
        : notif.link;
      router.push(destination);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border border-gray-100 dark:border-slate-800 rounded-xl w-full max-w-sm mt-4 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200">
              🔔 {t('notifications', 'Notifications')}
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List (Top 5) */}
        {loading && topNotifications.length === 0 ? (
          <div className="py-4 text-center text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/40 rounded-lg">
            Loading notifications...
          </div>
        ) : topNotifications.length === 0 ? (
          <div className="py-4 text-center text-xs text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-800/40 rounded-lg">
            {t('no_notifications', 'No notifications yet')}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-slate-800 max-h-64 overflow-y-auto">
            {topNotifications.map((notif) => (
              <li
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`py-2.5 px-2 rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-slate-800 flex flex-col gap-0.5 ${
                  !notif.read ? 'bg-sky-50/60 dark:bg-sky-950/40 font-semibold' : 'text-gray-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-gray-800 dark:text-slate-200 line-clamp-2">
                    {t(notif.message, notif.message)}
                  </span>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1" />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">
                  {moment(notif.createdAt).fromNow()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer Link to Open Paginated Modal */}
        <div className="pt-3 mt-2 border-t border-gray-50 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 transition flex items-center justify-center gap-1 w-full py-1 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span>View all history {totalCount > 0 ? `(${totalCount})` : ''}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Paginated Full Notifications Modal */}
      <NotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Notifications;
