import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TitleService from '@/services/TitleService';
import { errorNote, successNote } from '@/utils/ToastNotify';

const CreateEntry = ({ titleId, onEntryCreated }) => {
    const { t } = useTranslation('post_entry');
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            message: ''
        },
        validationSchema: Yup.object({
            message: Yup.string()
                .min(1, t('enter_message'))
                .max(280, t('message_limit'))
                .required(t('enter_message'))
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await TitleService.postEntryToTitle(titleId, values.message);
                successNote('Entry created successfully');
                formik.resetForm();
                if (onEntryCreated) {
                    onEntryCreated();
                }
            } catch (error) {
                console.error('Error creating entry:', error);
                errorNote(error.response?.data?.message || 'Failed to create entry');
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    return (
        <div className="mb-6 mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('new_entry')}
            </h3>
            {isAuthenticated ? (
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Write your entry here..."
                            rows="4"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${formik.touched.message && formik.errors.message
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="mt-2 text-sm text-red-500">
                                {formik.errors.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        {isSubmitting ? t('posting') : t('post_entry')}
                    </button>
                </form>
            ) : (
                <div className="space-y-3 text-center text-gray-700">
                    <p className="text-sm">
                        {t('login_alert')}
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link href="/auth/login">
                            <p className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 transition">
                                {t('login')}
                            </p>
                        </Link>
                        <Link href="/auth/register">
                            <p className="px-4 py-2 rounded border border-sky-600 text-sky-600 hover:bg-sky-50 transition">
                                {t('register')}
                            </p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEntry;
