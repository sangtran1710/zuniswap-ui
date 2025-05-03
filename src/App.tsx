import { useEffect } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import { ToastProvider } from './contexts/ToastContext';
import './components/IntroAnimation.css';
import AppRoutes from './routes/AppRoutes';
import TokenBackground from './components/TokenBackground';
import ConnectWalletModal from './components/ConnectWalletModal';
import WalletSidebar from './components/WalletSidebar';
import { useGlobalStore } from './store/useGlobalStore';

// Create a global object to store shared alignment values across components
declare global {
  interface Window {
    ZuniswapUI: {
      widgetWidth: number;
      reloadWithAnimation: () => void;
    };
  }
}

// Initialize global state
window.ZuniswapUI = {
  widgetWidth: 480, // Fixed width for both search and swap widget
  reloadWithAnimation: () => {
    // Đơn giản hóa hệ thống animation khi reload
    try {
      // Thêm class để ngăn thanh cuộn xuất hiện và gây flicker
      document.documentElement.classList.add('animating');
      document.body.classList.add('animating');
      
      // Lưu trạng thái animation vào localStorage để biết đây là reload
      localStorage.setItem('zuniswap_reload_animation', 'true');
      
      // Đợi một chút để đảm bảo các class đã được áp dụng
      setTimeout(() => {
        // Reload trang
        window.location.reload();
      }, 50);
    } catch (error) {
      console.error('Error setting up animation:', error);
      // Fallback: reload trang bình thường nếu có lỗi
      window.location.reload();
    }
  }
};

// Add spacing variables for consistent layout
document.documentElement.style.setProperty('--header-height', '72px');
document.documentElement.style.setProperty('--title-top-spacing', '96px');
document.documentElement.style.setProperty('--title-bottom-spacing', '48px');

function App() {
  useTranslation(); // Giữ lại hook nhưng không sử dụng biến t
  const { isAccountSidebarOpen, closeAccountSidebar, isDarkMode } = useGlobalStore();

  // Xử lý theme và animation
  useEffect(() => {
    document.title = 'ZuniSwap'; // Set the document title

    // Force the body to have the correct background color
    document.body.style.backgroundColor = '#0D111C';
    document.body.style.color = '#FFFFFF';

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Xử lý animation khi reload
    const handleBeforeUnload = () => {
      localStorage.setItem('zuniswap_reload_animation', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Kiểm tra xem có phải reload với animation không
    const hasReloadAnimation = localStorage.getItem('zuniswap_reload_animation') === 'true';
    
    // Đảm bảo luôn xóa flag trong localStorage để tránh lỗi khi refresh lại
    localStorage.removeItem('zuniswap_reload_animation');
    
    // Thêm cơ chế fallback để đảm bảo các class animation luôn được xóa
    const safetyTimeout = setTimeout(() => {
      document.documentElement.classList.remove('animating');
      document.body.classList.remove('animating');
      document.querySelectorAll('.swap-widget-animate, .header-animate, .background-animate').forEach(el => {
        el.classList.remove('swap-widget-animate', 'header-animate', 'background-animate');
      });
    }, 3000); // Fallback sau 3 giây
    
    if (hasReloadAnimation) {
      try {
        // Thêm class để ngăn thanh cuộn xuất hiện và gây flicker
        document.documentElement.classList.add('animating');
        document.body.classList.add('animating');
        
        // Áp dụng animation đơn giản cho các phần tử chính sử dụng ID cố định
        const swapWidget = document.getElementById('zuniswap-widget');
        const header = document.getElementById('zuniswap-header');
        const background = document.getElementById('zuniswap-background');
        
        // Fallback nếu không tìm thấy phần tử bằng ID
        const swapWidgetFallback = swapWidget || document.querySelector('.swap-widget-container');
        const headerFallback = header || document.querySelector('header');
        const backgroundFallback = background || document.querySelector('.token-background-container');
        
        // Áp dụng class animation cho các phần tử nếu tìm thấy
        if (swapWidgetFallback) swapWidgetFallback.classList.add('swap-widget-animate');
        if (headerFallback) headerFallback.classList.add('header-animate');
        if (backgroundFallback) backgroundFallback.classList.add('background-animate');
        
        // Xóa tất cả các class sau khi animation hoàn thành
        setTimeout(() => {
          clearTimeout(safetyTimeout); // Xóa timeout an toàn
          
          if (swapWidgetFallback) swapWidgetFallback.classList.remove('swap-widget-animate');
          if (headerFallback) headerFallback.classList.remove('header-animate');
          if (backgroundFallback) backgroundFallback.classList.remove('background-animate');
          document.documentElement.classList.remove('animating');
          document.body.classList.remove('animating');
        }, 1500); // Giảm thời gian xuống 1.5 giây
      } catch (error) {
        // Nếu có lỗi, đảm bảo xóa tất cả các class animation
        console.error('Animation error:', error);
        document.documentElement.classList.remove('animating');
        document.body.classList.remove('animating');
        clearTimeout(safetyTimeout);
      }
    }
    
    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDarkMode]);

  return (
    <ToastProvider>
      {/* Token Background */}
      <TokenBackground />
      
      <div className="app-container" style={{ backgroundColor: '#0D111C', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        {/* Routes */}
        <AppRoutes />
        
        {/* Global components */}
        <div id="modal-root"></div>
        
        {/* Wallet Modal */}
        <ConnectWalletModal />
        
        {/* Wallet Sidebar */}
        <WalletSidebar isOpen={isAccountSidebarOpen} onClose={closeAccountSidebar} />
      </div>
    </ToastProvider>
  );
}

export default App;
