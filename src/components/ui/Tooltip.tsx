import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-48 px-3 py-2 text-xs text-white bg-[#1B2236] rounded-md shadow-lg -left-20 bottom-full mb-2">
          <div 
            className="absolute w-2 h-2 bg-[#1B2236] rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"
          ></div>
          {content}
        </div>
      )}
    </div>
  );
}; 