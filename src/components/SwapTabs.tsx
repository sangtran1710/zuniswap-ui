import React from 'react';

const tabs = ['Swap', 'Limit', 'Send'];

interface SwapTabsProps {
  selected: string;
  onSelect: (tab: string) => void;
}

export function SwapTabs({ selected, onSelect }: SwapTabsProps) {
  return (
    <div className="flex justify-center gap-6 mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`relative text-sm font-medium capitalize pb-1 ${
            selected === tab ? 'text-blue-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab}
          {selected === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-800" />
          )}
        </button>
      ))}
    </div>
  );
}

export default SwapTabs; 