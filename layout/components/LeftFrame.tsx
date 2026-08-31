import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TitleService from '@/services/TitleService';
import ErrorBoundary from '@/layout/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { Title } from '@/types';

const LeftFrame: React.FC = () => {
  const { t } = useTranslation('leftframe');
  const router = useRouter();
  const currentSlug = router.query.slug as string;

  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ isError: false, message: '' });

  const fetchAgenda = () => {
    setLoading(true);
    setError({ isError: false, message: '' });

    TitleService.getTitles({ limit: 20, sort: 'updatedAt', order: 'desc' })
      .then((resp) => {
        const data: any = resp.data;
        const items: Title[] = Array.isArray(data)
          ? data
          : data?.titles || data?.data?.titles || data?.items || [];
        setTitles(items.slice(0, 20));
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || 'Failed to load agenda.',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  return (
    <aside className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden sticky top-20 transition-colors duration-200">
      {/* Agenda Header */}
      <div className="p-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔥</span>
            <span>{t('agenda', 'Agenda')}</span>
          </h2>
          <button
            type="button"
            onClick={fetchAgenda}
            title="Refresh agenda"
            className="text-gray-400 dark:text-gray-500 hover:text-sky-600 dark:hover:text-sky-400 text-xs transition cursor-pointer"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Agenda Topics List (Max 20 with Latest Entry Counts) */}
      <ErrorBoundary error={error} loading={loading} onRetry={fetchAgenda}>
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
          {titles.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">
              {t('no_topics', 'No topics found')}
            </div>
          ) : (
            titles.map((item) => {
              const isSelected = currentSlug === item.slug;
              const count =
                item.todayEntryCount ||
                item.totalEntryCount ||
                item.entryCount ||
                item.entry_count ||
                0;

              return (
                <Link
                  key={item.id}
                  href={`/t/${item.slug}`}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition group ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate pr-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                    {item.name}
                  </span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                        isSelected
                          ? 'bg-sky-200 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 group-hover:bg-sky-100 dark:group-hover:bg-sky-950 group-hover:text-sky-700 dark:group-hover:text-sky-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </ErrorBoundary>
    </aside>
  );
};

export default LeftFrame;
