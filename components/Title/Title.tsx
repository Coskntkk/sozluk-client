import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TitleService from '@/services/TitleService';
import TitleHeader from '@/components/shared/TitleHeader';
import EntryList from '@/components/shared/EntryList';
import Pagination from '@/components/shared/Pagination';
import CreateEntry from '@/components/shared/CreateEntry';
import CreateEntryAndTitle from '@/components/shared/CreateEntryAndTitle';
import ErrorBoundary from '@/layout/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { Title as TitleType, Entry } from '@/types';

interface TitleProps {
  slug: string;
  initialData?: any;
  initialNotFound?: boolean;
  initialError?: string;
  initialPage?: number;
}

const Title: React.FC<TitleProps> = ({
  slug,
  initialData,
  initialNotFound = false,
  initialError,
  initialPage = 1,
}) => {
  const { t } = useTranslation('title_page');
  const router = useRouter();
  const titleNameQuery = router.query.titleName as string;
  const queryPage = Number(router.query.page || router.query.p) || initialPage;

  // Initialize state directly from SSR props if available
  const initialTopic: TitleType | null = initialData?.title || (initialData?.id ? initialData : null);
  const initialEntries: Entry[] = Array.isArray(initialData?.entries)
    ? initialData.entries
    : Array.isArray(initialData?.entries?.items)
    ? initialData.entries.items
    : Array.isArray(initialData?.items)
    ? initialData.items
    : [];

  const initialMeta = initialData?.meta || initialData?.entries?.meta || {};
  const initialTotal = initialMeta.total ?? initialData?.total ?? initialEntries.length;
  const initialTotalPages =
    initialMeta.totalPages ??
    initialData?.totalPages ??
    Math.ceil(initialTotal / (initialMeta.limit || 10)) ??
    1;

  const [title, setTitle] = useState<TitleType | null>(initialTopic);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [loading, setLoading] = useState(!initialData && !initialNotFound && !initialError);
  const [titleNotFound, setTitleNotFound] = useState(initialNotFound);
  const [pagination, setPagination] = useState({
    page: initialMeta.page ?? queryPage,
    totalPages: initialTotalPages > 0 ? initialTotalPages : 1,
    total: initialTotal,
    limit: initialMeta.limit ?? 10,
  });
  const [error, setError] = useState({
    isError: !!initialError,
    message: initialError || '',
  });

  const getData = (topicSlug: string, limit: number, page: number) => {
    if (!topicSlug) return;
    setLoading(true);
    setError({ isError: false, message: '' });

    TitleService.getTitle(topicSlug, { page, limit })
      .then((resp: any) => {
        const payload = resp?.data || resp || {};
        const data = payload?.data || payload;

        const topicData: TitleType = data.title || data;
        const entryItems: Entry[] = Array.isArray(data.entries)
          ? data.entries
          : Array.isArray(data.entries?.items)
          ? data.entries.items
          : Array.isArray(data.items)
          ? data.items
          : [];

        setTitle(topicData);
        setEntries(entryItems);
        setTitleNotFound(false);

        const meta = data.meta || data.entries?.meta || {};
        const total = meta.total ?? data.total ?? data.entries?.total ?? entryItems.length;
        const totalPages =
          meta.totalPages ??
          data.totalPages ??
          data.entries?.totalPages ??
          Math.ceil(total / (meta.limit || data.limit || limit)) ??
          1;

        setPagination({
          page: meta.page ?? data.page ?? page,
          totalPages: totalPages > 0 ? totalPages : 1,
          total,
          limit: meta.limit ?? data.limit ?? limit,
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setTitleNotFound(true);
          setTitle({
            id: 0,
            name: titleNameQuery || topicSlug.replace(/-/g, ' '),
            slug: topicSlug,
            createdAt: new Date().toISOString(),
          });
          setEntries([]);
          setError({ isError: false, message: '' });
        } else {
          setError({
            isError: true,
            message: err.response?.data?.message || 'Failed to load topic.',
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const onPaginationChange = (newPage: number) => {
    if (newPage === pagination.page || newPage < 1 || newPage > pagination.totalPages) {
      return;
    }

    setPagination((prev) => ({ ...prev, page: newPage }));
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }
    );
    getData(slug, pagination.limit, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (slug) {
      const pageToFetch = Number(router.query.page || router.query.p) || 1;
      // If we don't have initialData matching this page, fetch it
      if (!initialData || pageToFetch !== initialPage) {
        getData(slug, 10, pageToFetch);
      }
    }
  }, [slug, router.query.page, router.query.p]);

  const displayName = title?.name || titleNameQuery || slug?.replace(/-/g, ' ') || '';

  return (
    <ErrorBoundary
      error={error}
      loading={loading}
      onRetry={() => getData(slug, pagination.limit, pagination.page)}
    >
      <section className="space-y-4">
        <TitleHeader
          title={displayName}
          count={titleNotFound ? 0 : pagination.total || entries.length}
          description={`Read entries and discussions about ${displayName}`}
        />

        {titleNotFound ? (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-sm text-center space-y-1 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                {t('topic_not_exist', "This topic doesn't exist yet.")}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {t('be_the_first', 'Be the first to write an entry and start the discussion.')}
              </p>
            </div>
            <CreateEntryAndTitle titleName={displayName} />
          </div>
        ) : (
          <>
            {/* Top Pagination when multiple pages exist */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-end pb-1">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPaginationChange}
                  size="small"
                />
              </div>
            )}

            <EntryList
              entries={entries}
              onDeleted={() => getData(slug, pagination.limit, pagination.page)}
            />

            {/* Bottom Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPaginationChange}
            />

            {title?.id ? (
              <CreateEntry
                titleId={title.id}
                onEntryCreated={() => getData(slug, pagination.limit, pagination.page)}
              />
            ) : null}
          </>
        )}
      </section>
    </ErrorBoundary>
  );
};

export default Title;
