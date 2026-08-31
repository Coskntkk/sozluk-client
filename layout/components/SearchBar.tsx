import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import TitleService from '@/services/TitleService';
import { useTranslation } from 'react-i18next';
import { Title } from '@/types';
import { slugifyTopic } from '@/utils/bkzParser';

const SearchBar: React.FC = () => {
  const { t } = useTranslation('search');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Title[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const redirectToTitle = (slug: string, titleName?: string) => {
    setSearchTerm('');
    setShowDropdown(false);
    router.push({
      pathname: `/t/${encodeURIComponent(slug)}`,
      query: titleName ? { titleName } : undefined,
    });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    redirectToTitle(slugifyTopic(query), query);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await TitleService.searchTitles(searchTerm.trim());
        const data: any = response.data;
        const items = Array.isArray(data)
          ? data
          : data?.titles || data?.data?.titles || data?.items || [];
        setSuggestions(items);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-lg" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            id="navbar-search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={t('placeholder', 'Search topics or enter new topic...')}
            className="w-full rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-4 pr-10 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-950 transition"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition p-1 cursor-pointer"
          >
            🔍
          </button>
        </div>
      </form>

      {showDropdown && searchTerm.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden divide-y divide-gray-50 dark:divide-slate-800">
          {loadingSuggestions ? (
            <div className="px-4 py-3 text-xs text-gray-400 dark:text-slate-500">
              {t('searching', 'Searching topics...')}
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => redirectToTitle(item.slug, item.name)}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span className="font-medium">{item.name}</span>
                  {(item.totalEntryCount ?? item.entryCount ?? item.entry_count) !== undefined && (
                    <span className="text-[10px] text-gray-400 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {item.totalEntryCount ?? item.entryCount ?? item.entry_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => redirectToTitle(slugifyTopic(searchTerm), searchTerm.trim())}
              className="w-full text-left px-4 py-3 text-xs text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {t('start_new_topic', 'Start new topic')}: <strong className="font-semibold">&ldquo;{searchTerm.trim()}&rdquo;</strong>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
