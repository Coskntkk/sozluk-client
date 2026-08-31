import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

interface TitleHeaderProps {
  title: string;
  count?: number;
  description?: string;
  canonicalUrl?: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, count, description, canonicalUrl }) => {
  const { t } = useTranslation('title_page');
  const pageDescription = description || `${title} topic discussions, thoughts and entries on Sözlük platform.`;

  return (
    <>
      <Head>
        <title>{`${title} - Sözlük`}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`${title} - Sözlük`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Sözlük" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${title} - Sözlük`} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>
      <header className="flex items-baseline justify-between border-b border-gray-100 dark:border-slate-800 pb-3 mb-4 transition-colors duration-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
        {typeof count === 'number' && (
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-transparent dark:border-slate-700/60">
            {count} {count === 1 ? t('entry', 'entry') : t('entries', 'entries')}
          </span>
        )}
      </header>
    </>
  );
};

export default TitleHeader;
