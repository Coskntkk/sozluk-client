import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import AuthService from '@/services/AuthService';
import { successNote, errorNote } from '@/utils/ToastNotify';

const ResetPasswordComponent: React.FC = () => {
  const { t } = useTranslation('reset_password');
  const router = useRouter();
  const { token } = router.query;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      if (!token || typeof token !== 'string') {
        errorNote('Invalid or missing reset token');
        return;
      }
      setLoading(true);
      try {
        await AuthService.resetPassword({
          token,
          password: values.password,
        });
        setSuccess(true);
        successNote('Password reset successfully. Please log in.');
      } catch (err: any) {
        errorNote(err.response?.data?.message || 'Password reset failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('title', 'Set New Password')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('description', 'Please enter your new password below.')}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm">
              {t('reset_success_notice', 'Your password has been reset successfully.')}
            </div>
            <Link
              href="/auth/login"
              className="inline-block w-full text-white bg-sky-600 hover:bg-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {t('sign_in_now', 'Sign in now')}
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-700">
                {t('new_password', 'New Password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
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

            <div>
              <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-medium text-gray-700">
                {t('confirm_new_password', 'Confirm New Password')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none transition ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="w-full mt-2 text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? t('resetting_password', 'Resetting password...')
                : t('update_password', 'Update password')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordComponent;
