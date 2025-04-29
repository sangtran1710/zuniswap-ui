import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    connectWallet: 'Connect Wallet',
    connecting: 'Connecting...',
    instalMetamask: 'Connect',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    currency: 'Currency',
    globalPreferences: 'Global preferences',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    english: 'English',
    vietnamese: 'Vietnamese',
    toggleMenu: 'Toggle menu',
    searchTokens: 'Search tokens...',
  },
  navigation: {
    trade: 'Trade',
    pool: 'Pool',
    explore: 'Explore',
    charts: 'Charts',
  },
  tabs: {
    swap: 'Swap',
    limit: 'Limit',
    send: 'Send',
    buy: 'Buy'
  },
  landing: {
    getStarted: 'Get Started'
  },
  swap: {
    title: 'Swap',
    from: 'From',
    to: 'To',
    switchDirection: 'Switch direction',
    switchTokens: 'Switch tokens',
    rate: 'Rate',
    fee: 'Fee',
    swapButton: 'Swap',
    insufficientBalance: 'Insufficient balance',
    enterAmount: 'Enter amount',
    swapAnytime: 'Swap anytime,',
    anywhere: 'anywhere.',
    inspiredBy: 'Inspired by Uniswap. Swap crypto across Ethereum and 11+ chains.',
    youPay: 'You pay',
    trade: 'Trade crypto across Ethereum and 11+ chains'
  },
  tokens: {
    searchPlaceholder: 'Search tokens',
    noResults: 'No tokens found',
    balance: 'Balance',
    selectToken: 'Select a token',
    popularTokens: 'Popular tokens',
    tokenList: 'Token list',
    max: 'MAX',
  },
  footer: {
    copyright: '© 2023 ZuniSwap • Inspired by Uniswap',
  },
  debug: {
    debugControls: 'Debug Controls',
    resetAnimation: 'Reset Animation',
    pressToHide: 'Press Ctrl+Shift+D to hide',
  },
  wallet: {
    connectWallet: 'Connect a wallet',
    termsAgreement: 'By connecting your wallet, you agree to our Terms of Service and Privacy Policy.',
    termsNotice: 'By connecting a wallet, you agree to Zuniswap\'s Terms of Service and consent to its Privacy Policy',
    detected: 'Detected',
    notDetected: 'Not detected',
    notAvailable: 'Not available',
    connectionError: 'Unknown connection error',
    connectorNotFound: 'Connector {{name}} not found',
    popular: 'Popular',
    userRejected: 'Connection rejected. Please try again.'
  },
};

// Vietnamese translations
const viTranslations = {
  common: {
    connectWallet: 'Kết nối ví',
    connecting: 'Đang kết nối...',
    instalMetamask: 'Kết nối',
    settings: 'Cài đặt',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    language: 'Ngôn ngữ',
    currency: 'Tiền tệ',
    globalPreferences: 'Cài đặt chung',
    theme: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    auto: 'Tự động',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    toggleMenu: 'Mở menu',
    searchTokens: 'Tìm kiếm token...',
  },
  navigation: {
    trade: 'Giao dịch',
    pool: 'Thanh khoản',
    explore: 'Khám phá',
    charts: 'Biểu đồ',
  },
  tabs: {
    swap: 'Hoán đổi',
    limit: 'Giới hạn',
    send: 'Gửi',
    buy: 'Mua'
  },
  landing: {
    getStarted: 'Bắt đầu'
  },
  swap: {
    title: 'Hoán đổi',
    from: 'Từ',
    to: 'Đến',
    switchDirection: 'Đổi hướng',
    switchTokens: 'Đổi token',
    rate: 'Tỷ giá',
    fee: 'Phí',
    swapButton: 'Hoán đổi',
    insufficientBalance: 'Số dư không đủ',
    enterAmount: 'Nhập số lượng',
    swapAnytime: 'Hoán đổi mọi lúc,',
    anywhere: 'mọi nơi.',
    inspiredBy: 'Lấy cảm hứng từ Uniswap. Hoán đổi tiền mã hóa trên Ethereum và hơn 11 chuỗi khác.',
    youPay: 'Bạn trả',
    trade: 'Hoán đổi tiền mã hóa trên Ethereum và hơn 11 chuỗi khác'
  },
  tokens: {
    searchPlaceholder: 'Tìm kiếm token',
    noResults: 'Không tìm thấy token',
    balance: 'Số dư',
    selectToken: 'Chọn một token',
    popularTokens: 'Token phổ biến',
    tokenList: 'Danh sách token',
    max: 'TỐI ĐA',
  },
  footer: {
    copyright: ' 2023 ZuniSwap • Lấy cảm hứng từ Uniswap',
  },
  debug: {
    debugControls: 'Bảng điều khiển gỡ lỗi',
    resetAnimation: 'Đặt lại hoạt ảnh',
    pressToHide: 'Nhấn Ctrl+Shift+D để ẩn',
  },
  wallet: {
    connectWallet: 'Kết nối ví',
    termsAgreement: 'Bằng việc kết nối ví, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.',
    termsNotice: 'Bằng cách kết nối ví, bạn đồng ý với Điều khoản Dịch vụ của Zuniswap và đồng ý với Chính sách Bảo mật của nó',
    detected: 'Đã phát hiện',
    notDetected: 'Không tìm thấy',
    notAvailable: 'Không khả dụng',
    connectionError: 'Lỗi kết nối không xác định',
    connectorNotFound: 'Không tìm thấy connector {{name}}',
    popular: 'Phổ biến',
    userRejected: 'Kết nối bị từ chối. Vui lòng thử lại.'
  },
};

// Get the saved language from localStorage or default to browser language
const getSavedLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem('zuniswap-language');
    return savedLanguage || navigator.language.split('-')[0] || 'en';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'en';
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      vi: { translation: viTranslations },
    },
    lng: getSavedLanguage(), // Use saved language or detect from browser
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'], // First check localStorage, then browser
      lookupLocalStorage: 'zuniswap-language', // Key to use in localStorage
      caches: ['localStorage'], // Cache the language in localStorage
    },
  });

// Function to change language and save to localStorage
export const changeLanguage = (lng: string) => {
  try {
    localStorage.setItem('zuniswap-language', lng);
  } catch (error) {
    console.error('Error setting language in localStorage:', error);
  }
  return i18n.changeLanguage(lng);
};

export default i18n; 