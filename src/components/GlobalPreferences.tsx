import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisHorizontalIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useGlobalStore } from '../store/useGlobalStore';

interface GlobalPreferencesProps {
  className?: string;
}

// Mapping từ giá trị trong store sang giá trị hiển thị
const themeLabels: Record<string, string> = {
  'auto': 'Auto',
  'light': 'Light',
  'dark': 'Dark'
};

const languageLabels: Record<string, string> = {
  'en': 'English',
  'vi': 'Tiếng Việt',
  'zh': '中文',
  'ko': '한국어',
  'ja': '日本語'
};

const currencyLabels: Record<string, string> = {
  'USD': 'USD',
  'EUR': 'EUR',
  'GBP': 'GBP',
  'JPY': 'JPY',
  'VND': 'VND'
};

const GlobalPreferences: React.FC<GlobalPreferencesProps> = ({ className }) => {
  // Lấy state và actions từ global store
  const { 
    themeMode, 
    language, 
    currency, 
    setThemeMode, 
    setLanguage, 
    setCurrency 
  } = useGlobalStore();
  
  // State cho việc mở/đóng dropdown
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  
  // Options cho theme, language và currency
  const themeOptions = ['auto', 'light', 'dark'];
  const languageOptions = ['en', 'vi', 'zh', 'ko', 'ja'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'VND'];

  return (
    <Menu as="div" className={`relative ${className}`}>
      <Menu.Button className="flex items-center justify-center p-2 hover:bg-[#1C2537] rounded-full transition-colors">
        <EllipsisHorizontalIcon className="w-5 h-5 text-[#98A1C0]" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter=""
        enterFrom=""
        enterTo=""
        leave=""
        leaveFrom=""
        leaveTo=""
      >
        <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-[#0D111C] border border-[#2E2F32] shadow-lg focus:outline-none z-50">
          {/* Header */}
          <div className="p-4 border-b border-[#2E2F32]">
            <div className="text-base font-semibold text-white">Global preferences</div>
          </div>
          
          {/* Theme Section */}
          <div className="p-4 border-b border-[#2E2F32]">
            <div className="text-sm text-[#98A1C0] mb-2">Theme</div>
            <div className="flex gap-2">
              {themeOptions.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setThemeMode(theme as any)}
                  className={`px-3 py-1.5 rounded-xl transition-colors text-sm font-medium ${
                    themeMode === theme
                      ? 'bg-[#131A2A] text-white'
                      : 'text-[#98A1C0] hover:bg-[#131A2A]'
                  }`}
                >
                  {theme === 'auto' && (
                    <span className="flex items-center">
                      <SunIcon className="w-3.5 h-3.5 mr-1" />
                      <MoonIcon className="w-3.5 h-3.5 mr-1" />
                    </span>
                  )}
                  {themeLabels[theme]}
                </button>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div className="p-4 border-b border-[#2E2F32]">
            <div className="text-sm text-[#98A1C0] mb-2">Language</div>
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#131A2A] text-white hover:bg-[#1C2537] transition-colors text-sm font-medium text-left flex justify-between items-center"
              >
                <span>{languageLabels[language]}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLanguageOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#131A2A] rounded-xl border border-[#2E2F32] overflow-hidden z-50">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang as any);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-sm ${language === lang ? 'text-white bg-[#1C2537]' : 'text-[#98A1C0]'} hover:bg-[#1C2537] transition-colors text-left`}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Currency Section */}
          <div className="p-4">
            <div className="text-sm text-[#98A1C0] mb-2">Currency</div>
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#131A2A] text-white hover:bg-[#1C2537] transition-colors text-sm font-medium text-left flex justify-between items-center"
              >
                <span>{currencyLabels[currency]}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCurrencyOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#131A2A] rounded-xl border border-[#2E2F32] overflow-hidden z-50">
                  {currencyOptions.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr as any);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-sm ${currency === curr ? 'text-white bg-[#1C2537]' : 'text-[#98A1C0]'} hover:bg-[#1C2537] transition-colors text-left`}
                    >
                      {currencyLabels[curr]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default GlobalPreferences; 