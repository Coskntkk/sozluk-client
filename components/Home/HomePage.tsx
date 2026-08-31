import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TitleHeader from '@/components/shared/TitleHeader';
import EntryList from '@/components/shared/EntryList';
import ErrorBoundary from '@/layout/ErrorBoundary';
import HomeService from '@/services/HomeService';
import CreateEntry from '@/components/shared/CreateEntry';
import { useTranslation } from 'react-i18next';
import { Title, Entry } from '@/types';

interface HomePageProps {
  initialTitle?: Title | null;
  initialEntries?: Entry[];
  initialError?: string;
}

const HomePage: React.FC<HomePageProps> = ({
  initialTitle = null,
  initialEntries = [],
  initialError,
}) => {
  const { t } = useTranslation('home_page');
  const [title, setTitle] = useState<Title | null>(initialTitle);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [loading, setLoading] = useState(!initialTitle && !initialError);
  const [error, setError] = useState({
    isError: !!initialError,
    message: initialError || '',
  });

  const getData = () => {
    setLoading(true);
    HomeService.getLatestTopic()
      .then((resp) => {
        setTitle(resp.data.title);
        setEntries(resp.data.items || []);
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || 'Failed to load topic.',
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialTitle) {
      getData();
    }
  }, []);

  return (
    <ErrorBoundary error={error} loading={loading} onRetry={getData}>
      {title && (
        <section className="space-y-4 transition-colors duration-200">
          <TitleHeader
            title={title.name}
            count={entries.length}
            description={`Explore live discussions and popular entries for ${title.name} on Sözlük.`}
          />

          <EntryList entries={entries} onDeleted={getData} />

          {title.slug && (
            <div className="flex justify-end pt-2">
              <Link
                href={`/t/${title.slug}`}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 hover:underline"
              >
                {t('see_all_entries', 'View full topic & all entries →')}
              </Link>
            </div>
          )}

          {title.id > 0 && <CreateEntry titleId={title.id} onEntryCreated={getData} />}
        </section>
      )}
    </ErrorBoundary>
  );
};

export default HomePage;
