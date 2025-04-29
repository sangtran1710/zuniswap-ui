import { ethers } from 'ethers';

/**
 * Các hàm tiện ích để tương tác với MetaMask và các ví Ethereum
 */

/**
 * Kích hoạt popup yêu cầu kết nối ví MetaMask
 * @returns Promise với array địa chỉ tài khoản, hoặc lỗi nếu người dùng từ chối
 */
export const requestAccounts = async (): Promise<string[]> => {
  try {
    // Kiểm tra nếu MetaMask được cài đặt
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask không được cài đặt');
    }

    // Yêu cầu quyền truy cập tài khoản, kích hoạt popup
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    console.error('Lỗi khi yêu cầu tài khoản:', error);
    throw error;
  }
};

/**
 * Kích hoạt popup để chuyển đổi tài khoản MetaMask
 * Lưu ý: Cách này không làm mở trực tiếp giao diện quản lý tài khoản,
 * nhưng sẽ yêu cầu người dùng chọn lại tài khoản, điều này có thể 
 * khiến họ mở MetaMask để quản lý tài khoản
 */
export const requestAccountSelection = async (): Promise<string[]> => {
  return await requestAccounts();
};

/**
 * Kích hoạt popup để gửi giao dịch rỗng (0 ETH) đến chính địa chỉ người dùng
 * Đây là một cách để kích hoạt MetaMask mở ra, người dùng có thể hủy giao dịch
 * @param address Địa chỉ ví người dùng hiện tại
 */
export const triggerWalletPopup = async (address: string): Promise<void> => {
  try {
    if (!address || typeof window.ethereum === 'undefined') return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Tạo một giao dịch với giá trị 0 đến chính địa chỉ của người dùng
    // Người dùng có thể hủy giao dịch, nhưng điều này sẽ làm MetaMask hiện lên
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('0'),
      gasLimit: 21000
    });
  } catch (error) {
    // Người dùng có thể hủy giao dịch, đây là hành vi bình thường
    console.log('Giao dịch bị hủy hoặc có lỗi:', error);
  }
};

/**
 * Chuyển đến trang MetaMask trên trình duyệt
 * Không phải popup trong trang web, mà là trang chủ hoặc trang tiện ích MetaMask
 */
export const openMetaMaskExtension = () => {
  // Chrome
  if (navigator.userAgent.includes('Chrome')) {
    window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html');
  } 
  // Firefox
  else if (navigator.userAgent.includes('Firefox')) {
    window.open('moz-extension://[id]/home.html'); // Cần ID tiện ích chính xác
  }
  // Hoặc chỉ đơn giản mở trang web MetaMask
  else {
    window.open('https://metamask.io/', '_blank');
  }
}; 