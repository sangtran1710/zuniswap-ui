import React, { useEffect, useRef, useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Wallet {
  id: string;
  name: string;
  description?: string;
  status?: string;
  icon: string;
  primary?: boolean;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle clicking outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const wallets: Wallet[] = [
    {
      id: "metamask",
      name: "MetaMask",
      status: "Popular",
      icon: "https://app.uniswap.org/static/media/metamask.02e3ec27.svg",
      primary: true
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      description: "Connect to multiple wallets",
      icon: "https://app.uniswap.org/static/media/walletconnect.74e7a3ca.svg"
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "https://app.uniswap.org/static/media/coinbaseWalletIcon.a3a7d7fd.svg"
    },
    {
      id: "brave",
      name: "Brave Wallet",
      icon: "https://app.uniswap.org/static/media/brave.e87a3964.svg"
    },
    {
      id: "ledger",
      name: "Ledger",
      description: "Connect to your Ledger hardware wallet",
      icon: "https://app.uniswap.org/static/media/ledger.ea529286.svg"
    }
  ];

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        ref={modalRef}
        className={`w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} m-4`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Connect a wallet</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Close wallet connection"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-4">
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors ${
                  wallet.primary 
                    ? 'bg-pink-900/20 hover:bg-pink-900/30 border border-pink-900/50' 
                    : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                }`}
                aria-label={`Connect with ${wallet.name}`}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={wallet.icon} 
                    alt={`${wallet.name} icon`} 
                    className="w-8 h-8"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEzLjVDMTQuNDg1MyAxMy41IDE2LjUgMTEuNDg1MyAxNi41IDlDMTYuNSA2LjUxNDcyIDE0LjQ4NTMgNC41IDEyIDQuNUMxMC4xMjcgNC41IDguNDYzNTggNS40ODkzMyA3LjYyOTYzIDEuMTI2NThDNy4xNDYxIDEuNjgzMjMgNi43NSAyLjMxNjg3IDYuNzUgM0M2Ljc1IDMgNy41IDQuNSA2Ljc1IDYuNzVDNiA5IDcuNSAxMy41IDEyIDEzLjVaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0xOC43NSAxMy41QzE5LjE2NDIgMTMuNSAxOS41IDE5LjUgMTkuNSAyMC41QzE5LjUgMjEuMTA1IDE5LjU2MTUgMjEuMzEzNyAxOS43MDUzIDIxLjU0NzRDMTkuODY5MiAyMS44MTMgMjAuMDUgMjEuNzYyOSAyMC4yNSAyMS41QzIwLjc1IDIwLjc1IDIxLjc1IDE5LjUgMjIuNSAxOUMyMy4yNSAxOC41IDI0IDE3LjUgMjQgMTYuNUMyNCAxNS41IDIzLjI1IDE0LjUgMjIuMjUgMTRDMjEuMzYwMSAxMy41NDY1IDIwLjI1IDEzLjUgMTguNzUgMTMuNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTUuMjUgMTAuNUM0LjgzNTc5IDEwLjUgNC41IDE2LjUgNC41IDE3LjVDNC41IDE4LjEwNSA0LjQzODQ5IDE4LjMxMzcgNC4yOTQ3NSAxOC41NDc0QzQuMTMwNzYgMTguODEzIDMuOTUgMTguNzYyOSAzLjc1IDE4LjVDMy4yNSAxNy43NSAyLjI1IDE2LjUgMS41IDE2QzAuNzUgMTUuNSAwIDE0LjUgMCAxMy41QzAgMTIuNSAwLjc1IDExLjUgMS43NSAxMUMyLjYzOTkyIDEwLjU0NjUgMy43NSAxMC41IDUuMjUgMTAuNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTEyIDEzLjVDMTEuMTcxNiAxMy41IDEwLjUgMTQuMTcxNiAxMC41IDE1QzEwLjUgMTUuODI4NCAxMS4xNzE2IDE2LjUgMTIgMTYuNUMxMi44Mjg0IDE2LjUgMTMuNSAxNS44Mjg0IDEzLjUgMTVDMTMuNSAxNC4xNzE2IDEyLjgyODQgMTMuNSAxMiAxMy41WiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTggMTVDMTcuMTcxNiAxNSAxNi41IDE1LjY3MTYgMTYuNSAxNi41QzE2LjUgMTcuMzI4NCAxNy4xNzE2IDE4IDE4IDE4QzE4LjgyODQgMTggMTkuNSAxNy4zMjg0IDE5LjUgMTYuNUMxOS41IDE1LjY3MTYgMTguODI4NCAxNSAxOCAxNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTYgMTguMDAwMUM1LjE3MTU3IDE4LjAwMDEgNC41IDE4LjY3MTcgNC41IDE5LjUwMDFDNC41IDIwLjMyODUgNS4xNzE1NyAyMS4wMDAxIDYgMjEuMDAwMUM2LjgyODQzIDIxLjAwMDEgNy41IDIwLjMyODUgNy41IDE5LjUwMDFDNy41IDE4LjY3MTcgNi44Mjg0MyAxOC4wMDAxIDYgMTguMDAwMVoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTExLjk5OTkgMTkuNUMxMS4xNzE1IDE5LjUgMTAuNSAyMC4xNzE2IDEwLjUgMjFDMTAuNSAyMS44Mjg0IDExLjE3MTUgMjIuNSAxMS45OTk5IDIyLjVDMTIuODI4MyAyMi41IDEzLjUgMjEuODI4NCAxMy41IDIxQzEzLjUgMjAuMTcxNiAxMi44MjgzIDE5LjUgMTEuOTk5OSAxOS41WiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K";
                    }}
                  />
                  <div className="text-left">
                    <div className="text-white font-medium">{wallet.name}</div>
                    {wallet.description && (
                      <div className="text-sm text-gray-400">{wallet.description}</div>
                    )}
                  </div>
                </div>
                {wallet.status && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    wallet.primary ? 'bg-pink-900/50 text-pink-400' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {wallet.status}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            By connecting a wallet, you agree to Zuniswap&apos;s Terms of Service and acknowledge that you have read and understand the protocol disclaimer.
          </div>
        </div>
        
        {/* New to Ethereum */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-white font-medium">New to Ethereum?</div>
            <a
              href="https://ethereum.org/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-500 flex items-center hover:text-pink-400"
            >
              Learn more <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default WalletModal; 