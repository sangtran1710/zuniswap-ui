import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, Cog6ToothIcon, SunIcon, MoonIcon, ComputerDesktopIcon, LanguageIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

type Theme = 'system' | 'light' | 'dark';
type Language = 'en' | 'vi';
type Currency = 'USD' | 'VND';

const GlobalMenu: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('system');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  useEffect(() => {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark', 'system');
    // Add selected theme class
    document.documentElement.classList.add(selectedTheme);
  }, [selectedTheme]);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#1C2537] transition-colors">
        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400" />
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
        <Menu.Items className="absolute right-0 mt-1 w-60 origin-top-right rounded-2xl bg-[#0D111C] border border-[#1C2537] shadow-xl">
          <div className="p-2 space-y-1">
            {/* Settings */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-base rounded-xl text-left
                    ${active ? 'bg-[#1C2537]' : ''}
                    text-white
                  `}
                >
                  <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                  Settings
                </button>
              )}
            </Menu.Item>

            {/* Theme Section */}
            <div className="px-3 py-2 border-t border-[#1C2537] mt-2 pt-2">
              <div className="text-sm text-gray-400 mb-2">Theme</div>
              <div className="space-y-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedTheme('light')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedTheme === 'light' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <SunIcon className="w-4 h-4" />
                      Light
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedTheme('dark')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <MoonIcon className="w-4 h-4" />
                      Dark
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedTheme('system')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedTheme === 'system' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <ComputerDesktopIcon className="w-4 h-4" />
                      Auto
                    </button>
                  )}
                </Menu.Item>
              </div>
            </div>

            {/* Language Section */}
            <div className="px-3 py-2 border-t border-[#1C2537] mt-1 pt-2">
              <div className="text-sm text-gray-400 mb-2">Language</div>
              <div className="space-y-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedLanguage('en')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedLanguage === 'en' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <LanguageIcon className="w-4 h-4" />
                      English
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedLanguage('vi')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedLanguage === 'vi' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <LanguageIcon className="w-4 h-4" />
                      Vietnamese
                    </button>
                  )}
                </Menu.Item>
              </div>
            </div>

            {/* Currency Section */}
            <div className="px-3 py-2 border-t border-[#1C2537] mt-1 pt-2">
              <div className="text-sm text-gray-400 mb-2">Currency</div>
              <div className="space-y-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedCurrency('USD')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedCurrency === 'USD' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <CurrencyDollarIcon className="w-4 h-4" />
                      USD
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedCurrency('VND')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left
                        ${active ? 'bg-[#1C2537]' : ''}
                        ${selectedCurrency === 'VND' ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      <CurrencyDollarIcon className="w-4 h-4" />
                      VND
                    </button>
                  )}
                </Menu.Item>
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default GlobalMenu; 