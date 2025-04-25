import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useGlobalStore } from '../store/useGlobalStore';

// Color variables
const ACCENT_FROM = '#4F46E5'; // Indigo
const ACCENT_TO = '#9333EA';   // Purple
const ACCENT_TO_RGB = '147, 51, 234';  // for rgba()
const LIGHT_BG_FROM = '#E6F0FA'; // Light blue
const LIGHT_BG_TO = '#F3E8FF';   // Light purple
const DARK_BG = '#0f172a';      // Dark blue
const DARK_BG_ACCENT1 = 'rgba(59, 130, 246, 0.04)'; // Blue with opacity
const DARK_BG_ACCENT2 = 'rgba(168, 85, 247, 0.04)'; // Purple with opacity

type Theme = 'system' | 'light' | 'dark';
type Language = 'en' | 'vi';
type Currency = 'USD' | 'VND';

// Translations
const translations = {
  en: {
    globalPreferences: 'Global preferences',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    language: 'Language',
    english: 'English',
    vietnamese: 'Vietnamese',
    currency: 'Currency',
    toggleMenu: 'Toggle menu',
  },
  vi: {
    globalPreferences: 'Cài đặt chung',
    theme: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    auto: 'Tự động',
    language: 'Ngôn ngữ',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    currency: 'Tiền tệ',
    toggleMenu: 'Mở menu',
  }
};

const lightModeStyles = `
  body {
    background: linear-gradient(135deg, ${LIGHT_BG_FROM} 0%, ${LIGHT_BG_TO} 100%) !important;
    color: #2D3748 !important;
    min-height: 100vh !important;
    transition: background 0.3s ease !important;
  }
  
  /* Headings and text */
  h1, h2, h3, h4, h5, h6, p, span, div {
    color: #4A5568 !important;
  }
  
  /* Global heading */
  section h1 {
    text-shadow:0 2px 4px rgba(0,0,0,.06)!important;
    color: #4A5568 !important;
    text-shadow: 0 0 20px rgba(${ACCENT_TO_RGB}, 0.3) !important;
  }
  
  /* Top navbar */
  .bg-transparent {
    background-color: rgba(255,255,255,0.4) !important;
    backdrop-filter: blur(12px) !important;
    border-color: rgba(${ACCENT_TO_RGB}, 0.1) !important;
  }
  
  /* Main swap card */
  .card, .bg-card, .max-w-lg, [class*="bg-[#0D111C]"], [class*="bg-[#111827]"], [class*="bg-[#1C2537]"] {
    background-color: rgba(255,255,255,0.4) !important;
    backdrop-filter: blur(12px) !important;
    border:1px solid rgba(${ACCENT_TO_RGB}, .25) !important;
    box-shadow:0 4px 16px rgba(${ACCENT_TO_RGB}, 0.15) !important;
  }
  
  /* Swap input areas */
  [class*="bg-[#131A2A]"], [class*="bg-[#1a1e2e]"], [class*="bg-[#1a1e2e]"]/70 {
    background-color: rgba(247, 250, 252, 0.7) !important;
    border:1px solid rgba(${ACCENT_TO_RGB}, .25) !important;
  }
  
  /* Card background for token selectors */
  .rounded-2xl, .rounded-xl {
    background-color: rgba(247, 250, 252, 0.7) !important;
    border:1px solid rgba(${ACCENT_TO_RGB}, .25) !important;
  }
  
  /* Text colors */
  .text-gray-100, .text-white, .text-xl {
    color: #4A5568 !important;
  }
  
  .text-gray-400, .text-gray-300, label, .text-gray-500 {
    color: #718096 !important;
  }
  
  /* Input fields */
  input, input::placeholder {
    color: #4A5568 !important;
  }
  
  /* Highlight colors for key elements */
  .text-blue-400, .text-blue-500, .text-purple-400, .text-purple-500 {
    color: ${ACCENT_TO} !important;
  }
  
  /* Menu backgrounds */
  .bg-\\[\\#1f2937\\] {
    background-color: rgba(237, 242, 247, 0.7) !important;
  }
  
  .bg-\\[\\#374151\\] {
    background-color: rgba(${ACCENT_TO_RGB}, 0.2) !important;
  }
  
  /* Buttons background */
  button.rounded-full, button.rounded-2xl, .rounded-full {
    background-color: rgba(255,255,255,0.4) !important;
    border:1px solid rgba(${ACCENT_TO_RGB}, .25) !important;
  }
  
  /* Gradient buttons */
  button.from-blue-600, button.from-blue-700, button.bg-gradient-to-r {
    background: linear-gradient(135deg, ${ACCENT_FROM} 0%, ${ACCENT_TO} 100%) !important;
    border: none !important;
    color: white !important;
  }
  
  /* Token select buttons */
  button.self-start {
    background-color: rgba(${ACCENT_TO_RGB}, 0.1) !important;
    color: #6B46C1 !important;
  }
  
  /* Swap direction button */
  button.z-10 {
    box-shadow:0 0 4px rgba(${ACCENT_TO_RGB},.35)!important;
  }
  button.z-10:hover{
    box-shadow:0 0 8px rgba(${ACCENT_TO_RGB},.45)!important;
  }
    background-color: rgba(255,255,255,0.4) !important;
    border:1px solid rgba(${ACCENT_TO_RGB}, .25) !important;
  }
  
  /* Swap "Enter an amount" button */
  .bg-\\[\\#22242A\\], button.py-4 {
    background: linear-gradient(135deg, ${ACCENT_FROM} 0%, ${ACCENT_TO} 100%) !important;
    color: white !important;
    border: none !important;
  }
  
  /* Disabled buttons */
  button.bg-gray-700, button.cursor-not-allowed {
    background-color: rgba(203, 213, 224, 0.5) !important;
    color: #718096 !important;
    border: 1px solid rgba(203, 213, 224, 0.3) !important;
  }
  
  /* Border colors */
  .border-gray-800, .border-\\[\\#1C2537\\], .border-\\[\\#2E2F32\\] {
    border-color: rgba(${ACCENT_TO_RGB}, 0.1) !important;
  }
  
  /* Footer text */
  p.text-gray-400, p.text-center {
    color: #718096 !important;
  }
  
  /* Glow effect for particles */
  svg circle, svg path, [class*="particle"], [class*="blob"] {
    filter: drop-shadow(0 0 8px rgba(${ACCENT_TO_RGB}, 0.5)) !important;
  }
`;

