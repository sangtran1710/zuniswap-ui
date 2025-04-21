import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { theme } from '../styles/theme';

const SearchBar: React.FC = () => {
  return (
    <div className="relative max-w-md mx-auto mt-10">
      <div className={`
        relative flex items-center 
        ${theme.radius.card} 
        bg-[#1a1a1a] 
        border border-[#3c3c3c] 
        focus-within:border-blue-500 
        transition-colors
      `}>
        <MagnifyingGlassIcon className={`
          w-5 h-5 
          ${theme.colors.text.secondary}
          absolute left-6
        `} />
        
        <input
          type="text"
          placeholder="Search tokens"
          className={`
            w-full pl-14 pr-6 py-3
            bg-transparent
            ${theme.colors.text.primary}
            ${theme.font.family}
            placeholder:${theme.colors.text.secondary}
            focus:outline-none
          `}
        />
      </div>
    </div>
  );
};

export default SearchBar; 