import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import AuthService from '@/services/AuthService';
import Spinner from '@/components/shared/Spinner';

const VerifyEmailComponent: React.FC = () => {
  const { t } = useTranslation('verify_email');
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!token || typeof token !== 'string') {
      setStatus('error');
      setErrorMessage('Verification token is missing or invalid.');
      return;
    }

    AuthService.verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err: any) => {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Email verification failed or token expired.');
      });
  }, [router.isReady, token]);

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 max-w-md p-6 sm:p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t('title', 'Email Verification')}
        </h1>

        {status === 'loading' && (
          <div className="py-8 flex flex-col items-center gap-3">
            <Spinner />
            <p className="text-sm text-gray-500">
              {t('verifying', 'Verifying your email address...')}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm">
              {t(
                'success_notice',
                'Your email has been successfully verified! You can now sign in.'
              )}
            </div>
            <Link
              href="/auth/login"
              className="inline-block w-full text-white bg-sky-600 hover:bg-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
            >
              {t('go_to_sign_in', 'Go to Sign In')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
              {errorMessage}
            </div>
            <Link
              href="/auth/login"
              className="inline-block font-semibold text-sky-600 hover:underline text-sm"
            >
              {t('back_to_sign_in', '← Back to Sign In')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerifyEmailComponent;
