import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ModerationService from '@/services/ModerationService';
import ErrorBoundary from '@/layout/ErrorBoundary';
import Pagination from '@/components/shared/Pagination';
import ConfirmModal from '@/components/shared/ConfirmModal';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { successNote, errorNote } from '@/utils/ToastNotify';
import { Report, RookieEntry, ReportStatusId, AdminStats, User } from '@/types';

type ModTab = 'reports' | 'rookies' | 'stats' | 'moderators';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: 'danger' | 'warning' | 'primary';
  action: () => Promise<void>;
}

const ModerationDashboard: React.FC = () => {
  const { t, i18n } = useTranslation('moderation');
  moment.locale(i18n.language);
  const { roleId } = useSelector((state: RootState) => state.auth);
  const isAdmin = roleId === 4;

  const [activeTab, setActiveTab] = useState<ModTab>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [reportStatusFilter, setReportStatusFilter] = useState<number>(ReportStatusId.OPEN);
  const [rookieEntries, setRookieEntries] = useState<RookieEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState({ isError: false, message: '' });

  // In-site confirmation modal state
  const [confirmModal, setConfirmModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger',
    action: async () => {},
  });

  // Admin Stats State
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsLastUpdated, setStatsLastUpdated] = useState<string>('');
  const [adminUserId, setAdminUserId] = useState('');
  const [adminTargetRoleId, setAdminTargetRoleId] = useState('2');
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // Admin Moderators State
  const [moderatorsList, setModeratorsList] = useState<User[]>([]);
  const [modsLoading, setModsLoading] = useState(false);
  const [newModUsername, setNewModUsername] = useState('');
  const [addingMod, setAddingMod] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  const fetchReports = (page: number, statusId: number) => {
    setLoading(true);
    setError({ isError: false, message: '' });

    ModerationService.getReports({ page, limit: pagination.limit, statusId })
      .then((resp: any) => {
        const payload = resp?.data?.data || resp?.data || resp || {};
        const items: Report[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.reports)
          ? payload.reports
          : Array.isArray(payload.items)
          ? payload.items
          : [];

        setReports(items);
        const total = payload?.meta?.total ?? payload?.total ?? items.length;
        const totalPages =
          payload?.meta?.totalPages ??
          payload?.totalPages ??
          Math.ceil(total / pagination.limit) ??
          1;

        setPagination((prev) => ({
          ...prev,
          page: payload?.meta?.page ?? payload?.page ?? page,
          totalPages: totalPages > 0 ? totalPages : 1,
        }));
      })
      .catch((err) => {
        setReports([]);
        setError({
          isError: true,
          message: err.response?.data?.message || 'Failed to load report queue.',
        });
      })
      .finally(() => setLoading(false));
  };

  const fetchRookieEntries = (page: number) => {
    setLoading(true);
    setError({ isError: false, message: '' });

    ModerationService.getRookieEntries({ page, limit: pagination.limit })
      .then((resp: any) => {
        const payload = resp?.data?.data || resp?.data || resp || {};
        const items: RookieEntry[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.entries)
          ? payload.entries
          : Array.isArray(payload.items)
          ? payload.items
          : [];

        setRookieEntries(items);
        const total = payload?.meta?.total ?? payload?.total ?? items.length;
        const totalPages =
          payload?.meta?.totalPages ??
          payload?.totalPages ??
          Math.ceil(total / pagination.limit) ??
          1;

        setPagination((prev) => ({
          ...prev,
          page: payload?.meta?.page ?? payload?.page ?? page,
          totalPages: totalPages > 0 ? totalPages : 1,
        }));
      })
      .catch((err) => {
        setRookieEntries([]);
        setError({
          isError: true,
          message: err.response?.data?.message || 'Failed to load rookie queue.',
        });
      })
      .finally(() => setLoading(false));
  };

  const fetchAdminStats = () => {
    if (!isAdmin) return;
    setStatsLoading(true);
    ModerationService.getAdminStats()
      .then((resp: any) => {
        const data: AdminStats = resp?.data?.data || resp?.data || resp || null;
        setAdminStats(data);
        setStatsLastUpdated(moment().format('HH:mm:ss'));
      })
      .catch((err) => {
        errorNote(err.response?.data?.message || 'Failed to load system stats');
      })
      .finally(() => setStatsLoading(false));
  };

  const fetchModerators = () => {
    if (!isAdmin) return;
    setModsLoading(true);
    ModerationService.getModerators()
      .then((resp: any) => {
        const data = resp?.data?.data || resp?.data || resp || [];
        setModeratorsList(Array.isArray(data) ? data : data.moderators || []);
      })
      .catch((err) => {
        errorNote(err.response?.data?.message || 'Failed to load moderators');
      })
      .finally(() => setModsLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports(pagination.page, reportStatusFilter);
    } else if (activeTab === 'rookies') {
      fetchRookieEntries(pagination.page);
    } else if (activeTab === 'stats' && isAdmin) {
      fetchAdminStats();
      setLoading(false);
    } else if (activeTab === 'moderators' && isAdmin) {
      fetchModerators();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [activeTab, reportStatusFilter, pagination.page]);

  const handleTabChange = (tab: ModTab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const openConfirm = (
    title: string,
    message: string,
    confirmText: string,
    variant: 'danger' | 'warning' | 'primary',
    action: () => Promise<void>
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      variant,
      action,
    });
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    try {
      await confirmModal.action();
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch {
      // Handled in individual action
    } finally {
      setActionLoading(false);
    }
  };

  // Report actions
  const handleUpdateReport = async (reportId: number, targetStatus: ReportStatusId) => {
    try {
      await ModerationService.updateReport(reportId, { statusId: targetStatus });
      successNote(
        targetStatus === ReportStatusId.ACCEPTED
          ? 'Report accepted. Entry deleted.'
          : 'Report rejected.'
      );
      fetchReports(pagination.page, reportStatusFilter);
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to update report');
    }
  };

  // Rookie actions
  const handleApproveRookieEntry = async (entryId: number) => {
    try {
      await ModerationService.approveRookieEntry(entryId);
      successNote('Rookie entry approved and published.');
      fetchRookieEntries(pagination.page);
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to approve rookie entry');
    }
  };

  const handlePromoteRookie = async (userId: number) => {
    try {
      await ModerationService.promoteRookie(userId);
      successNote('Rookie promoted to Author role!');
      fetchRookieEntries(pagination.page);
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to promote rookie');
    }
  };

  // Admin user role mutation
  const handleAdminRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUserId) {
      errorNote('Please enter a valid User ID');
      return;
    }
    setAdminSubmitting(true);
    try {
      await ModerationService.updateUserRole(Number(adminUserId), {
        roleId: Number(adminTargetRoleId),
      });
      successNote(`User #${adminUserId} role updated successfully!`);
      setAdminUserId('');
      fetchAdminStats();
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to mutate user role');
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Moderator management actions
  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = newModUsername.trim();
    if (!cleanUsername) {
      errorNote('Please enter a username');
      return;
    }
    setAddingMod(true);
    try {
      await ModerationService.addModerator(cleanUsername);
      successNote(`@${cleanUsername} appointed as Moderator!`);
      setNewModUsername('');
      fetchModerators();
      fetchAdminStats();
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to add moderator');
    } finally {
      setAddingMod(false);
    }
  };

  const handleRemoveModerator = async (idOrUsername: string | number, name: string) => {
    try {
      await ModerationService.removeModerator(idOrUsername);
      successNote(`@${name} removed from Moderator role.`);
      fetchModerators();
      fetchAdminStats();
    } catch (err: any) {
      errorNote(err.response?.data?.message || 'Failed to remove moderator');
    }
  };

  // Visual Analytics Helper Calculations
  const userTotal = adminStats?.users?.total || 1;
  const authorPct = Math.round(((adminStats?.users?.authors || 0) / userTotal) * 100) || 0;
  const rookiePct = Math.round(((adminStats?.users?.rookies || 0) / userTotal) * 100) || 0;
  const modPct = Math.round(((adminStats?.users?.moderators || 0) / userTotal) * 100) || 0;
  const adminPct = Math.round(((adminStats?.users?.admins || 0) / userTotal) * 100) || 0;

  const totalReports = (adminStats?.moderation?.openReports || 0) + (adminStats?.moderation?.resolvedReports || 0);
  const reportResolutionRate = totalReports > 0
    ? Math.round(((adminStats?.moderation?.resolvedReports || 0) / totalReports) * 100)
    : 100;

  const entryToTopicRatio = adminStats?.content?.totalTitles && adminStats.content.totalTitles > 0
    ? ((adminStats?.content?.totalEntries || 0) / adminStats.content.totalTitles).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header & Tabs Container */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <span>🛡️</span> {t('dashboard_title', 'Moderation Dashboard')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {t('dashboard_subtitle', 'Review reports, evaluate rookie contributions, and manage platform standards.')}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full self-start sm:self-auto border border-amber-200 dark:border-amber-900/60">
            {isAdmin ? t('admin_clearance', 'Admin Clearance') : t('mod_clearance', 'Moderator Clearance')}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-gray-100 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            🚩 {t('report_queue', 'Report Queue')}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('rookies')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rookies'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            🌱 {t('rookie_queue', 'Rookie Queue')}
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange('stats')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                📊 {t('stats_tab', 'Stats & Analytics')}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('moderators')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'moderators'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                🛡️ {t('moderators_tab', 'Moderators')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab 1: Report Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{t('filter_status', 'Filter Status')}:</span>
            <select
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(Number(e.target.value))}
              className="text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value={ReportStatusId.OPEN}>{t('open_reports', 'Open Pending Reports')}</option>
              <option value={ReportStatusId.ACCEPTED}>{t('accepted_reports', 'Accepted (Deleted Entries)')}</option>
              <option value={ReportStatusId.REJECTED}>{t('rejected_reports', 'Rejected Reports')}</option>
            </select>
          </div>

          <ErrorBoundary error={error} loading={loading}>
            {reports.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-12 text-center text-gray-400 dark:text-slate-500 text-xs">
                {t('no_reports', 'No reports found in this view.')}
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => {
                  const reportAuthor = report.entry?.author || report.entry?.user;
                  const reportAuthorName =
                    reportAuthor?.username || (report.entry as any)?.username || 'user';

                  return (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                        <span>Report #{report.id}</span>
                        <span>
                          {report.createdAt
                            ? moment(report.createdAt).format('DD.MM.YYYY HH:mm')
                            : ''}
                        </span>
                      </div>

                      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 p-3 rounded-lg text-xs text-rose-900 dark:text-rose-200">
                        <strong>{t('report_reason', 'Report Reason')}:</strong> {report.note}
                      </div>

                      {report.entry && (
                        <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-800">
                          <div className="flex justify-between items-center text-[11px] text-gray-400 dark:text-slate-400 mb-1">
                            <span>
                              {t('author', 'Author')}:{' '}
                              <Link
                                href={`/u/${reportAuthorName}`}
                                className="text-sky-700 dark:text-sky-400 font-semibold hover:underline"
                              >
                                @{reportAuthorName}
                              </Link>
                            </span>
                            <Link
                              href={`/e/${report.entry.id}`}
                              className="text-sky-600 dark:text-sky-400 hover:underline"
                            >
                              {t('view_entry', 'View Entry')} #{report.entry.id} →
                            </Link>
                          </div>
                          <p className="italic">&ldquo;{report.entry.message}&rdquo;</p>
                        </div>
                      )}

                      {reportStatusFilter === ReportStatusId.OPEN && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() =>
                              openConfirm(
                                t('reject_report', 'Reject Report'),
                                t('confirm_reject_report', 'Are you sure you want to reject Report #{{id}}?', { id: report.id }),
                                t('reject_report', 'Reject Report'),
                                'warning',
                                () => handleUpdateReport(report.id, ReportStatusId.REJECTED)
                              )
                            }
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                          >
                            ✕ {t('reject_report', 'Reject Report')}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openConfirm(
                                t('accept_delete', 'Accept & Delete Entry'),
                                t('confirm_accept_report', 'Are you sure you want to accept Report #{{id}} and delete Entry #{{entryId}}?', { id: report.id, entryId: report.entry?.id }),
                                t('accept_delete', 'Accept & Delete Entry'),
                                'danger',
                                () => handleUpdateReport(report.id, ReportStatusId.ACCEPTED)
                              )
                            }
                            className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition cursor-pointer"
                          >
                            ✓ {t('accept_delete', 'Accept & Delete Entry')}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </ErrorBoundary>
        </div>
      )}

      {/* Tab 2: Rookie Queue */}
      {activeTab === 'rookies' && (
        <div className="space-y-4">
          <ErrorBoundary error={error} loading={loading}>
            {rookieEntries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-12 text-center text-gray-400 dark:text-slate-500 text-xs">
                {t('no_rookies', 'No pending rookie entries in queue.')}
              </div>
            ) : (
              <div className="space-y-3">
                {rookieEntries.map((entry) => {
                  const rookieAuthor = entry.author || entry.user;
                  const rookieAuthorName =
                    rookieAuthor?.username || (entry as any)?.username || 'Rookie';
                  const rookieUserId =
                    rookieAuthor?.id || entry.userId || (entry as any)?.authorId;
                  const topicName =
                    typeof entry.title === 'object'
                      ? entry.title?.name
                      : typeof entry.title === 'string'
                      ? entry.title
                      : '';

                  return (
                    <div
                      key={entry.id}
                      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/u/${rookieAuthorName}`}
                            className="font-bold text-sky-800 dark:text-sky-400 hover:text-sky-950 dark:hover:text-sky-200 hover:underline flex items-center gap-1"
                          >
                            <span>👤</span>
                            <span>{rookieAuthorName}</span>
                          </Link>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-900/60">
                            {t('pending_approval', 'Pending Approval')}
                          </span>
                        </div>
                        <span>
                          {entry.createdAt
                            ? moment(entry.createdAt).format('DD.MM.YYYY HH:mm')
                            : ''}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-800">
                        {topicName && (
                          <div className="font-semibold text-sky-800 dark:text-sky-400 mb-1">
                            {t('topic', 'Topic')}: {topicName}
                          </div>
                        )}
                        <p>{entry.message}</p>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
                        {rookieUserId && (
                          <button
                            type="button"
                            onClick={() =>
                              openConfirm(
                                t('promote_user', 'Promote User to Author'),
                                t('confirm_promote', 'Are you sure you want to promote {{name}} (#{{id}}) to Author?', { name: rookieAuthorName, id: rookieUserId }),
                                t('promote_user', 'Promote User to Author'),
                                'primary',
                                () => handlePromoteRookie(rookieUserId)
                              )
                            }
                            className="px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 rounded-lg transition cursor-pointer"
                          >
                            🎖️ {t('promote_user', 'Promote User to Author')}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            openConfirm(
                              t('approve_entry', 'Approve Entry'),
                              t('confirm_approve_entry', 'Approve and publish Entry #{{id}}?', { id: entry.id }),
                              t('approve_entry', 'Approve Entry'),
                              'primary',
                              () => handleApproveRookieEntry(entry.id)
                            )
                          }
                          className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition cursor-pointer"
                        >
                          ✓ {t('approve_entry', 'Approve Entry')}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </ErrorBoundary>
        </div>
      )}

      {/* Tab 3: Stats & Visual Analytics (Admin Exclusive) */}
      {activeTab === 'stats' && isAdmin && (
        <div className="space-y-6">
          {/* Admin Stats Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <span>📊</span> {t('admin_stats', 'Visual System Analytics & Metrics')}
            </h2>
            <div className="flex items-center gap-3">
              {statsLastUpdated && (
                <span className="text-[11px] text-gray-400 dark:text-slate-500">
                  {t('last_updated', 'Last updated')}: {statsLastUpdated}
                </span>
              )}
              <button
                type="button"
                onClick={fetchAdminStats}
                disabled={statsLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                {statsLoading ? '...' : `↻ ${t('refresh_stats', 'Refresh')}`}
              </button>
            </div>
          </div>

          {/* 3-Column Clean Stats Metric Cards Grid */}
          {statsLoading && !adminStats ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
              {t('loading_stats', 'Loading system statistics and analytics...')}
            </div>
          ) : adminStats ? (
            <div className="space-y-6">
              {/* Primary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. User Base Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-gray-400 dark:text-slate-400 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      {t('total_users', 'Total Users')}
                    </span>
                    <span className="text-xl">👥</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-slate-100">
                      {adminStats.users?.total ?? 0}
                    </span>
                    {adminStats.users?.newToday !== undefined && adminStats.users.newToday > 0 && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                        +{adminStats.users.newToday} {t('new_today', 'today')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-50 dark:border-slate-800 text-[11px]">
                    <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg text-gray-700 dark:text-slate-300">
                      <span className="block text-[10px] text-gray-400 dark:text-slate-400">{t('rookies', 'Rookies')}</span>
                      <strong className="font-bold">{adminStats.users?.rookies ?? 0}</strong>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-950/50 p-2 rounded-lg text-sky-800 dark:text-sky-300">
                      <span className="block text-[10px] text-sky-600 dark:text-sky-400">{t('authors', 'Authors')}</span>
                      <strong className="font-bold">{adminStats.users?.authors ?? 0}</strong>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg text-amber-900 dark:text-amber-300">
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400">{t('moderators', 'Mods')}</span>
                      <strong className="font-bold">{adminStats.users?.moderators ?? 0}</strong>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/50 p-2 rounded-lg text-purple-900 dark:text-purple-300">
                      <span className="block text-[10px] text-purple-600 dark:text-purple-400">{t('admins', 'Admins')}</span>
                      <strong className="font-bold">{adminStats.users?.admins ?? 0}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Content Matrix Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-gray-400 dark:text-slate-400 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      {t('content_matrix', 'Content Matrix')}
                    </span>
                    <span className="text-xl">📖</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between bg-gray-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                      <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{t('total_titles', 'Topics')}:</span>
                      <span className="text-xl font-bold text-sky-700 dark:text-sky-400">
                        {adminStats.content?.totalTitles ?? 0}
                        {adminStats.content?.newTitlesToday ? (
                          <span className="text-[10px] text-sky-600 dark:text-sky-300 ml-1 font-semibold">
                            (+{adminStats.content.newTitlesToday})
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between bg-gray-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                      <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{t('total_entries', 'Entries')}:</span>
                      <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                        {adminStats.content?.totalEntries ?? 0}
                        {adminStats.content?.newEntriesToday ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-300 ml-1 font-semibold">
                            (+{adminStats.content.newEntriesToday})
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-gray-400 dark:text-slate-500 flex items-center justify-between">
                    <span>{t('deleted_entries', 'Deleted entries')}:</span>
                    <strong className="text-gray-600 dark:text-slate-300">{adminStats.content?.deletedEntries ?? 0}</strong>
                  </div>
                </div>

                {/* 3. Moderation Status Card */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-gray-400 dark:text-slate-400 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      {t('moderation_card', 'Moderation')}
                    </span>
                    <span className="text-xl">🛡️</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('reports')}
                      className="w-full text-left flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/60 p-2.5 rounded-xl text-rose-900 dark:text-rose-200 transition cursor-pointer border border-transparent dark:border-rose-900/40"
                    >
                      <span className="text-xs font-medium">{t('pending_reports', 'Open Reports')}</span>
                      <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                        {adminStats.moderation?.openReports ?? 0} →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('rookies')}
                      className="w-full text-left flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/60 p-2.5 rounded-xl text-amber-900 dark:text-amber-200 transition cursor-pointer border border-transparent dark:border-amber-900/40"
                    >
                      <span className="text-xs font-medium">{t('pending_rookies', 'Pending Rookies')}</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        {adminStats.moderation?.pendingRookieEntries ?? 0} →
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 text-[11px] text-gray-400 dark:text-slate-500 text-right">
                    {t('resolved_reports', 'Resolved reports')}: <strong className="text-gray-600 dark:text-slate-300">{adminStats.moderation?.resolvedReports ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* VISUAL ANALYTICS SECTION: Charts & Matrices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Interactive Role Distribution Donut & Progress Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                      <span>🍩</span> {t('role_distribution', 'Role Distribution Matrix')}
                    </h3>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
                      {adminStats.users?.total ?? 0} {t('total_accounts', 'total accounts')}
                    </span>
                  </div>

                  {/* Multi-segment stacked progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${authorPct}%` }}
                        className="bg-sky-500 transition-all duration-500"
                        title={`Authors: ${adminStats.users?.authors || 0} (${authorPct}%)`}
                      />
                      <div
                        style={{ width: `${rookiePct}%` }}
                        className="bg-emerald-500 transition-all duration-500"
                        title={`Rookies: ${adminStats.users?.rookies || 0} (${rookiePct}%)`}
                      />
                      <div
                        style={{ width: `${modPct}%` }}
                        className="bg-amber-500 transition-all duration-500"
                        title={`Moderators: ${adminStats.users?.moderators || 0} (${modPct}%)`}
                      />
                      <div
                        style={{ width: `${adminPct}%` }}
                        className="bg-purple-500 transition-all duration-500"
                        title={`Admins: ${adminStats.users?.admins || 0} (${adminPct}%)`}
                      />
                    </div>
                  </div>

                  {/* Role Legend and Detailed Progress Rows */}
                  <div className="space-y-3 pt-2">
                    {/* Authors */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                          {t('role_authors', '✍️ Authors')}
                        </span>
                        <span className="text-gray-900 dark:text-slate-100 font-bold">
                          {adminStats.users?.authors || 0} <span className="text-gray-400 font-normal">({authorPct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${authorPct}%` }} className="h-full bg-sky-500 rounded-full transition-all duration-500" />
                      </div>
                    </div>

                    {/* Rookies */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          {t('role_rookies', '🌱 Rookies')}
                        </span>
                        <span className="text-gray-900 dark:text-slate-100 font-bold">
                          {adminStats.users?.rookies || 0} <span className="text-gray-400 font-normal">({rookiePct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${rookiePct}%` }} className="h-full bg-emerald-500 rounded-full transition-all duration-500" />
                      </div>
                    </div>

                    {/* Moderators */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          {t('role_moderators', '🛡️ Moderators')}
                        </span>
                        <span className="text-gray-900 dark:text-slate-100 font-bold">
                          {adminStats.users?.moderators || 0} <span className="text-gray-400 font-normal">({modPct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${modPct}%` }} className="h-full bg-amber-500 rounded-full transition-all duration-500" />
                      </div>
                    </div>

                    {/* Admins */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                          {t('role_admins', '⚡ System Administrators')}
                        </span>
                        <span className="text-gray-900 dark:text-slate-100 font-bold">
                          {adminStats.users?.admins || 0} <span className="text-gray-400 font-normal">({adminPct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${adminPct}%` }} className="h-full bg-purple-500 rounded-full transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Content Velocity & Moderation Health Gauge */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                        <span>📈</span> {t('content_velocity', 'Content Velocity & Health')}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                        {entryToTopicRatio} {t('entries_per_topic', 'entries/topic')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {/* Metric 1: Today's Content Flow */}
                      <div className="bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 rounded-xl p-3 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 dark:text-sky-300 block">
                          {t('todays_velocity', "Today's Velocity")}
                        </span>
                        <div className="flex items-baseline gap-1 text-sky-900 dark:text-sky-100">
                          <span className="text-xl font-extrabold">+{adminStats.content?.newEntriesToday ?? 0}</span>
                          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">{t('entries_label', 'entries')}</span>
                        </div>
                        <p className="text-[10px] text-sky-600/80 dark:text-sky-400/80">
                          +{adminStats.content?.newTitlesToday ?? 0} {t('new_topics_created', 'new topics created')}
                        </p>
                      </div>

                      {/* Metric 2: Report Resolution Efficiency */}
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-3 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300 block">
                          {t('report_resolution_rate', 'Report Resolution Rate')}
                        </span>
                        <div className="flex items-baseline gap-1 text-emerald-900 dark:text-emerald-100">
                          <span className="text-xl font-extrabold">{reportResolutionRate}%</span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t('cleared', 'cleared')}</span>
                        </div>
                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                          {t('resolved_of_reports', '{{count}} resolved of {{total}} reports', { count: adminStats.moderation?.resolvedReports ?? 0, total: totalReports })}
                        </p>
                      </div>
                    </div>

                    {/* Moderation Pipeline Health Status Bar */}
                    <div className="mt-4 p-3.5 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-800 dark:text-slate-200">
                          {t('pipeline_status', 'Moderation Pipeline Status')}
                        </span>
                        {(adminStats.moderation?.openReports || 0) > 5 || (adminStats.moderation?.pendingRookieEntries || 0) > 10 ? (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> {t('action_needed', 'Action Needed')}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t('healthy_flowing', 'Healthy & Flowing')}
                          </span>
                        )}
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${Math.min(100, Math.max(10, reportResolutionRate))}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500">
                        <span>{adminStats.moderation?.openReports ?? 0} {t('open_reports_count', 'open reports')}</span>
                        <span>{adminStats.moderation?.pendingRookieEntries ?? 0} {t('pending_rookie_items', 'pending rookie items')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Admin User Role Mutation Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-lg">
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-2">
              {t('assign_roles', 'Assign or Revoke Roles')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              {t('assign_roles_desc', 'Directly mutate a user role in the system. Use this to appoint new moderators or dismiss roles.')}
            </p>

            <form onSubmit={handleAdminRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                  {t('user_id', 'User ID')}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                  {t('target_role', 'Target Role')}
                </label>
                <select
                  value={adminTargetRoleId}
                  onChange={(e) => setAdminTargetRoleId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="1">Rookie (ID 1)</option>
                  <option value="2">Author (ID 2)</option>
                  <option value="3">Moderator (ID 3)</option>
                  <option value="4">Admin (ID 4)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                className="w-full py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {adminSubmitting ? t('mutating_role', 'Mutating Role...') : t('update_role', 'Update User Role')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Moderators Management (Admin Exclusive) */}
      {activeTab === 'moderators' && isAdmin && (
        <div className="space-y-6">
          {/* Add Moderator Form Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-lg">
            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
              {t('add_moderator', 'Add Moderator')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              {t('appoint_mod_desc', 'Promote an existing user to moderator status by entering their username.')}
            </p>

            <form onSubmit={handleAddModerator} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. zeynep"
                value={newModUsername}
                onChange={(e) => setNewModUsername(e.target.value)}
                required
                className="flex-1 text-xs p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={addingMod}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {addingMod ? t('adding_moderator', 'Adding...') : `+ ${t('add_moderator', 'Add')}`}
              </button>
            </form>
          </div>

          {/* Active Moderators List */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <span>🛡️</span> {t('active_moderators', 'Active Moderators')}
              </h2>
              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                {moderatorsList.length} {t(moderatorsList.length === 1 ? 'moderator_count_one' : 'moderator_count_other', moderatorsList.length === 1 ? 'moderator' : 'moderators')}
              </span>
            </div>

            {modsLoading ? (
              <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
                {t('loading_moderators', 'Loading moderators...')}
              </div>
            ) : moderatorsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500">
                {t('no_moderators', 'No active moderators found.')}
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800">
                {moderatorsList.map((mod) => (
                  <div
                    key={mod.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          mod.imageUrl ||
                          mod.image_url ||
                          'https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png'
                        }
                        alt={mod.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-800 object-cover"
                      />
                      <div>
                        <Link
                          href={`/u/${mod.username}`}
                          className="font-bold text-sm text-sky-800 dark:text-sky-400 hover:text-sky-950 dark:hover:text-sky-200 hover:underline block"
                        >
                          {mod.username}
                        </Link>
                        <span className="text-[11px] text-gray-400 dark:text-slate-500">
                          ID: #{mod.id} {mod.email ? `• ${mod.email}` : ''}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openConfirm(
                          t('remove_moderator', 'Remove Moderator'),
                          t('confirm_remove_mod', 'Are you sure you want to remove @{{name}} from the Moderator role?', { name: mod.username }),
                          t('remove_moderator', 'Remove Moderator'),
                          'danger',
                          () => handleRemoveModerator(mod.id, mod.username)
                        )
                      }
                      className="text-xs px-3 py-1.5 font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition cursor-pointer"
                    >
                      {t('remove_moderator', 'Remove')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global In-Site Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ModerationDashboard;
