import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const ICONS = {
    tr: '🇹🇷',
    en: '🇬🇧',
    fr: '🇫🇷',
};

const DEFAULT_LANG = 'en';

const LanguageSwitcher = () => {
    // Hooks
    const { i18n } = useTranslation();
    const router = useRouter();
    const { locales } = router;
    // States
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('')

    const handleChange = (lng) => {
        setOpen(false);
        i18n.changeLanguage(lng);
        localStorage.setItem('lang', lng);
        setSelected(lng);
    };

    useEffect(() => {
        let savedLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : DEFAULT_LANG
        if (!Object.keys(ICONS).includes(savedLang))
            savedLang = DEFAULT_LANG
        i18n.changeLanguage(savedLang);
        setSelected(savedLang);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="relative inline-block text-left z-50">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 px-1 py-.5 border border rounded shadow-sm hover:bg-gray-100"
            >
                <span>{ICONS[selected]}</span>
            </button>

            {open && (
                <div className="absolute mt-2 bg-white border rounded shadow">
                    {locales.map((lng) => (
                        <button
                            key={lng}
                            onClick={() => handleChange(lng)}
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 space-x-2"
                        >
                            <span>{ICONS[lng]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
