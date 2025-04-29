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
  }
};

// Add spacing variables for consistent layout
document.documentElement.style.setProperty('--header-height', '72px');
document.documentElement.style.setProperty('--title-top-spacing', '96px');
document.documentElement.style.setProperty('--title-bottom-spacing', '48px');

function App() {
  useTranslation(); // Giữ lại hook nhưng không sử dụng biến t
  const { isAccountSidebarOpen, closeAccountSidebar, isDarkMode, themeMode } = useGlobalStore();

  // Theo dõi thay đổi của theme và cập nhật class cho body
  useEffect(() => {
    document.title = 'ZuniSwap'; // Set the document title
    
    // Thêm class cho theme (Restored original logic)
    if (isDarkMode) {
      document.body.classList.add('dark-theme'); 
      document.body.classList.remove('light-theme'); 
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light'); 
    } else {
      document.body.classList.add('light-theme'); 
      document.body.classList.remove('dark-theme'); 
      document.documentElement.classList.add('light'); 
      document.documentElement.classList.remove('dark');
    }
    
    // Thêm data-theme attribute cho việc styling (Restored)
    document.documentElement.setAttribute('data-theme', themeMode); 
    
    // Theo dõi thay đổi của theme hệ thống khi ở chế độ auto
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.body.classList.add('dark-theme'); // Restored
          document.body.classList.remove('light-theme'); // Restored
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light'); // Restored
        } else {
          document.body.classList.add('light-theme'); // Restored
          document.body.classList.remove('dark-theme'); // Restored
          document.documentElement.classList.add('light'); // Restored
          document.documentElement.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Thêm sự kiện beforeunload để bắt khi người dùng bấm nút reload của trình duyệt
    const handleBeforeUnload = () => {
      // Đặt flag để biết đây là reload bởi trình duyệt
      localStorage.setItem('zuniswap_reload_animation', 'true');
    };
    
    // Đăng ký sự kiện beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Kiểm tra xem có phải reload với animation không
    const hasReloadAnimation = localStorage.getItem('zuniswap_reload_animation') === 'true';
    
    if (hasReloadAnimation) {
      // Xóa flag trong localStorage
      localStorage.removeItem('zuniswap_reload_animation');
      
      // Thêm class để ngăn thanh cuộn xuất hiện và gây flicker
      document.documentElement.classList.add('animating');
      document.body.classList.add('animating');
      
      // Áp dụng animation cho từng phần tử theo thứ tự
      // 1. Swap Widget xuất hiện trước - sử dụng nhiều selector để tìm chính xác
      const swapWidgetSelectors = [
        '#swap-widget', // Selector mới dựa trên ID đã thêm
        '.swap-widget-container', // Selector dựa trên class đã thêm
        '.app-container > div > div', // Selector cũ
        '.w-[480px]', // Selector dựa trên class của SwapWidget
        '[style*="width: 480px"]', // Selector dựa trên style inline
        '.relative.z-10.mx-auto' // Selector dựa trên các class khác
      ];
      
      // Tìm Swap Widget bằng nhiều cách khác nhau
      let swapWidget = null;
      for (const selector of swapWidgetSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          swapWidget = element;
          console.log('Found Swap Widget with selector:', selector);
          break;
        }
      }
      
      // Nếu vẫn không tìm thấy, thử tìm tất cả các phần tử có style width: 480px
      if (!swapWidget) {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          if (el instanceof HTMLElement && el.style.width === '480px') {
            swapWidget = el;
            console.log('Found Swap Widget by inline style width');
            break;
          }
        }
      }
      
      if (swapWidget) {
        swapWidget.classList.add('swap-widget-animate');
        console.log('Applied animation to Swap Widget');
      } else {
        console.error('Could not find Swap Widget element');
      }
      
      // 2. Header xuất hiện sau
      const header = document.querySelector('header');
      if (header) {
        header.classList.add('header-animate');
      }
      
      // 3. Background xuất hiện cuối cùng
      const background = document.querySelector('.app-container');
      if (background) {
        background.classList.add('background-animate');
      }
      
      // Xóa tất cả các class sau khi animation hoàn thành
      setTimeout(() => {
        if (swapWidget) swapWidget.classList.remove('swap-widget-animate');
        if (header) header.classList.remove('header-animate');
        if (background) background.classList.remove('background-animate');
        document.documentElement.classList.remove('animating');
        document.body.classList.remove('animating');
      }, 2000); // Tăng thời gian để đảm bảo tất cả animation hoàn thành
    }
    
    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDarkMode, themeMode]);

  return (
    <ToastProvider>
      {/* Token Background */}
      <TokenBackground />
      
      <div className="app-container">
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
