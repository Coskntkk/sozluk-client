import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/auth/AuthSlice';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/redux/store';

const LoginPage: React.FC = () => {
  const { t } = useTranslation('login');
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username or email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap();
        router.push('/');
      } catch {
        // error handling is handled in the thunk via ToastNotify
      }
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('login', 'Sign in to your account')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('welcome_back', 'Welcome back! Please enter your details.')}
          </p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-gray-700">
              {t('your_username', 'Username or Email')}
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none transition ${
                formik.touched.username && formik.errors.username ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="username or email"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-700">
              {t('password', 'Password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none transition ${
                formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="w-full mt-2 text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50 cursor-pointer"
          >
            {loading || formik.isSubmitting ? t('signing_in', 'Signing in...') : t('login', 'Sign in')}
          </button>

          {/* Forgot Password Link below Login button */}
          <div className="text-center pt-1">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
            >
              {t('forgot_password', 'Forgot password?')}
            </Link>
          </div>

          <p className="text-sm text-center text-gray-600 pt-2 border-t border-gray-100">
            {t('dont_have_account', "Don't have an account? ")}{' '}
            <Link href="/auth/register" className="font-semibold text-sky-600 hover:underline">
              {t('register', 'Sign up')}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
