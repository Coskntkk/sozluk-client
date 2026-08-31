import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserService from '@/services/UserService';
import { useTranslation } from 'react-i18next';
import { errorNote, successNote } from '@/utils/ToastNotify';

interface FollowProps {
  username: string;
  isFollowing?: boolean;
  isOwn?: boolean;
  onCountChange?: (delta: number) => void;
  onUse?: () => void;
}

const Follow: React.FC<FollowProps> = ({
  username,
  isFollowing: initialIsFollowing = false,
  isOwn = false,
  onCountChange,
  onUse,
}) => {
  const { t } = useTranslation('follow');
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [following, setFollowing] = useState<boolean>(initialIsFollowing);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    setFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  if (!isAuthenticated || isOwn) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (isMutating) return;

    const previousState = following;
    const nextState = !previousState;
    const delta = nextState ? 1 : -1;

    // Optimistic Update
    setFollowing(nextState);
    if (onCountChange) onCountChange(delta);
    setIsMutating(true);

    try {
      if (nextState) {
        await UserService.followUser(username);
        successNote(t('followed_successfully', `You are now following ${username}`));
      } else {
        await UserService.unfollowUser(username);
        successNote(t('unfollowed_successfully', `Unfollowed ${username}`));
      }
      if (onUse) onUse();
    } catch (err: any) {
      // Rollback on failure
      setFollowing(previousState);
      if (onCountChange) onCountChange(-delta);
      errorNote(err.response?.data?.message || 'Follow action could not be processed.');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollowToggle}
      disabled={isMutating}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
          : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
      }`}
    >
      {following ? t('unfollow', 'Following') : t('follow', 'Follow')}
    </button>
  );
};

export default Follow;
