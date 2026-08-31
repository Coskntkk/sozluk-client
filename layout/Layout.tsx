import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftFrame from './components/LeftFrame';
import RightFrame from './components/RightFrame';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { checkLogin } from '@/redux/auth/AuthSlice';
import { AppDispatch } from '@/redux/store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Don't run checkLogin on auth pages
    const pathname = router.pathname || '';
    if (pathname.startsWith('/auth')) return;
    dispatch(checkLogin());
  }, [dispatch, router.pathname]);

  // Auth pages (login, register, forgot-password) get a simplified single-column layout
  const isAuthPage = router.pathname?.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      {isAuthPage ? (
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
          {children}
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column (Agenda & Trending) */}
            <div className="hidden md:block md:col-span-3 lg:col-span-3">
              <LeftFrame />
            </div>

            {/* Center Column (Main Content) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6 min-w-0">
              {children}
            </div>

            {/* Right Column (Interaction & Profile) */}
            <div className="hidden md:block md:col-span-3 lg:col-span-3">
              <RightFrame />
            </div>
          </div>
        </main>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
