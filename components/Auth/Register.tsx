import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/redux/auth/AuthSlice';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '@/redux/store';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation('register');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(register(values)).unwrap();
        router.push('/');
      } catch {
        // Handled in thunk via ToastNotify
      }
    },
  });

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('register', 'Create an account')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('join_community', 'Join the dictionary community and start contributing.')}
          </p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-gray-700">
              {t('your_username', 'Username')}
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
              placeholder="johndoe"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">
              {t('your_email', 'Email')}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none transition ${
                formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
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
              autoComplete="new-password"
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
            className="w-full mt-2 text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50"
          >
            {loading || formik.isSubmitting ? t('registering', 'Creating account...') : t('register', 'Sign up')}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            {t('do_have_account', 'Already have an account? ')}{' '}
            <Link href="/auth/login" className="font-semibold text-sky-600 hover:underline">
              {t('login', 'Sign in')}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
