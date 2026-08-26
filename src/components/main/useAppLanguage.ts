import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { applyDocumentLanguage } from '@/i18n/direction';

export function useAppLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const detectLanguageChange = () => {
      const language = window.navigator.language;

      void i18n.changeLanguage(language);
    };

    const applyLanguageChange = (language: string) => {
      applyDocumentLanguage(language);
    };

    applyLanguageChange(i18n.resolvedLanguage || i18n.language || 'en');

    detectLanguageChange();

    window.addEventListener('languagechange', detectLanguageChange);
    i18n.on('languageChanged', applyLanguageChange);
    return () => {
      window.removeEventListener('languagechange', detectLanguageChange);
      i18n.off('languageChanged', applyLanguageChange);
    };
  }, [i18n]);
}
