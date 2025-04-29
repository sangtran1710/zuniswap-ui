import { motion } from 'framer-motion';
import { useState } from 'react';
import './ZuniLogo.css';

const ZuniLogo = () => {
  const [isLogoClicked, setIsLogoClicked] = useState(false);

  // Hàm xử lý khi click vào logo
  const handleLogoClick = () => {
    if (isLogoClicked) return; // Tránh click nhiều lần
    
    setIsLogoClicked(true);
    
    // Xóa sessionStorage để animation chạy lại
    sessionStorage.removeItem('introAnimationPlayed');

    // Thêm class để fade out toàn bộ trang
    document.body.classList.add('page-fade-out');
    
    // Đợi animation hoàn tất rồi reload
    setTimeout(() => {
      window.location.reload();
    }, 1200); // Tăng thời gian fade out để animation mượt mà hơn
  };

  return (
    <motion.div 
      className={`logo-container ${isLogoClicked ? 'logo-clicked' : ''}`}
      onClick={handleLogoClick}
      title="Click to reload animation"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="logo-text bg-gradient-to-r from-[#4338CA] to-[#3B82F6]">
        ZuniSwap
      </span>
      
      {/* Nhỏ biểu tượng reload */}
      <span className="logo-reload-hint">↻</span>
    </motion.div>
  );
};

export default ZuniLogo; 