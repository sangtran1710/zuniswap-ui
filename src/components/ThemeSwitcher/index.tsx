import React, { useState, useRef, useEffect } from 'react';
import { useGlobalStore } from '../../store/useGlobalStore';
import { Sun, Moon, Monitor } from 'react-feather';

type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { themeMode, setThemeMode, isDarkMode } = useGlobalStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      icon: <Monitor size={16} className={isDarkMode ? 'text-white/70' : 'text-gray-700'} />,
      label: 'Auto'
    },
    {
      mode: 'light',
      icon: <Moon size={16} className="text-gray-700" />,
      label: 'Light'
    },
    {
      mode: 'dark',
      icon: <Sun size={16} className="text-amber-500" />,
      label: 'Dark'
    }
  ];

  // Icon hiện tại dựa vào theme mode
  const getCurrentIcon = () => {
    if (themeMode === 'auto') {
      return <Monitor size={20} className={isDarkMode ? 'text-white/70' : 'text-gray-700'} />;
    } else if (themeMode === 'light') {
      // Hiển thị icon mặt trăng trong chế độ light vì người dùng sẽ muốn chuyển sang chế độ tối
      return <Moon size={20} className="text-gray-700" />;
    } else {
      // Hiển thị icon mặt trời trong chế độ dark vì người dùng sẽ muốn chuyển sang chế độ sáng
      return <Sun size={20} className="text-amber-500" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl ${
          isDarkMode 
            ? 'bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.12]' 
            : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
        }`}
        aria-label="Toggle theme"
      >
        {getCurrentIcon()}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-36 rounded-xl shadow-lg overflow-hidden z-50 ${
          isDarkMode ? 'bg-[#191B1F] border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="py-1">
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => {
                  setThemeMode(option.mode);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  themeMode === option.mode
                    ? isDarkMode
                      ? 'bg-[#2C2F36] text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-[#2C2F36]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
