import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  visible?: boolean;
}

const Footer: React.FC<FooterProps> = ({ visible = true }) => {
  const { t } = useTranslation('footer');
  if (!visible) return null;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-6 mt-12 text-center text-xs text-gray-400 dark:text-slate-500 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} {t('copyright', 'Sözlük Platform. All rights reserved.')}</span>
          <span>•</span>
          <a
            href="https://github.com/Coskntkk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition flex items-center gap-1"
          >
            <span>{t('github_by', 'GitHub: @Coskntkk')}</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0</span>
          <span>•</span>
          <a
            href="http://localhost:3000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            {t('api_docs', 'API Documentation')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
