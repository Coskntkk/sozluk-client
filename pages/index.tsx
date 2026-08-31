import React from 'react';
import { GetServerSideProps } from 'next';
import HomePage from '@/components/Home/HomePage';
import HomeService from '@/services/HomeService';
import { Title, Entry } from '@/types';

interface HomeProps {
  initialTitle?: Title | null;
  initialEntries?: Entry[];
  initialError?: string;
}

export default function Home({ initialTitle, initialEntries, initialError }: HomeProps) {
  return (
    <HomePage
      initialTitle={initialTitle}
      initialEntries={initialEntries}
      initialError={initialError}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await HomeService.getLatestTopic();
    const data = res?.data;

    return {
      props: {
        initialTitle: data?.title || null,
        initialEntries: data?.items || [],
      },
    };
  } catch (err: any) {
    return {
      props: {
        initialTitle: null,
        initialEntries: [],
        initialError: err.response?.data?.message || 'Failed to load home agenda.',
      },
    };
  }
};
