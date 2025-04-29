import React, { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import { walletConnect } from 'wagmi/connectors';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WalletConnectQRProps {
  onClose: () => void;
}

// Hàm tạo chuỗi ngẫu nhiên 32 byte cho symKey
const generateRandomBytes32 = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const WalletConnectQR: React.FC<WalletConnectQRProps> = ({ onClose }) => {
  const { connectors } = useConnect();
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();

  useEffect(() => {
    const getWalletConnectUri = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Tạo WalletConnect connector mới để lấy URI
        const projectId = '3a8170812b534d0ff9d794f19a901d64';
        const wcConnector = walletConnect({
          projectId,
          showQrModal: false,
          metadata: {
            name: 'ZuniSwap',
            description: 'Swap crypto across Ethereum and multiple chains',
            url: window.location.origin,
            icons: [`${window.location.origin}/zuniswap-logo.png`]
          }
        });
        
        try {
          // Phương pháp 1: Sử dụng connect để lấy URI
          // @ts-ignore - Bỏ qua lỗi TypeScript vì cấu trúc có thể khác nhau giữa các phiên bản
          const result = await wcConnector.connect?.();
          
          // Kiểm tra xem kết quả có chứa URI không
          if (result && typeof result === 'object' && 'uri' in result) {
            setUri(result.uri);
            return;
          }
        } catch (connectErr) {
          console.log('Không thể lấy URI từ connect method:', connectErr);
          // Tiếp tục thử phương pháp khác
        }

        try {
          // Phương pháp 2: Truy cập trực tiếp vào thuộc tính getUri
          // @ts-ignore
          if (typeof wcConnector.getUri === 'function') {
            // @ts-ignore
            const uri = await wcConnector.getUri();
            if (uri) {
              setUri(uri);
              return;
            }
          }
        } catch (getUriErr) {
          console.log('Không thể lấy URI từ getUri method:', getUriErr);
          // Tiếp tục thử phương pháp khác
        }

        try {
          // Phương pháp 3: Lấy provider và truy cập URI từ đó
          // @ts-ignore
          const provider = await wcConnector.getProvider();
          
          if (provider) {
            // Kiểm tra các vị trí có thể chứa URI
            if (provider.signer?.uri) {
              setUri(provider.signer.uri);
              return;
            } else if (provider.uri) {
              setUri(provider.uri);
              return;
            } else if (provider.connector?.uri) {
              setUri(provider.connector.uri);
              return;
            } else if (provider.walletConnectProvider?.signer?.uri) {
              setUri(provider.walletConnectProvider.signer.uri);
              return;
            } else if (provider.walletConnectProvider?.uri) {
              setUri(provider.walletConnectProvider.uri);
              return;
            }
            
            // Kiểm tra các thuộc tính khác có thể chứa URI
            const providerKeys = Object.keys(provider);
            for (const key of providerKeys) {
              const value = provider[key];
              if (typeof value === 'string' && value.startsWith('wc:')) {
                setUri(value);
                return;
              }
            }
            
            console.error('Không tìm thấy URI trong provider:', provider);
          }
        } catch (providerErr) {
          console.error('Lỗi khi lấy WalletConnect provider:', providerErr);
        }
        
        // Phương pháp 4: Sử dụng WalletConnect v2 với cấu hình chính xác
        try {
          // Tạo WalletConnect connector mới với cấu hình tương tự Uniswap
          const wcConnector = walletConnect({
            projectId: '3a8170812b534d0ff9d794f19a901d64',
            showQrModal: false,
            metadata: {
              name: 'ZuniSwap',
              description: 'Swap tokens on ZuniSwap',
              url: 'https://app.zuniswap.org',
              icons: ['https://app.zuniswap.org/logo.png']
            },
            // Thêm các tùy chọn khác để tương thích với Uniswap
            qrModalOptions: {
              themeMode: 'dark',
              themeVariables: {
                '--wcm-z-index': '9999'
              }
            }
          });

          // Thử kết nối và lấy URI
          // @ts-ignore
          const { uri } = await wcConnector.connect();
          if (uri) {
            setUri(uri);
            return;
          }
        } catch (wcErr) {
          console.error('Lỗi khi tạo WalletConnect v2:', wcErr);
          
          // Nếu thất bại, thử tạo URI thủ công
          try {
            // Tạo URI thủ công dựa trên projectId
            const wcUri = `wc:3a8170812b534d0ff9d794f19a901d64@2?relay-protocol=irn&symKey=${generateRandomBytes32()}`;
            setUri(wcUri);
            return;
          } catch (manualErr) {
            console.error('Lỗi khi tạo URI thủ công:', manualErr);
          }
        }

        // Nếu tất cả các phương pháp đều thất bại
        setError('Không thể tạo QR code cho WalletConnect');
      } catch (err) {
        console.error('Lỗi khi lấy WalletConnect URI:', err);
        setError('Đã xảy ra lỗi khi tạo QR code');
      } finally {
        setLoading(false);
      }
    };

    if (!isConnected) {
      getWalletConnectUri();
    }
    
    // Cleanup khi component unmount
    return () => {
      // Không cần cleanup gì đặc biệt
    };
  }, [connectors, isConnected]);

  // Nếu đã kết nối, đóng modal
  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected, onClose]);

  // Copy URI to clipboard
  const copyToClipboard = () => {
    if (uri) {
      navigator.clipboard.writeText(uri)
        .then(() => {
          alert('Đã sao chép liên kết');
        })
        .catch((err) => {
          console.error('Không thể sao chép:', err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center py-6 px-8 bg-black/80 backdrop-blur-md rounded-2xl max-w-md w-full">
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-lg font-semibold text-white">WalletConnect</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-white/60">Đang tạo QR code...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <div className="mb-4 text-red-400">
            <p>{error}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => {
                setLoading(true);
                setError(null);
                // Thử lại việc lấy URI
                setTimeout(() => {
                  const getWalletConnectUri = async () => {
                    try {
                      // Tạo WalletConnect connector mới với projectId khác
                      const projectId = '3a8170812b534d0ff9d794f19a901d64';
                      const wcConnector = walletConnect({
                        projectId,
                        showQrModal: false,
                        metadata: {
                          name: 'ZuniSwap',
                          description: 'Swap crypto across Ethereum and multiple chains',
                          url: window.location.origin,
                          icons: [`${window.location.origin}/zuniswap-logo.png`]
                        }
                      });
                      
                      // @ts-ignore
                      const result = await wcConnector.connect?.();
                      if (result && typeof result === 'object' && 'uri' in result) {
                        setUri(result.uri);
                        setError(null);
                      } else {
                        setError('Không thể tạo QR code cho WalletConnect');
                      }
                    } catch (err) {
                      console.error('Lỗi khi thử lại:', err);
                      setError('Không thể kết nối với WalletConnect');
                    } finally {
                      setLoading(false);
                    }
                  };
                  getWalletConnectUri();
                }, 500);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors"
            >
              Thử lại
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      ) : uri ? (
        <>
          <div className="bg-white p-6 rounded-xl mb-4">
            <QRCodeSVG 
              value={uri} 
              size={240}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin={false}
              imageSettings={{
                src: "/images/tokens/walletconnect-logo.svg",
                height: 45,
                width: 45,
                excavate: true,
              }}
            />
          </div>
          <p className="text-sm text-center text-white/60 mb-4">
            Scan the QR Code with your phone
          </p>
          <div className="flex items-center space-x-2 mb-2 w-full justify-center">
            <button 
              onClick={copyToClipboard}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors flex items-center"
            >
              <span>Copy link</span>
            </button>
            <a 
              href="https://walletconnect.com/explorer?type=wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors flex items-center"
            >
              <span>Learn more</span>
            </a>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-red-400">
          <p>Không thể tạo QR code</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectQR;
