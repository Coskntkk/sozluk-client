import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import AuthService from '@/services/AuthService';
import { successNote, errorNote } from '@/utils/ToastNotify';

const ForgotPasswordComponent: React.FC = () => {
  const { t } = useTranslation('forgot_password');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await AuthService.forgotPassword(values);
        setSubmitted(true);
        successNote('Password reset link sent if the email exists.');
      } catch (err: any) {
        errorNote(err.response?.data?.message || 'Failed to send reset link');
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
            {t('title', 'Reset Password')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('description', 'Enter your email and we will send you a link to reset your password.')}
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-sky-50 text-sky-800 rounded-lg text-sm">
              {t(
                'email_sent_notice',
                'If an account with that email exists, we have sent instructions to reset your password.'
              )}
            </div>
            <Link
              href="/auth/login"
              className="inline-block font-semibold text-sky-600 hover:underline text-sm"
            >
              {t('back_to_sign_in', '← Back to sign in')}
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">
                {t('registered_email', 'Registered Email')}
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

            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="w-full mt-2 text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? t('sending_link', 'Sending link...')
                : t('send_reset_link', 'Send reset link')}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              {t('remember_password', 'Remember your password?')}{' '}
              <Link href="/auth/login" className="font-semibold text-sky-600 hover:underline">
                {t('sign_in', 'Sign in')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ForgotPasswordComponent;