const darkModeStyles = `
  body {
    background-color:#0c1122 !important;          /* tối hơn #0f172a */
    color:#e2e8f0 !important;                     /* slate‑200 */
    background:
      radial-gradient(circle at 30% 20%, rgba(59,130,246,0.25) 0%, transparent 45%),
      radial-gradient(circle at 70% 80%, rgba(139,92,246,0.25) 0%, transparent 45%),
      #0c1122 !important;
    min-height:100vh!important;
    transition:background .3s ease!important;
  }
  
  .bg-\\[\\#111827\\] {
    background-color:#1c2333!important;
    border-color:rgba(${ACCENT_TO_RGB},.30)!important;
    box-shadow:0 4px 24px rgba(0,0,0,.45)!important;
    background-color: ${DARK_BG} !important;
    border-color: #1f2937 !important;
  }
  
  .text-gray-100 {
    color: #f8fafc !important;
  }
  
  .text-gray-400, .text-gray-300 { color:#94a3b8!important;
    color: #9ca3af !important;
  }
  
  .text-white { color:#f8fafc!important;
    color: #f8fafc !important;
  }
  
  .bg-\\[\\#1f2937\\] {
    background-color:#0d1220!important;
    background-color: #1f2937 !important;
  }
  
  .bg-\\[\\#374151\\] {
    background-color: #374151 !important;
  }
  
  svg {
    color: #d1d5db !important;
  }
  
  .border-gray-800 {
    border-color: rgba(${ACCENT_TO_RGB}, 0.2) !important;
  }
  .navbar-dark{background-color:rgba(13,17,28,.80)!important;backdrop-filter:blur(8px)!important;}
  .dark .bg-\\[\\#111827\\]{background-color:rgba(13,17,28,.85)!important;}
  
  /* Gradient buttons in dark mode */
  button:hover, .dark [role='button']:hover{
    border-color:rgba(${ACCENT_TO_RGB},.6)!important;
    box-shadow:0 0 6px rgba(${ACCENT_TO_RGB},.25)!important;
  }
  button.from-blue-600, button.from-blue-700, button.bg-gradient-to-r {
    background: linear-gradient(135deg, ${ACCENT_FROM} 0%, ${ACCENT_TO} 100%) !important;
  }
  
  /* Glow effect for elements in dark mode */
  .text-blue-500, .text-purple-500 {
    color: ${ACCENT_TO} !important;
    text-shadow: 0 0 8px rgba(${ACCENT_TO_RGB}, 0.5) !important;
  }
`;

