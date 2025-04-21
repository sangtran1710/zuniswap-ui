import React from 'react';
import SwapCard from '../components/SwapCard';
import Header from '../components/Header';
import BackgroundIcons from '../components/BackgroundIcons';
import FooterText from '../components/FooterText';
import SearchBar from '../components/SearchBar';
import { theme } from '../styles/theme';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      <Header />
      
      {/* Main Content */}
      <section className="min-h-screen pt-[64px] md:pt-[72px] flex flex-col items-center relative z-30">
        <h1 className="text-[48px] md:text-[64px] font-bold text-white text-center leading-[1.1] tracking-tight mb-10 md:mb-12">
          Swap anytime,<br /> anywhere.
        </h1>

        <div className="relative z-50">
          <SwapCard />
        </div>

        <p className="text-center text-gray-400 mt-8 max-w-[480px] mx-auto px-4">
          The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.
        </p>

        <div className="flex flex-col items-center mt-16 opacity-60">
          <p className="text-sm text-white mb-1">Scroll to learn more</p>
          <ChevronDownIcon className="w-5 h-5 animate-bounce text-white" />
        </div>
      </section>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundIcons />
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <FooterText />
      </div>
    </div>
  );
};

export default Home; 