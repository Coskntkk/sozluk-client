import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';
import TitleService from '@/services/TitleService';
import { errorNote, successNote } from '@/utils/ToastNotify';
import { useRouter } from 'next/router';

interface CreateEntryAndTitleProps {
  titleName: string;
  onEntryCreated?: () => void;
}

const CreateEntryAndTitle: React.FC<CreateEntryAndTitleProps> = ({ titleName }) => {
  const { t } = useTranslation('post_entry');
  const { isAuthenticated, roleId } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: Yup.object({
      message: Yup.string()
        .min(1, t('enter_message', 'Please enter your message'))
        .max(280, t('message_limit', 'Message cannot exceed 280 characters'))
        .required(t('enter_message', 'Please enter your message')),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const titleResp = await TitleService.createTitle({ name: titleName });
        const newTitle = titleResp.data;

        await TitleService.postEntryToTitle(newTitle.id, values.message);

        if (roleId === 1) {
          successNote(t('rookie_entry_submitted', 'Topic and entry submitted! Subject to moderation approval.'));
        } else {
          successNote(t('title_and_entry_created', 'Topic created and entry posted!'));
        }

        router.push(`/t/${newTitle.slug}`);
      } catch (error: any) {
        errorNote(error.response?.data?.message || 'Failed to create topic and entry');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const insertBkzTag = (type: 'bkz' | 'bkz-gizli') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formik.values.message;
    const selectedText = text.substring(start, end) || 'topic';
    const tag = `(${type}: ${selectedText})`;

    const newText = text.substring(0, start) + tag + text.substring(end);
    formik.setFieldValue('message', newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + type.length + 3, start + tag.length - 1);
    }, 0);
  };

  return (
    <div className="my-6 p-5 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
          {t('new_title', 'Create Topic')}: &ldquo;{titleName}&rdquo;
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Be the first to create this topic by writing an initial entry.
        </p>
      </div>

      {isAuthenticated ? (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => insertBkzTag('bkz')}
              className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-800 dark:hover:text-sky-300 font-medium transition cursor-pointer"
            >
              (bkz: ...)
            </button>
            <button
              type="button"
              onClick={() => insertBkzTag('bkz-gizli')}
              className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-800 dark:hover:text-sky-300 font-medium transition cursor-pointer"
            >
              (bkz-gizli: ...)
            </button>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 ml-auto">
              {280 - formik.values.message.length} characters left
            </span>
          </div>

          <div>
            <textarea
              ref={textareaRef}
              id="message"
              name="message"
              placeholder={`Write the first entry for "${titleName}"...`}
              rows={4}
              maxLength={280}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              className={`w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-850 resize-none transition ${
                formik.touched.message && formik.errors.message ? 'border-red-400' : 'border-gray-200 dark:border-slate-700'
              }`}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !formik.values.message.trim()}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium text-xs py-2 px-6 rounded-lg transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? t('posting', 'Creating...') : t('post_entry', 'Create & Post')}
            </button>
          </div>
        </form>
      ) : (
        <div className="py-6 text-center space-y-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-slate-400">
            {t('login_alert', 'Please sign in or create an account to start this topic.')}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-1.5 text-xs rounded-lg bg-sky-600 text-white hover:bg-sky-700 font-medium transition"
            >
              {t('login', 'Sign in')}
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-medium transition"
            >
              {t('register', 'Sign up')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEntryAndTitle;
