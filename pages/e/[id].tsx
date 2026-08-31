import React from 'react';
import { GetServerSideProps } from 'next';
import EntryPage from '@/components/Entry/EntryPage';
import EntryService from '@/services/EntryService';
import { Entry } from '@/types';

interface EntryPageRouteProps {
  id: string;
  initialEntry?: Entry | null;
  initialError?: string;
}

const EntryPageRoute: React.FC<EntryPageRouteProps> = ({ id, initialEntry, initialError }) => {
  if (!id) {
    return null;
  }

  return <EntryPage id={id} initialEntry={initialEntry} initialError={initialError} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id || typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const res = await EntryService.getEntry(id);
    const data = res?.data || res;

    return {
      props: {
        id,
        initialEntry: data,
      },
    };
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { notFound: true };
    }

    return {
      props: {
        id,
        initialError: err.response?.data?.message || 'Entry not found.',
      },
    };
  }
};

export default EntryPageRoute;
