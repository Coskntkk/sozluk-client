import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserService from '@/services/UserService';
import ErrorBoundary from '@/layout/ErrorBoundary';
import Pagination from '@/components/shared/Pagination';
import Image from 'next/image';
import moment from 'moment';
import Head from 'next/head';
import EntryWithTitle from '@/components/shared/EntryWithTitle';
import Follow from '@/components/shared/Follow';
import EditProfileModal from './EditProfileModal';
import { useTranslation } from 'react-i18next';
import { UserProfile, Entry } from '@/types';

interface UserComponentProps {
  username: string;
  initialProfile?: UserProfile | null;
  initialEntries?: Entry[];
  initialTotal?: number;
  initialTotalPages?: number;
  initialError?: string;
}

type ProfileTab = 'authored' | 'voted';

const UserComponent: React.FC<UserComponentProps> = ({
  username,
  initialProfile = null,
  initialEntries = [],
  initialTotal = 0,
  initialTotalPages = 1,
  initialError,
}) => {
  const { t, i18n } = useTranslation('user');
  moment.locale(i18n.language);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [activeTab, setActiveTab] = useState<ProfileTab>('authored');
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [loading, setLoading] = useState(!initialProfile && !initialError);
  const [entriesLoading, setEntriesLoading] = useState(
    !initialProfile && !initialEntries.length && !initialError
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [error, setError] = useState({
    isError: !!initialError,
    message: initialError || '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: initialTotalPages > 0 ? initialTotalPages : 1,
    limit: 10,
  });

  const isOwnProfile =
    currentUser?.username?.toLowerCase() === username?.toLowerCase() ||
    currentUser?.id === profile?.id;

  const fetchProfile = () => {
    if (!username) return;
    setLoading(true);
    setError({ isError: false, message: '' });

    UserService.getUser(username)
      .then((resp: any) => {
        const data = resp.data?.data || resp.data;
        setProfile(data);
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || 'User not found.',
        });
      })
      .finally(() => setLoading(false));
  };

  const fetchEntries = (tab: ProfileTab, page: number) => {
    if (!username) return;
    setEntriesLoading(true);
    const fetcher =
      tab === 'authored'
        ? UserService.getUserEntries(username, { page, limit: pagination.limit })
        : UserService.getUserVotes(username, { page, limit: pagination.limit });

    fetcher
      .then((resp: any) => {
        const payload = resp.data?.data || resp.data || {};
        const rawList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.entries)
          ? payload.entries
          : Array.isArray(payload.votes)
          ? payload.votes
          : Array.isArray(payload.items)
          ? payload.items
          : [];

        const items: Entry[] = rawList.map((item: any) =>
          item?.entry ? { ...item.entry, userVote: item.value } : item
        );

        setEntries(items);

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
      .catch(() => {
        setEntries([]);
      })
      .finally(() => setEntriesLoading(false));
  };

  useEffect(() => {
    if (username) {
      if (!initialProfile) {
        fetchProfile();
        fetchEntries(activeTab, 1);
      }
    }
  }, [username]);

  const handleTabChange = (tab: ProfileTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEntries(tab, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchEntries(activeTab, newPage);
  };

  // Helper to extract role name & styling
  const getRoleBadge = (userProf: UserProfile) => {
    const rawRole = userProf.role;
    const roleId = userProf.roleId || (userProf as any).role_id;
    let roleName = '';

    if (typeof rawRole === 'object' && rawRole !== null) {
      roleName = (rawRole as any).name || '';
    } else if (typeof rawRole === 'string') {
      roleName = rawRole;
    } else if (roleId === 4) {
      roleName = 'Admin';
    } else if (roleId === 3) {
      roleName = 'Moderator';
    } else if (roleId === 2) {
      roleName = 'Author';
    } else if (roleId === 1) {
      roleName = 'Rookie';
    }

    const lower = roleName.toLowerCase();
    if (lower.includes('admin')) {
      return {
        label: roleName || 'Admin',
        icon: '⚡',
        classes: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80',
      };
    }
    if (lower.includes('mod')) {
      return {
        label: roleName || 'Moderator',
        icon: '🛡️',
        classes: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80',
      };
    }
    if (lower.includes('author') || lower.includes('yazar')) {
      return {
        label: roleName || 'Author',
        icon: '✍️',
        classes: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80',
      };
    }
    if (lower.includes('rookie') || lower.includes('çaylak') || lower.includes('caylak')) {
      return {
        label: roleName || 'Rookie',
        icon: '🌱',
        classes: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80',
      };
    }

    if (roleName) {
      return {
        label: roleName,
        icon: '👤',
        classes: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300 border border-gray-200 dark:border-slate-700',
      };
    }

    return null;
  };

  const roleBadge = profile ? getRoleBadge(profile) : null;
  const pageTitle = profile?.username ? `@${profile.username} - Sözlük Profile` : 'User Profile - Sözlük';
  const pageDescription = profile?.bio || `View @${username}'s entries, points, and discussions on Sözlük platform.`;

  return (
    <ErrorBoundary error={error} loading={loading} onRetry={fetchProfile}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      {profile && (
        <div className="space-y-6 transition-colors duration-200">
          {/* Profile Card Header */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Image
                  src={
                    profile.imageUrl ||
                    profile.image_url ||
                    'https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png'
                  }
                  alt={profile.username}
                  width={80}
                  height={80}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-gray-100 dark:border-slate-800 object-cover shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {profile.username}
                    </h1>
                    {roleBadge && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${roleBadge.classes}`}>
                        <span>{roleBadge.icon}</span>
                        <span>{roleBadge.label}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                    {t('joined', 'Joined')}:{' '}
                    {profile.createdAt ? moment(profile.createdAt).format('DD.MM.YYYY') : ''}
                  </p>
                </div>
              </div>

              {/* Action: Follow / Edit Profile */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs font-medium px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg transition cursor-pointer"
                  >
                    ✏️ {t('edit_profile', 'Edit Profile')}
                  </button>
                ) : (
                  <Follow
                    username={profile.username}
                    isFollowing={!!profile.isFollowing}
                    isOwn={isOwnProfile}
                    onUse={fetchProfile}
                  />
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-gray-700 dark:text-slate-300 bg-gray-50/70 dark:bg-slate-800/40 p-3 rounded-xl mb-4 border border-gray-100 dark:border-slate-800">
                {profile.bio}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-50 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400">
              <div>
                <strong className="text-gray-900 dark:text-slate-100 font-bold">{profile.entryCount ?? 0}</strong>{' '}
                <span className="text-gray-400 dark:text-slate-500">{t('entries', 'entries')}</span>
              </div>
              <div>
                <strong className="text-gray-900 dark:text-slate-100 font-bold">{profile.followerCount ?? 0}</strong>{' '}
                <span className="text-gray-400 dark:text-slate-500">{t('followers', 'followers')}</span>
              </div>
              <div>
                <strong className="text-gray-900 dark:text-slate-100 font-bold">{profile.followingCount ?? 0}</strong>{' '}
                <span className="text-gray-400 dark:text-slate-500">{t('following', 'following')}</span>
              </div>
            </div>
          </div>

          {/* Dual Tabs: Authored Entries vs Voted Entries */}
          <div>
            <div className="flex items-center border-b border-gray-200 dark:border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => handleTabChange('authored')}
                className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
                  activeTab === 'authored'
                    ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-400'
                    : 'border-transparent text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                ✍️ {t('authored_entries', 'Authored Entries')}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('voted')}
                className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
                  activeTab === 'voted'
                    ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-400'
                    : 'border-transparent text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                👍 {t('voted_entries', 'Voted Entries')}
              </button>
            </div>

            {/* Tab Feed */}
            {entriesLoading ? (
              <div className="py-12 text-center text-gray-400 dark:text-slate-500 text-xs">
                {t('loading_entries', 'Loading entries...')}
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-8 text-center text-gray-400 dark:text-slate-500 text-xs">
                {activeTab === 'authored'
                  ? t('no_authored_entries', 'No entries authored yet.')
                  : t('no_voted_entries', 'No voted entries yet.')}
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <EntryWithTitle entry={entry} key={entry.id} />
                ))}

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Edit Profile Modal */}
          {isOwnProfile && (
            <EditProfileModal
              user={profile}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onUpdated={fetchProfile}
            />
          )}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default UserComponent;
