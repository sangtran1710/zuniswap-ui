import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n, { changeLanguage } from '../lib/i18n';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('zuniswap-language') as Language) || 'en';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'en';
    }
  });

  // Function to change language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    changeLanguage(lang);
  };

  // Effect to initialize language on first render
  useEffect(() => {
    // This ensures i18n is using the same language as our state
    if (i18n.language !== language) {
      changeLanguage(language);
    }
  }, [language]);

  const value = {
    language,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 