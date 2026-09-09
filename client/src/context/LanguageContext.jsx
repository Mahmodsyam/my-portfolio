import React, { createContext, useContext, useState, useEffect } from 'react';
import { locales, defaultLanguage } from '../locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('mj_portfolio_lang');
      return saved === 'en' || saved === 'ar' ? saved : defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  });

  const setLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'ar') return;
    setLanguageState(lang);
    try {
      localStorage.setItem('mj_portfolio_lang', lang);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isRTL = language === 'ar';
  const t = locales[language] || locales.ar;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
