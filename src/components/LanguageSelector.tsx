'use client';

import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-4 w-4 text-gray-700" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900 font-medium focus:outline-none focus:border-green-500"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code} className="text-gray-900 font-medium">
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}