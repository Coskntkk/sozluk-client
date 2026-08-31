import React from 'react';
import { GetServerSideProps } from 'next';
import Title from '@/components/Title/Title';
import TitleService from '@/services/TitleService';

interface TitlePageProps {
  slug: string;
  initialData?: any;
  initialNotFound?: boolean;
  initialError?: string;
  initialPage?: number;
}

const TitlePage: React.FC<TitlePageProps> = ({
  slug,
  initialData,
  initialNotFound,
  initialError,
  initialPage,
}) => {
  if (!slug) {
    return null;
  }

  return (
    <Title
      slug={slug}
      initialData={initialData}
      initialNotFound={initialNotFound}
      initialError={initialError}
      initialPage={initialPage}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  const page = Number(context.query.page || context.query.p) || 1;
  const limit = 10;

  if (!slug || typeof slug !== 'string') {
    return { notFound: true };
  }

  try {
    const res: any = await TitleService.getTitle(slug, { page, limit });
    const payload = res?.data || res || {};
    const data = payload?.data || payload;

    return {
      props: {
        slug,
        initialData: data,
        initialPage: page,
      },
    };
  } catch (err: any) {
    if (err.response?.status === 404) {
      return {
        props: {
          slug,
          initialNotFound: true,
          initialPage: page,
        },
      };
    }

    return {
      props: {
        slug,
        initialError: err.response?.data?.message || 'Failed to load topic.',
        initialPage: page,
      },
    };
  }
};

export default TitlePage;
