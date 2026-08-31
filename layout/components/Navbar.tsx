import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/auth/AuthSlice';
import { useRouter } from 'next/router';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import { AppDispatch, RootState } from '@/redux/store';

const Navbar: React.FC = () => {
  const { t } = useTranslation('navbar');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user, roleId, isInitialized } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout({ router }));
  };

  const isModOrAdmin = roleId && roleId >= 3;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 border-b border-gray-100 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:rotate-6 transition duration-200">📖</span>
            <span className="font-extrabold text-lg text-sky-800 dark:text-sky-400 tracking-tight">Sözlük</span>
          </Link>

          {isModOrAdmin && (
            <Link
              href="/moderation"
              className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition font-medium"
            >
              🛡️ {t('moderation', 'Moderation')}
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-2">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageSwitcher />

          {!isInitialized ? (
            <div className="w-16 h-8 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-slate-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/u/${user.username}`}
                className="text-xs font-semibold text-sky-800 dark:text-sky-300 hover:text-sky-950 dark:hover:text-sky-200 hover:underline flex items-center gap-1.5"
              >
                <span>👤</span>
                <span className="hidden sm:inline">{user.username}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
              >
                {t('logout', 'Sign out')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                {t('login', 'Sign in')}
              </Link>
              <Link
                href="/auth/register"
                className="text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-lg shadow-sm transition"
              >
                {t('register', 'Sign up')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
