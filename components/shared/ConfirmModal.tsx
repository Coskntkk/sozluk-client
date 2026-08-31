import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('confirm');
  if (!isOpen) return null;

  const resolvedConfirmText = confirmText || t('confirm', 'Confirm');
  const resolvedCancelText = cancelText || t('cancel', 'Cancel');

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-300 dark:focus:ring-rose-900';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-300 dark:focus:ring-amber-900';
      case 'primary':
      default:
        return 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-300 dark:focus:ring-sky-900';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'primary':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-gray-100 dark:border-slate-800 transform transition-all scale-100">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 leading-snug">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            {resolvedCancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition focus:outline-none focus:ring-2 disabled:opacity-50 shadow-sm cursor-pointer ${getConfirmButtonClasses()}`}
          >
            {loading ? t('processing', 'Processing...') : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
