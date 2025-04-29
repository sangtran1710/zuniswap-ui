import React from 'react';
import { useWagmi } from '../hooks/useWagmi';
import { requestAccountSelection, triggerWalletPopup, openMetaMaskExtension } from '../utils/walletUtils';
import { useTranslation } from 'react-i18next';

const WalletManager: React.FC = () => {
  const { t } = useTranslation();
  const { address, isConnected } = useWagmi();

  // Kích hoạt popup chọn tài khoản
  const handleSelectAccount = async () => {
    try {
      await requestAccountSelection();
    } catch (error) {
      console.error('Lỗi khi yêu cầu chọn tài khoản:', error);
    }
  };

  // Kích hoạt popup giao dịch (sẽ hiển thị MetaMask)
  const handleTriggerPopup = async () => {
    if (!address) return;
    await triggerWalletPopup(address);
  };

  // Mở tiện ích MetaMask
  const handleOpenMetaMask = () => {
    openMetaMaskExtension();
  };

  // Nếu không kết nối, hiển thị thông báo
  if (!isConnected) {
    return (
      <div className="p-4 bg-[#212427] rounded-xl text-white">
        <p className="text-center mb-3">{t('wallet.notConnected', 'Chưa kết nối ví')}</p>
        <button 
          className="w-full p-2 bg-gradient-to-r from-[#4338CA] to-[#60A5FA] rounded-lg text-white"
          onClick={handleSelectAccount}
        >
          {t('common.connect', 'Kết nối ví')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#212427] rounded-xl">
      <h3 className="text-lg font-medium text-white mb-3">
        {t('wallet.management', 'Quản lý ví')}
      </h3>
      
      <div className="space-y-2">
        <button 
          className="w-full p-2 bg-[#2C2F36] hover:bg-[#3C3F46] rounded-lg text-white transition-colors"
          onClick={handleSelectAccount}
        >
          {t('wallet.switchAccount', 'Chuyển đổi tài khoản')}
        </button>
        
        <button 
          className="w-full p-2 bg-[#2C2F36] hover:bg-[#3C3F46] rounded-lg text-white transition-colors"
          onClick={handleTriggerPopup}
        >
          {t('wallet.openMetaMask', 'Mở MetaMask')}
        </button>
        
        <button 
          className="w-full p-2 bg-[#2C2F36] hover:bg-[#3C3F46] rounded-lg text-white transition-colors"
          onClick={handleOpenMetaMask}
        >
          {t('wallet.openExtension', 'Mở tiện ích MetaMask')}
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          {t('wallet.currentAddress', 'Địa chỉ hiện tại')}: <span className="text-white break-all">{address}</span>
        </p>
      </div>
    </div>
  );
};

export default WalletManager; 