import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';
import EntryService from '@/services/EntryService';
import ConfirmModal from './ConfirmModal';
import { successNote, errorNote } from '@/utils/ToastNotify';
import { Entry } from '@/types';

interface EntryActionsProps {
  entry: Entry;
  isOwner?: boolean;
  onDeleted?: (entryId: number) => void;
}

const EntryActions: React.FC<EntryActionsProps> = ({ entry, isOwner, onDeleted }) => {
  const { t } = useTranslation('entry_actions');
  const { isAuthenticated, roleId } = useSelector((state: RootState) => state.auth);
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Guests cannot report or delete
  if (!isAuthenticated || entry.deletedAt) {
    return null;
  }

  // Moderator or Admin can also delete
  const canDelete = isOwner || (roleId && roleId >= 3);

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await EntryService.deleteEntry(entry.id);
      successNote(t('deleted_successfully', 'Entry deleted successfully'));
      setIsDeleting(false);
      if (onDeleted) onDeleted(entry.id);
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to delete entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) {
      errorNote(t('note_required', 'Please provide a reason for the report'));
      return;
    }

    setSubmitting(true);
    try {
      await EntryService.reportEntry(entry.id, reportNote.trim());
      successNote(t('reported_successfully', 'Report submitted to moderation'));
      setIsReporting(false);
      setReportNote('');
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 text-xs">
        {canDelete && (
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
            title={t('delete', 'Delete')}
          >
            {t('delete', 'delete')}
          </button>
        )}

        {!isOwner && (
          <button
            type="button"
            onClick={() => setIsReporting(true)}
            className="text-gray-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
            title={t('report', 'Report')}
          >
            {t('report', 'report')}
          </button>
        )}
      </div>

      {/* In-Site Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleting}
        title={t('delete_entry_title', 'Delete Entry')}
        message={t(
          'delete_confirmation',
          'Are you sure you want to delete this entry? This action cannot be undone.'
        )}
        confirmText={t('delete', 'Delete')}
        cancelText={t('cancel', 'Cancel')}
        variant="danger"
        loading={submitting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleting(false)}
      />

      {/* Report Modal */}
      {isReporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
              {t('report_entry_title', 'Report Entry')} #{entry.id}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {t('report_entry_desc', 'Please specify why this entry violates community guidelines.')}
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder={t(
                  'report_reason_placeholder',
                  'Reason for report (e.g. harassment, hate speech, spam)...'
                )}
                rows={4}
                maxLength={500}
                required
                className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-850 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsReporting(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {submitting ? t('submitting', 'Submitting...') : t('submit_report', 'Submit Report')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EntryActions;
