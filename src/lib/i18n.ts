import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    connectWallet: 'Connect Wallet',
    connecting: 'Connecting...',
    instalMetamask: 'Install MetaMask',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    currency: 'Currency',
  },
  navigation: {
    trade: 'Trade',
    pool: 'Pool',
    explore: 'Explore',
    charts: 'Charts',
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
  },
  tokens: {
    searchPlaceholder: 'Search tokens',
    noResults: 'No tokens found',
    balance: 'Balance',
  },
  footer: {
    copyright: '© 2023 ZuniSwap • Inspired by Uniswap',
  },
};

// Vietnamese translations
const viTranslations = {
  common: {
    connectWallet: 'Kết nối ví',
    connecting: 'Đang kết nối...',
    instalMetamask: 'Cài đặt MetaMask',
    settings: 'Cài đặt',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    language: 'Ngôn ngữ',
    currency: 'Tiền tệ',
  },
  navigation: {
    trade: 'Giao dịch',
    pool: 'Thanh khoản',
    explore: 'Khám phá',
    charts: 'Biểu đồ',
  },
  swap: {
    title: 'Đổi',
    from: 'Từ',
    to: 'Đến',
    switchDirection: 'Đổi hướng',
    switchTokens: 'Đổi token',
    rate: 'Tỷ giá',
    fee: 'Phí',
    swapButton: 'Đổi ngay',
    insufficientBalance: 'Số dư không đủ',
    enterAmount: 'Nhập số lượng',
  },
  tokens: {
    searchPlaceholder: 'Tìm token',
    noResults: 'Không tìm thấy token',
    balance: 'Số dư',
  },
  footer: {
    copyright: '© 2023 ZuniSwap • Lấy cảm hứng từ Uniswap',
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      vi: { translation: viTranslations },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n; 