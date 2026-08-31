import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  size?: 'small' | 'medium' | 'large';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'medium',
}) => {
  const { t } = useTranslation('pagination');
  if (totalPages <= 1) return null;

  if (size === 'small') {
    return (
      <div className="flex justify-center items-center gap-1.5 mt-3 text-xs">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2 py-0.5 border border-gray-200 dark:border-slate-700 rounded-md disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition cursor-pointer"
        >
          ‹
        </button>
        <span className="px-2 text-gray-500 dark:text-slate-400 font-medium text-[11px]">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2 py-0.5 border border-gray-200 dark:border-slate-700 rounded-md disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition cursor-pointer"
        >
          ›
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3.5 py-1.5 text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
      >
        {t('prev', 'Previous')}
      </button>
      <span className="px-3 py-1.5 text-xs text-gray-600 dark:text-slate-400 font-medium">
        {t('page', 'Page')} {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3.5 py-1.5 text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
      >
        {t('next', 'Next')}
      </button>
    </div>
  );
};

export default Pagination;
