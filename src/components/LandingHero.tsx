import React from 'react';

const LandingHero: React.FC = () => {
  // No need to use isDarkMode as we're using fixed styling
  
  return (
    <div className="text-center my-10" style={{ position: 'relative', zIndex: 30 }}>
      <h1 className="text-4xl md:text-6xl font-bold text-white" style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
        Swap anytime,<br />anywhere.
      </h1>
    </div>
  );
};

export default LandingHero;