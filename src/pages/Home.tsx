import React, { useState, useEffect } from 'react';
import SwapCard from '../components/SwapCard';
import BackgroundIcons from '../components/BackgroundIcons';
import FooterText from '../components/FooterText';
import SearchBar from '../components/SearchBar';
import { theme } from '../styles/theme';
import '../components/IntroAnimation.css';

const Home = () => {
  // Animation states
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showSwapWidget, setShowSwapWidget] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Check if animation has already played in this session
    const hasAnimationPlayed = sessionStorage.getItem('introAnimationPlayed');
    
    if (hasAnimationPlayed) {
      // Skip animation if already played - instantly show everything
      setShowFirstLine(true);
      setShowSecondLine(true);
      setShowSwapWidget(true);
      setAnimationComplete(true);
      return;
    }

    // Immediately start first animation
    requestAnimationFrame(() => {
      setShowFirstLine(true);
      
      // Set animation sequence with optimized delays
      const timer2 = setTimeout(() => {
        setShowSecondLine(true);
      }, 500); // Reduced from 800ms to 500ms
      
      const timer3 = setTimeout(() => {
        setShowSwapWidget(true);
      }, 1000); // Reduced from 1500ms to 1000ms
      
      const timer4 = setTimeout(() => {
        setAnimationComplete(true);
        // Mark animation as played for this session
        sessionStorage.setItem('introAnimationPlayed', 'true');
      }, 1600); // Reduced from 2200ms to 1600ms
      
      // Cleanup timers on unmount
      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    });
  }, []);

  // Function to reset animation state for testing
  const resetAnimation = () => {
    sessionStorage.removeItem('introAnimationPlayed');
    window.location.reload();
  };

  // Toggle debug panel with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Main Content */}
      <section className="min-h-screen pt-[64px] md:pt-[72px] flex flex-col items-center relative z-30">
        <h1 className="text-[48px] md:text-[64px] font-bold text-white text-center leading-[1.1] tracking-tight mb-10 md:mb-12">
          <div 
            className={`${showFirstLine ? 'title-first-line-visible' : 'cinematic-text-hidden'}`}
            style={{ animationDuration: '0.7s' }} // Faster animation
          >
            Swap anytime,
          </div>
          <div 
            className={`${showSecondLine ? 'title-second-line-visible' : 'cinematic-text-hidden'}`}
            style={{ animationDuration: '0.7s' }} // Faster animation
          >
            anywhere.
          </div>
        </h1>

        <div 
          className={`relative z-50 ${showSwapWidget ? 'widget-visible animate-scale-in' : 'widget-hidden'} scale-90`}
          style={{ animationDuration: '0.8s' }} // Faster animation
        >
          <SwapCard />
        </div>

        <p 
          className={`text-center text-gray-400 mt-8 max-w-[480px] mx-auto px-4 transition-all duration-700 ease-in-out ${
            showSwapWidget ? 'opacity-100 animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDuration: '0.7s', transitionDelay: '200ms' }} // Faster animation
        >
          Inspired by Uniswap. Swap crypto across Ethereum and 11+ chains.
        </p>
      </section>

      {/* Background - always present but opacity changes */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          animationComplete ? 'opacity-100' : 'opacity-10'
        }`}
      >
        <BackgroundIcons />
      </div>

      {/* Footer */}
      <div 
        className={`absolute bottom-8 left-0 right-0 z-10 transition-opacity duration-1000 ease-in-out ${
          animationComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FooterText />
      </div>

      {/* Debug panel - press Ctrl+Shift+D to show */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-4 rounded-lg text-white">
          <h4 className="text-sm font-bold mb-2">Debug Controls</h4>
          <button 
            onClick={resetAnimation}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            Reset Animation
          </button>
          <div className="text-xs mt-2 text-gray-400">Press Ctrl+Shift+D to hide</div>
        </div>
      )}
    </div>
  );
};

export default Home; 