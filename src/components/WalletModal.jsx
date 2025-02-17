import React from "react";

// (Optional) You can import the X icon for the close button:
// import { X } from "lucide-react";

const WalletModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const wallets = [
    {
      name: "Uniswap Extension",
      status: "Detected",
      icon: "🦄",
    },
    {
      name: "Uniswap Mobile",
      description: "Scan QR code to connect",
      icon: "📱",
    },
    {
      name: "MetaMask",
      status: "Detected",
      icon: "🦊",
    },
    {
      name: "WalletConnect",
      icon: "🔗",
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
    },
  ];

  // Prevent clicks inside the modal from closing it
  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Full-screen overlay, clicking outside closes the modal
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 dark:bg-opacity-60"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        onClick={handleInnerClick}
        className="relative bg-white dark:bg-gray-800 dark:text-gray-100 rounded-3xl p-6 w-[320px] my-20 mr-4 shadow-lg animate-modal"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Connect a wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>

        {/* Wallet list */}
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="w-full flex items-center justify-between p-3 rounded-2xl
                         bg-white dark:bg-gray-800
                         hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {wallet.name}
                  </div>
                  {wallet.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {wallet.description}
                    </div>
                  )}
                </div>
              </div>
              {wallet.status && (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {wallet.status}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Note */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center px-3">
          By connecting a wallet, you agree to Uniswap Labs' Terms of Service
          and consent to its Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
