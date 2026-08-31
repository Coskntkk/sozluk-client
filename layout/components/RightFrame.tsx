import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Notifications from '@/components/shared/Notifications';
import MockAd from '@/components/shared/MockAd';
import UserService from '@/services/UserService';
import { login, register } from '@/redux/auth/AuthSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RightFrame: React.FC = () => {
  const { t, i18n } = useTranslation('rightframe');
  moment.locale(i18n.language);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, roleId, isInitialized, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [guestTab, setGuestTab] = useState<'login' | 'register'>('login');
  const [stats, setStats] = useState<{ entryCount: number; followerCount: number; followingCount: number } | null>(null);

  // Quick Guest Login Formik
  const loginFormik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      await dispatch(login(values));
    },
  });

  // Quick Guest Register Formik
  const registerFormik = useFormik({
    initialValues: { username: '', email: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().min(3).required('Required'),
      email: Yup.string().email().required('Required'),
      password: Yup.string().min(6).required('Required'),
    }),
    onSubmit: async (values) => {
      await dispatch(register(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      UserService.getUser(user.username)
        .then((resp: any) => {
          const profile = resp?.data?.data || resp?.data || resp;
          setStats({
            entryCount: profile.entryCount ?? 0,
            followerCount: profile.followerCount ?? 0,
            followingCount: profile.followingCount ?? 0,
          });
        })
        .catch(() => {
          // stats fallback
        });
    }
  }, [isAuthenticated, user?.username]);

  return (
    <aside className="sticky top-20 space-y-4 transition-colors duration-200">
      {!isInitialized ? (
        <>
          {/* Session Verification Spinner Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center space-y-3 min-h-[220px]">
            <div className="w-7 h-7 border-2 border-sky-600 dark:border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {t('checking_session', 'Checking session...')}
            </span>
          </div>

          {/* Mock Sponsored Promotion */}
          <MockAd />
        </>
      ) : isAuthenticated && user ? (
        <>
          {/* Mini Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={
                  user.imageUrl ||
                  user.image_url ||
                  'https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png'
                }
                alt={user.username}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border border-gray-100 dark:border-slate-800 object-cover"
              />
              <div className="overflow-hidden">
                <Link
                  href={`/u/${user.username}`}
                  className="font-bold text-sm text-sky-800 dark:text-sky-400 hover:text-sky-950 dark:hover:text-sky-200 truncate block"
                >
                  {user.username}
                </Link>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {t('joined', 'Joined')}: {moment(user.createdAt).format('DD.MM.YYYY')}
                </p>
              </div>
            </div>

            {/* User Stats Grid */}
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-50 dark:border-slate-800/80 text-center text-xs text-gray-600 dark:text-slate-400 mb-3">
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200 block">{stats?.entryCount ?? 0}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('entries', 'Entries')}</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200 block">{stats?.followerCount ?? 0}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('followers', 'Followers')}</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200 block">{stats?.followingCount ?? 0}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('following', 'Following')}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-1 text-xs">
              <Link
                href={`/u/${user.username}`}
                className="px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium transition"
              >
                👤 {t('view_profile', 'My Profile')}
              </Link>
              {roleId && roleId >= 3 && (
                <Link
                  href="/moderation"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium transition flex items-center justify-between"
                >
                  <span>🛡️ {t('moderation', 'Moderation Panel')}</span>
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded">Mod</span>
                </Link>
              )}
            </div>
          </div>

          {/* Real-time Notifications Feed */}
          <Notifications />

          {/* Mock Sponsored Promotion */}
          <MockAd />
        </>
      ) : (
        <>
          {/* Guest Widget: Inline Login / Register Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 mb-4">
              <button
                type="button"
                onClick={() => setGuestTab('login')}
                className={`pb-1 text-xs font-bold transition border-b-2 cursor-pointer ${
                  guestTab === 'login'
                    ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-400'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {t('sign_in', 'Sign In')}
              </button>
              <button
                type="button"
                onClick={() => setGuestTab('register')}
                className={`pb-1 text-xs font-bold transition border-b-2 cursor-pointer ${
                  guestTab === 'register'
                    ? 'border-sky-600 dark:border-sky-400 text-sky-700 dark:text-sky-400'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {t('sign_up', 'Sign Up')}
              </button>
            </div>

            {guestTab === 'login' ? (
              <form onSubmit={loginFormik.handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-slate-400 mb-1">
                    {t('username', 'Username')}
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="username or email"
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.username}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-slate-400 mb-1">
                    {t('password', 'Password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.password}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {authLoading ? t('signing_in', 'Signing in...') : t('sign_in', 'Sign In')}
                </button>
                <div className="text-center pt-1">
                  <Link href="/auth/forgot-password" className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline">
                    {t('forgot_password', 'Forgot password?')}
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={registerFormik.handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-slate-400 mb-1">
                    {t('username', 'Username')}
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    onChange={registerFormik.handleChange}
                    value={registerFormik.values.username}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-slate-400 mb-1">
                    {t('email', 'Email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    onChange={registerFormik.handleChange}
                    value={registerFormik.values.email}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-slate-400 mb-1">
                    {t('password', 'Password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={registerFormik.handleChange}
                    value={registerFormik.values.password}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {authLoading
                    ? t('creating', 'Creating account...')
                    : t('creating_account', 'Create Account')}
                </button>
              </form>
            )}
          </div>

          {/* Mock Sponsored Promotion */}
          <MockAd />
        </>
      )}
    </aside>
  );
};

export default RightFrame;
