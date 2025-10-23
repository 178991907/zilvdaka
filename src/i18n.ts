import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../public/locales/en/translation.json';
import zhTranslation from '../public/locales/zh/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  'en-zh': {
    translation: {
      ...zhTranslation,
      sidebar: {
        dashboard: `${zhTranslation.sidebar.dashboard} (Dashboard)`,
        tasks: `${zhTranslation.sidebar.tasks} (Tasks)`,
        achievements: `${zhTranslation.sidebar.achievements} (Achievements)`,
        reports: `${zhTranslation.sidebar.reports} (Reports)`,
        settings: `${zhTranslation.sidebar.settings} (Settings)`,
        logout: `${zhTranslation.sidebar.logout} (Logout)`,
      },
      appName: `${zhTranslation.appName} (Habit Heroes)`,
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },
  });

export default i18n;