const GlobalMenu: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useGlobalStore();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(isDarkMode ? 'dark' : 'light');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  
  // Get translations based on selected language
  const t = translations[selectedLanguage];

  // Create style element for theme CSS
  useEffect(() => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    setStyleElement(style);
    
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const applyTheme = (theme: Theme) => {
    if (!styleElement) return;
    
    // Remove all theme classes first
    document.documentElement.classList.remove('light', 'dark', 'system');
    
    if (theme === 'light') {
      styleElement.innerHTML = lightModeStyles;
      document.documentElement.classList.add('light');
      if (isDarkMode) toggleDarkMode();
    } else if (theme === 'dark') {
      styleElement.innerHTML = darkModeStyles;
      document.documentElement.classList.add('dark');
      if (!isDarkMode) toggleDarkMode();
    } else { // system
      // Always default to dark mode for system/auto option
      document.documentElement.classList.add('system');
      styleElement.innerHTML = darkModeStyles;
      if (!isDarkMode) toggleDarkMode();
    }
  };

  // Apply initial theme
  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme, styleElement]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle theme selection
  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  // Sync with global store when it changes externally
  useEffect(() => {
    const newTheme = isDarkMode ? 'dark' : 'light';
    if (selectedTheme !== newTheme && selectedTheme !== 'system') {
      setSelectedTheme(newTheme);
    }
  }, [isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        aria-label={t.toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1e2e] hover:bg-[#252d3f] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 focus:outline-none"
      >
        <svg className="w-6 h-6 text-gray-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="19" cy="12" r="2" fill="currentColor" />
          <circle cx="5" cy="12" r="2" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 rounded-lg bg-[#111827] shadow-xl border border-gray-800 overflow-hidden z-50"
          style={{ minWidth: '280px' }}
        >
          <div className="py-3 px-4">
            <h3 className="text-gray-100 font-medium text-lg mb-4">{t.globalPreferences}</h3>
            
            {/* Theme Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">{t.theme}</span>
                <div className="flex bg-[#1f2937] rounded-full p-1">
                  <button
                    onClick={() => handleThemeChange('system')}
                    aria-label={t.auto}
                    className={`flex items-center justify-center w-10 h-8 rounded-full ${selectedTheme === 'system' ? 'bg-[#374151]' : ''} transition-colors`}
                  >
                    <ComputerDesktopIcon className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    aria-label={t.light}
                    className={`flex items-center justify-center w-10 h-8 rounded-full mx-1 ${selectedTheme === 'light' ? 'bg-[#374151]' : ''} transition-colors`}
                  >
                    <SunIcon className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    aria-label={t.dark}
                    className={`flex items-center justify-center w-10 h-8 rounded-full ${selectedTheme === 'dark' ? 'bg-[#374151]' : ''} transition-colors`}
                  >
                    <MoonIcon className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Section */}
            <div className="mb-4">
              <button 
                onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'vi' : 'en')}
                className="w-full flex justify-between items-center py-2.5 text-left"
              >
                <span className="text-gray-400">{t.language}</span>
                <div className="flex items-center">
                  <span className="text-white mr-2">{selectedLanguage === 'en' ? 'English' : 'Tiếng Việt'}</span>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            </div>

            {/* Currency Section */}
            <div className="mb-1">
              <button 
                onClick={() => setSelectedCurrency(selectedCurrency === 'USD' ? 'VND' : 'USD')}
                className="w-full flex justify-between items-center py-2.5 text-left"
              >
                <span className="text-gray-400">{t.currency}</span>
                <div className="flex items-center">
                  <span className="text-white mr-2">{selectedCurrency}</span>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalMenu; 