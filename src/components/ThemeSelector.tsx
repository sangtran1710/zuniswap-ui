import React, { useEffect } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { Sun, Moon, Monitor } from 'react-feather';

type ThemeMode = 'auto' | 'light' | 'dark';

const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode, isDarkMode } = useGlobalStore();

  // Lắng nghe sự thay đổi của theme hệ thống khi ở chế độ auto
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Cập nhật theme khi có thay đổi từ hệ thống
    const handleChange = () => {
      if (themeMode === 'auto') {
        setThemeMode('auto'); // Trigger lại để cập nhật isDarkMode
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, setThemeMode]);

  // Các theme options
  const themeOptions: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    {
      mode: 'auto',
      icon: <Monitor size={16} />,
      label: 'Auto'
    },
    {
      mode: 'light',
      icon: <Sun size={16} />,
      label: 'Light'
    },
    {
      mode: 'dark',
      icon: <Moon size={16} />,
      label: 'Dark'
    }
  ];

  return (
    <div className={`flex items-center space-x-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-900/40' : 'bg-gray-100'}`}>
      {themeOptions.map((option) => (
        <button
          key={option.mode}
          onClick={() => setThemeMode(option.mode)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
            themeMode === option.mode
              ? isDarkMode
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800 shadow-sm'
              : isDarkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-800/70'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200/70'
          }`}
          aria-label={`Switch to ${option.label} theme`}
        >
          <span>{option.icon}</span>
          <span className="text-xs font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
