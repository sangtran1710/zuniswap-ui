import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SwapCard from '../components/SwapCard';

// Define the tab types that match the SwapCard component
type TabType = 'swap' | 'limit' | 'send' | 'buy';

interface SwapPageProps {
  initialTab?: TabType;
}

const SwapPage: React.FC<SwapPageProps> = ({ initialTab = 'swap' }) => {
  const navigate = useNavigate();

  // Create a custom event handler to communicate with the SwapCard
  useEffect(() => {
    // Function to synchronize URL with active tab
    const handleTabChange = (event: CustomEvent<TabType>) => {
      const tab = event.detail;
      if (tab === 'swap') {
        navigate('/swap', { replace: true });
      } else {
        navigate(`/swap/${tab}`, { replace: true });
      }
    };

    // Add event listener for tab changes
    window.addEventListener('tab-change' as any, handleTabChange as EventListener);

    return () => {
      window.removeEventListener('tab-change' as any, handleTabChange as EventListener);
    };
  }, [navigate]);

  return (
    <div className="w-full">
      {/* Pass the initialTab to the SwapCard component */}
      <SwapCard initialActiveTab={initialTab} />
    </div>
  );
};

export default SwapPage; 