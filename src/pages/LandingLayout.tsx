import React, { useEffect, useState } from 'react';
import LandingHero from '../components/LandingHero';
import SwapWidget from '../components/SwapWidget';
import BackgroundEffects from '../components/BackgroundEffects';
import MarketplaceInfo from '../components/MarketplaceInfo';

const LandingLayout: React.FC = () => {
  const [contentHeight, setContentHeight] = useState(0);
  
  // Calculate content height
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 72; // Fixed header height
      setContentHeight(viewportHeight - headerHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);
  
  return (
    <main className="relative">
      {/* Create space for fixed header */}
      <div className="h-[72px]"></div>
      
      {/* Main content container */}
      <div 
        className="relative flex flex-col items-center px-4 backdrop-blur-sm"
        style={{ minHeight: `${contentHeight}px` }}
      >
        {/* Background effects */}
        <BackgroundEffects />
        
        {/* Hero section with title */}
        <LandingHero />
        
        {/* Swap widget */}
        <SwapWidget />
        
        {/* Marketplace info and scroll indicator */}
        <MarketplaceInfo />
      </div>
    </main>
  );
};

export default LandingLayout; 