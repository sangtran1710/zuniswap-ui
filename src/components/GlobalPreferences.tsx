import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface GlobalPreferencesProps {
  className?: string;
}

type ThemeOption = 'Auto' | 'Light' | 'Dark';
type LanguageOption = 'English' | 'Spanish' | 'French';
type CurrencyOption = 'USD' | 'EUR' | 'GBP';

const GlobalPreferences: React.FC<GlobalPreferencesProps> = ({ className }) => {
  // State for theme, language, and currency
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('Auto');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('English');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>('USD');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Options for dropdowns
  const languageOptions: LanguageOption[] = ['English', 'Spanish', 'French'];
  const currencyOptions: CurrencyOption[] = ['USD', 'EUR', 'GBP'];

  return (
    <Menu as="div" className={`relative ${className}`}>
      <Menu.Button className="p-2 hover:bg-[#1C2537] rounded-xl transition-colors">
        <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-[#0D111C] border border-[#2E2F32] shadow-lg focus:outline-none divide-y divide-[#2E2F32]">
          {/* Theme Section */}
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Theme</div>
            <div className="flex gap-2">
              {(['Auto', 'Light', 'Dark'] as ThemeOption[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1.5 rounded-xl transition-colors text-sm font-medium ${
                    selectedTheme === theme
                      ? 'bg-[#131A2A] text-white'
                      : 'text-gray-400 hover:bg-[#131A2A]'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Language</div>
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#131A2A] text-white hover:bg-[#1C2537] transition-colors text-sm font-medium text-left flex justify-between items-center"
              >
                <span>{selectedLanguage}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLanguageOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#131A2A] rounded-xl border border-[#2E2F32] overflow-hidden">
                  {languageOptions.map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setIsLanguageOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-sm text-white hover:bg-[#1C2537] transition-colors text-left"
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Currency Section */}
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Currency</div>
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#131A2A] text-white hover:bg-[#1C2537] transition-colors text-sm font-medium text-left flex justify-between items-center"
              >
                <span>{selectedCurrency}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCurrencyOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#131A2A] rounded-xl border border-[#2E2F32] overflow-hidden">
                  {currencyOptions.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setIsCurrencyOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-sm text-white hover:bg-[#1C2537] transition-colors text-left"
                    >
                      {currency}
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