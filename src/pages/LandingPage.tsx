import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

// ETH SVG logo component to ensure visibility
const EthLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path d="M12.3735 5.25V9.6579L16.0211 11.2793L12.3735 5.25Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 5.25L8.72595 11.2793L12.3735 9.6579V5.25Z" fill="white"/>
    <path d="M12.3735 16.4171V19.4999L16.0248 13.1816L12.3735 16.4171Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 19.4999V16.4171L8.72595 13.1816L12.3735 19.4999Z" fill="white"/>
    <path d="M12.3735 15.4527L16.0211 12.2172L12.3735 10.5994V15.4527Z" fill="white" fillOpacity="0.2"/>
    <path d="M8.72595 12.2172L12.3735 15.4527V10.5994L8.72595 12.2172Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

const LandingPage = () => {
  const { t } = useTranslation();
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [showSellPrice, setShowSellPrice] = useState(false);
  const [showBuyPrice, setShowBuyPrice] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [widgetWidth, setWidgetWidth] = useState(440);
  
  // Refs for measuring the elements
  const containerRef = useRef<HTMLDivElement>(null);
  const swapWidgetRef = useRef<HTMLDivElement>(null);
  
  // Calculate equal spacing and center position
  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        // Get available height (minus the header height of 72px)
        const availableHeight = window.innerHeight - 72;
        setContentHeight(availableHeight);
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, []);
  
  // Define exact widget width and share it globally for alignment
  useEffect(() => {
    // Set exact width for the swap widget that will be shared with header
    const swapWidgetWidth = 480; // Fixed width for consistency
    document.documentElement.style.setProperty('--widget-width', `${swapWidgetWidth}px`);
    setWidgetWidth(swapWidgetWidth);
    
    // Handle responsive changes by listening to CSS variable changes
    const handleResize = () => {
      const cssWidgetWidth = getComputedStyle(document.documentElement).getPropertyValue('--widget-width').trim();
      if (cssWidgetWidth) {
        const newWidth = parseInt(cssWidgetWidth) || swapWidgetWidth;
        setWidgetWidth(newWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initial call to ensure correct values
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Dummy tokens for display
  const sellToken = {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '/token-logos/eth.png'
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section - clean like Uniswap */}
      <div 
        ref={containerRef}
        className="flex items-center justify-center relative"
        style={{ height: `${contentHeight}px` }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient blobs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#FF007A] rounded-full opacity-5 md:blur-[100px] blur-[60px]"></div>
          <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-5 md:blur-[100px] blur-[60px]"></div>
          
          {/* Floating tokens - similar to Uniswap */}
          <div className="absolute top-1/4 left-1/5 w-12 h-12 rounded-full bg-blue-500/20 blur-sm animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-sm animate-float-slower"></div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full bg-green-500/20 blur-sm animate-float"></div>
          <div className="absolute bottom-1/4 right-1/5 w-14 h-14 rounded-full bg-purple-500/20 blur-sm animate-float-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-yellow-500/20 blur-sm animate-float-slower"></div>
          <div className="absolute top-2/3 right-1/3 w-10 h-10 rounded-full bg-orange-500/20 blur-sm animate-float"></div>
        </div>
        
        {/* Center content with even spacing */}
        <div className="flex flex-col items-center justify-center absolute inset-0">
          {/* Title - with proper spacing from search bar */}
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-12"
              style={{ marginTop: 'var(--title-top-spacing)' }}
          >
            Swap anytime,<br />anywhere.
          </h1>
          
          {/* Swap Widget - centered below title with exact positioning */}
          <div 
            ref={swapWidgetRef}
            className="relative z-10"
            style={{ 
              width: `${widgetWidth}px`,
              margin: '0 auto', 
              marginTop: 'var(--title-bottom-spacing)',
              marginBottom: '3rem'
            }}
          >
            <div className="bg-card border border-stroke rounded-2xl shadow-xl p-4 backdrop-blur-sm">
              {/* Sell/From section */}
              <div className="mb-2">
                <div 
                  className="flex w-full bg-[#131A2A] rounded-[20px] p-4 shadow-inner"
                  onMouseEnter={() => setShowSellPrice(true)}
                  onMouseLeave={() => setShowSellPrice(false)}
                >
                  <div className="flex flex-col w-full">
                    <div className="text-gray-400 text-sm mb-1.5 text-left">Sell</div>
                    <input
                      type="text"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full bg-transparent text-3xl text-white font-medium focus:outline-none text-left"
                    />
                    <div className="text-sm text-gray-500 text-left">$0.00</div>
                  </div>
                  <div className="flex items-center">
                    <button className="flex items-center px-3 py-2 rounded-2xl bg-[#222429] hover:bg-[#2C2F36]">
                      <div className="w-6 h-6 rounded-full bg-[#222429] flex items-center justify-center flex-shrink-0 z-10 overflow-hidden">
                        <EthLogo />
                      </div>
                      <span className="text-white mx-2">{sellToken.symbol}</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Divider with swap button */}
              <div className="relative my-2 py-2">
                <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-1/2 transform -translate-y-1/2"></div>
                <div className="flex justify-center relative z-10">
                  <button 
                    className="flex items-center justify-center p-2.5 bg-[#191B1F] hover:bg-[#2C2F36] rounded-full shadow-sm transition-all"
                    aria-label="Switch direction"
                  >
                    <ArrowDownIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            
              {/* Buy/To section */}
              <div className="mt-2">
                <div 
                  className="flex w-full bg-[#131A2A] rounded-[20px] p-4 shadow-inner"
                  onMouseEnter={() => setShowBuyPrice(true)}
                  onMouseLeave={() => setShowBuyPrice(false)}
                >
                  <div className="flex flex-col w-full">
                    <div className="text-gray-400 text-sm mb-1.5 text-left">Buy</div>
                    <input
                      type="text"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full bg-transparent text-3xl text-white font-medium focus:outline-none text-left"
                    />
                    <div className="text-sm text-gray-500 text-left">$0.00</div>
                  </div>
                  <div className="flex items-center">
                    <button className="flex items-center px-4 py-2.5 rounded-2xl bg-[#FF0080] hover:brightness-95 transition-all">
                      <span className="text-white">Select token</span>
                      <ChevronDownIcon className="w-4 h-4 text-white ml-2" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Get Started button */}
              <Link 
                to="/swap" 
                className="block w-full py-4 px-10 mt-6 bg-gradient-to-r from-[#FF0080] to-[#7928CA] hover:brightness-105 capitalize font-semibold rounded-2xl text-white text-center transition-all"
              >
                Get started
              </Link>
            </div>
          </div>
          
          {/* Marketplace text */}
          <div className="mt-8">
            <p className="text-gray-400 text-base max-w-[500px] mx-auto text-center">
              The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.
            </p>
            
            {/* Scroll indicator */}
            <div className="mt-16 flex flex-col items-center">
              <span className="text-gray-300 text-sm mb-2">Scroll to learn more</span>
              <div className="w-6 h-6 mx-auto rounded-full bg-black/20 flex items-center justify-center shadow-md transition backdrop-blur-sm">
                <svg className="w-4 h-4 text-white/75 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 