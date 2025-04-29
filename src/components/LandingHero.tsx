import React from 'react';
import { useGlobalStore } from '../store/useGlobalStore';

const LandingHero: React.FC = () => {
  const { isDarkMode } = useGlobalStore();
  
  return (
    <div className="text-center my-12">
      <h1 className={`text-5xl md:text-7xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Swap anytime,<br />anywhere.
      </h1>
    </div>
  );
};

export default LandingHero;