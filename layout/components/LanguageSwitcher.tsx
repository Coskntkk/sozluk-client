import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const ICONS: Record<string, { flag: string; label: string }> = {
  en: { flag: '🇬🇧', label: 'English' },
  tr: { flag: '🇹🇷', label: 'Türkçe' },
  fr: { flag: '🇫🇷', label: 'Français' },
};

const DEFAULT_LANG = 'en';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const locales = router.locales || ['en', 'tr', 'fr'];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(DEFAULT_LANG);

  const handleChange = (lng: string) => {
    setOpen(false);
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lng);
    }
    setSelected(lng);
  };

  useEffect(() => {
    let savedLang = DEFAULT_LANG;
    if (typeof window !== 'undefined') {
      savedLang = localStorage.getItem('lang') || DEFAULT_LANG;
    }
    if (!Object.keys(ICONS).includes(savedLang)) {
      savedLang = DEFAULT_LANG;
    }
    i18n.changeLanguage(savedLang);
    setSelected(savedLang);
  }, [i18n]);

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <span>{ICONS[selected]?.flag || '🌐'}</span>
        <span className="font-medium text-gray-700 dark:text-slate-200 uppercase">{selected}</span>
        <span className="text-[10px] text-gray-400 dark:text-slate-400">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg py-1 overflow-hidden divide-y divide-gray-50 dark:divide-slate-800">
          {locales.map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => handleChange(lng)}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                selected === lng
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{ICONS[lng]?.flag || '🌐'}</span>
              <span>{ICONS[lng]?.label || lng}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
