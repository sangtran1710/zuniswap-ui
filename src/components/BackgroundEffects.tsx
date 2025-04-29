import React from 'react';
import { useGlobalStore } from '../store/useGlobalStore';

const BackgroundEffects: React.FC = () => {
  const { isDarkMode } = useGlobalStore();
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${isDarkMode ? 'backdrop-blur-sm' : 'bg-white'}`} style={{ opacity: isDarkMode ? 1 : 0.2 }}>
      {/* Gradient blobs */}
      <div className={`absolute -top-40 -left-40 w-80 h-80 bg-[#FF007A] rounded-full ${isDarkMode ? 'opacity-5' : 'opacity-1'} md:blur-[120px] blur-[80px]`}></div>
      <div className={`absolute top-40 -right-20 w-60 h-60 bg-blue-500 rounded-full ${isDarkMode ? 'opacity-5' : 'opacity-1'} md:blur-[120px] blur-[80px]`}></div>
      
      {/* Floating tokens - similar to Uniswap */}
      <div className={`absolute top-1/4 left-1/5 w-12 h-12 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/2'} blur-md animate-float-slow`}></div>
      <div className={`absolute top-1/3 right-1/4 w-16 h-16 rounded-full ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-500/2'} blur-md animate-float-slower`}></div>
      <div className={`absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-green-500/20' : 'bg-green-500/2'} blur-md animate-float`}></div>
      <div className={`absolute bottom-1/4 right-1/5 w-14 h-14 rounded-full ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/2'} blur-md animate-float-slow`}></div>
      <div className={`absolute top-1/2 left-1/4 w-8 h-8 rounded-full ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-500/2'} blur-md animate-float-slower`}></div>
      <div className={`absolute top-2/3 right-1/3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/2'} blur-md animate-float`}></div>
    </div>
  );
};

export default BackgroundEffects;