import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useTranslation } from 'react-i18next';

interface TokenSearchBarProps {
  onSearch?: (query: string) => void;
}

const TokenSearchBar: React.FC<TokenSearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(searchRef, () => {
    if (isOpen) setIsOpen(false);
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };
  
  return (
    <div 
      ref={searchRef}
      className="w-[480px] max-w-[90vw] relative z-10"
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          placeholder={t('Search tokens...')}
          className="w-full p-4 pl-11 bg-black/20 backdrop-blur-md rounded-[24px] text-white border border-white/[0.08] focus:border-white/20 focus:outline-none placeholder-white/50 transition-all"
          autoFocus={isOpen}
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
      </div>
    </div>
  );
};

export default TokenSearchBar; 