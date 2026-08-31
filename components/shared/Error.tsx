import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  const { t } = useTranslation('error');
  const displayMsg = message || t('something_went_wrong', 'Something went wrong :(');

  return (
    <div className="p-4 my-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center justify-between">
      <span>⚠️ {displayMsg}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-2.5 py-1 bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition ml-2 cursor-pointer"
        >
          {t('retry', 'Try Again')}
        </button>
      )}
    </div>
  );
};

export default Error;
