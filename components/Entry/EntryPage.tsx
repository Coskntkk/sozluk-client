import React, { useState, useEffect } from 'react';
import TitleHeader from '@/components/shared/TitleHeader';
import ErrorBoundary from '@/layout/ErrorBoundary';
import EntryService from '@/services/EntryService';
import Entry from '@/components/shared/Entry';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Entry as EntryType } from '@/types';

interface EntryPageProps {
  id: string | number;
  initialEntry?: EntryType | null;
  initialError?: string;
}

const EntryPage: React.FC<EntryPageProps> = ({ id, initialEntry = null, initialError }) => {
  const { t } = useTranslation('entry_page');
  const [entry, setEntry] = useState<EntryType | null>(initialEntry);
  const [loading, setLoading] = useState(!initialEntry && !initialError);
  const [error, setError] = useState({
    isError: !!initialError,
    message: initialError || '',
  });

  const getData = () => {
    if (!id) return;
    setLoading(true);
    setError({ isError: false, message: '' });

    EntryService.getEntry(id)
      .then((resp: any) => {
        const data = resp?.data?.data || resp?.data || resp;
        setEntry(data);
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || 'Entry not found.',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id && !initialEntry) {
      getData();
    }
  }, [id]);

  const authorName = entry?.author?.username || entry?.user?.username || 'user';
  const topicTitle = entry?.title?.name || `Entry #${id}`;
  const entrySnippet = entry?.message ? `${entry.message.slice(0, 150)}...` : `Entry #${id} by ${authorName}`;

  return (
    <ErrorBoundary error={error} loading={loading} onRetry={getData}>
      {entry && (
        <section className="space-y-4">
          <TitleHeader
            title={topicTitle}
            description={`${entrySnippet} — Entry by @${authorName}`}
          />

          <Entry entry={entry} onDeleted={getData} />

          {entry.title && (
            <div className="flex justify-end pt-2">
              <Link
                href={`/t/${entry.title.slug}`}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
              >
                {t('go_to_title', 'View all entries under this topic →')}
              </Link>
            </div>
          )}
        </section>
      )}
    </ErrorBoundary>
  );
};

export default EntryPage;
