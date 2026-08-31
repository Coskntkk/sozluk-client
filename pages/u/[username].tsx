import React from 'react';
import { GetServerSideProps } from 'next';
import UserComponent from '@/components/User/User';
import UserService from '@/services/UserService';
import { UserProfile, Entry } from '@/types';

interface UserProfilePageProps {
  username: string;
  initialProfile?: UserProfile | null;
  initialEntries?: Entry[];
  initialTotal?: number;
  initialTotalPages?: number;
  initialError?: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  username,
  initialProfile,
  initialEntries,
  initialTotal,
  initialTotalPages,
  initialError,
}) => {
  if (!username) {
    return null;
  }

  return (
    <UserComponent
      username={username}
      initialProfile={initialProfile}
      initialEntries={initialEntries}
      initialTotal={initialTotal}
      initialTotalPages={initialTotalPages}
      initialError={initialError}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params || {};

  if (!username || typeof username !== 'string') {
    return { notFound: true };
  }

  try {
    const [profileRes, entriesRes]: [any, any] = await Promise.all([
      UserService.getUser(username),
      UserService.getUserEntries(username, { page: 1, limit: 10 }).catch(() => ({ data: [] })),
    ]);

    const profileData = profileRes?.data?.data || profileRes?.data || profileRes;
    const entriesPayload = entriesRes?.data?.data || entriesRes?.data || entriesRes || {};
    const entries: Entry[] = Array.isArray(entriesPayload)
      ? entriesPayload
      : Array.isArray(entriesPayload.entries)
      ? entriesPayload.entries
      : Array.isArray(entriesPayload.items)
      ? entriesPayload.items
      : [];

    const total = entriesPayload?.meta?.total ?? entriesPayload?.total ?? entries.length;
    const totalPages =
      entriesPayload?.meta?.totalPages ??
      entriesPayload?.totalPages ??
      Math.ceil(total / 10) ??
      1;

    return {
      props: {
        username,
        initialProfile: profileData || null,
        initialEntries: entries,
        initialTotal: total,
        initialTotalPages: totalPages > 0 ? totalPages : 1,
      },
    };
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { notFound: true };
    }

    return {
      props: {
        username,
        initialError: err.response?.data?.message || 'User not found.',
      },
    };
  }
};

export default UserProfilePage;
