import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${className}`}
      onClick={toggleTheme}
      aria-label={t('common.darkMode')}
      title={t('common.darkMode')}
    >
      <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors">
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          initial={false}
          animate={{
            x: isDarkMode ? 'calc(100% + 4px)' : '4px',
            backgroundColor: isDarkMode ? '#c084fc' : '#ffffff',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
      {isDarkMode ? (
        <MoonIcon className="w-5 h-5 text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
      ) : (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle; 