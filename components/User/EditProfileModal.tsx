import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import UserService from '@/services/UserService';
import { successNote, errorNote } from '@/utils/ToastNotify';
import { UserProfile } from '@/types';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onUpdated }) => {
  const { t } = useTranslation('edit_profile');
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      imageUrl: user.imageUrl || user.image_url || '',
      bio: user.bio || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      imageUrl: Yup.string().url('Must be a valid URL').nullable(),
      bio: Yup.string().max(300, 'Bio must be at most 300 characters'),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        await UserService.updateMe({
          imageUrl: values.imageUrl.trim() || undefined,
          bio: values.bio.trim() || undefined,
        });
        successNote(t('success', 'Profile updated successfully'));
        onUpdated();
        onClose();
      } catch (err: any) {
        errorNote(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">{t('title', 'Edit Profile')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('avatar_url', 'Avatar Image URL')}
            </label>
            <input
              type="text"
              name="imageUrl"
              placeholder="https://example.com/my-photo.jpg"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.imageUrl}
              className={`w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                formik.touched.imageUrl && formik.errors.imageUrl ? 'border-red-400' : 'border-gray-200 dark:border-slate-700'
              }`}
            />
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <p className="mt-1 text-[11px] text-red-500">{formik.errors.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('bio', 'Bio / About Me')}
            </label>
            <textarea
              name="bio"
              rows={3}
              maxLength={300}
              placeholder={t('bio_placeholder', 'Write a brief bio about yourself...')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              className={`w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none ${
                formik.touched.bio && formik.errors.bio ? 'border-red-400' : 'border-gray-200 dark:border-slate-700'
              }`}
            />
            <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
              <span>{formik.touched.bio && formik.errors.bio ? String(formik.errors.bio) : ''}</span>
              <span>{300 - formik.values.bio.length} {t('chars_left', 'chars left')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              {t('cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting ? t('saving', 'Saving...') : t('save_changes', 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
