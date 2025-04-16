/// <reference types="react" />
import React, { useState, useEffect, useRef } from "react";
import {
  Loader,
  ArrowDownUp,
  Settings,
  Info,
  ChevronDown,
  X,
  AlertCircle
} from "lucide-react";
import TokenSelectModal from "./TokenSelectModal";
import PriceInfo from "./PriceInfo";
import WalletModal from "./WalletModal";
import i18n from "../i18n";
import { LanguageOption, ThemeOption, CurrencyOption, Token, TabOption } from "../types";
import { getTokenImage } from "../utils/tokenUtils";
import { 
  calculatePrice, 
  calculateOutputAmount, 
  calculatePriceImpact, 
  calculateFee 
} from "../utils/swapUtils";
import { formatCurrencyUtil } from "../utils/formatUtils";

type ModalType = 'from' | 'to';

interface SwapInterfaceProps {
  language: LanguageOption;
  theme: ThemeOption;
  currency: CurrencyOption;
  availableTokens: Token[];
  onSwap: (fromToken: Token, toToken: Token, amount: number) => void;
  isConnected: boolean;
  onConnectWallet: () => void;
  activeTab: TabOption;
}

const SwapInterface: React.FC<SwapInterfaceProps> = ({
  language,
  theme,
  currency,
  availableTokens = [],
  onSwap,
  isConnected,
  onConnectWallet,
  activeTab
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
  const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Thay đổi formatCurrency thành local function sử dụng formatCurrencyUtil
  const formatCurrency = (amount: number): string => {
    return formatCurrencyUtil(amount, currency);
  };

  useEffect(() => {
    // Đặt token mặc định khi danh sách token khả dụng thay đổi
    if (availableTokens?.length > 0 && !fromToken) {
      setFromToken(availableTokens[0]);
    }
    if (availableTokens?.length > 1 && !toToken) {
      setToToken(availableTokens[1]);
    }
    setIsLoading(false);
  }, [availableTokens, fromToken, toToken]);

  useEffect(() => {
    // Đóng settings menu khi click bên ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Thay thế gọi API bằng các hàm giả lập
  useEffect(() => {
    const updateSwapDetails = async () => {
      if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
        try {
          setIsProcessing(true);
          setError(null);
          
          // Sử dụng hàm calculateOutputAmount thay vì gọi API
          const outputAmount = calculateOutputAmount(
            fromAmount,
            fromToken,
            toToken
          );
          
          setToAmount(outputAmount.toString());
          
          // Lấy tỷ giá bằng hàm calculatePrice
          const price = calculatePrice(fromToken, toToken);
          setRate(price);
          
          // Tính toán price impact và phí
          const impact = calculatePriceImpact(
            fromAmount,
            fromToken,
            toToken
          );
          setPriceImpact(impact);
          
          const swapFee = calculateFee(fromAmount, fromToken);
          setFee(swapFee);
          
          setIsProcessing(false);
        } catch (error) {
          setIsProcessing(false);
          setError("Error calculating swap details. Please try again.");
          console.error("Swap calculation error:", error);
        }
      } else {
        setToAmount("");
        setRate(null);
        setPriceImpact(null);
        setFee(null);
      }
    };

    updateSwapDetails();
  }, [fromToken, toToken, fromAmount]);

  // ---------------------- State for UI enhancements ----------------------
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // i18n
  const defaultTranslations = {
    swap: 'Swap',
    limit: 'Limit',
    send: 'Send',
    buy: 'Buy',
    from: 'From',
    to: 'To',
    toEstimated: 'To (estimated)',
    connect: 'Connect',
    connectWallet: 'Connect Wallet'
  };

  const t = i18n?.[language] || defaultTranslations;

  // Theme toggling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Token config
  const tokens: Token[] = [
    { symbol: "ETH", id: "ethereum" },
    { symbol: "USDC", id: "usd-coin" },
    { symbol: "USDT", id: "tether" },
    { symbol: "BTC", id: "bitcoin" },
    { symbol: "BNB", id: "binancecoin" },
    { symbol: "LINK", id: "chainlink" },
    { symbol: "XRP", id: "ripple" },
    { symbol: "SOL", id: "solana" }
  ];

  const tabs: TabOption[] = [
    (t.swap || 'Swap') as TabOption,
    (t.limit || 'Limit') as TabOption,
    (t.send || 'Send') as TabOption,
    (t.buy || 'Buy') as TabOption
  ];

  const formatNumber = (num: number, decimals = 6): string => {
    if (isNaN(num)) return "0";
    
    // For very small numbers, show more decimals
    if (Math.abs(num) < 0.01) {
      return parseFloat(String(num)).toFixed(6);
    }
    
    // For regular numbers, use standard decimals
    return parseFloat(String(num)).toFixed(decimals);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
      if (!val) setToAmount("");
    }
  };

  const handleTokenSelect = (token: Token): void => {
    if (modalType === "from") {
      // If selecting the same token as "to", swap them
      if (toToken && token.symbol === toToken.symbol) {
        setToToken(fromToken);
      }
      setFromToken(token);
    } else {
      // If selecting the same token as "from", swap them
      if (fromToken && token.symbol === fromToken.symbol) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
    
    // Always close the modal after selecting
    setIsFromModalOpen(false);
    setIsToModalOpen(false);
    
    // Reset amounts to trigger a new quote
    setFromAmount("");
    setToAmount("");
    
    // Show success message
    setSuccessMessage(`Selected ${token.symbol}`);
    setShowSuccessNotification(true);
    
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  // Enhanced handleSwapDirection with success notification
  const handleSwapDirection = (): void => {
    // swap from/to tokens
    const tempFrom = fromToken;
    const tempTo = toToken;
    setFromToken(tempTo);
    setToToken(tempFrom);

    // also swap the amounts and recalculate if needed
    if (fromAmount && rate) {
      // If we have a valid rate, we preserve the calculated amount
      const newFromAmount = toAmount;
      setFromAmount(newFromAmount);
      // Reset toAmount temporarily to avoid stale display
      setToAmount("");
      // Let useEffect handle the recalculation
    } else {
      // Simple swap if we don't have exchange rate
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };

  // Notification component
  const SuccessNotification: React.FC<{
    message: string;
    isVisible: boolean;
  }> = ({ message, isVisible }) => {
    if (!isVisible) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 transition-opacity duration-300">
        <div className="w-2 h-2 rounded-full bg-white" />
        <span>{message}</span>
      </div>
    );
  };

  // Settings component
  const SettingsPanel: React.FC<{
    isOpen: boolean;
    onClose: () => void;
  }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return (
      <div className="absolute top-0 right-0 mt-12 mr-2 bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-4 w-80 z-40">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Slippage tolerance</span>
              <div className="text-gray-400 text-sm flex items-center">
                <Info size={14} className="mr-1" />
                <span>Your transaction will revert if the price changes by more than this percentage.</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSlippage(0.1)}
                className={`px-3 py-1 rounded-lg text-sm ${slippage === 0.1 ? "bg-pink-500/30 text-pink-500" : "bg-gray-800 text-gray-400"}`}
                aria-label="Set slippage tolerance to 0.1%"
              >
                0.1%
              </button>
              <button 
                onClick={() => setSlippage(0.5)}
                className={`px-3 py-1 rounded-lg text-sm ${slippage === 0.5 ? "bg-pink-500/30 text-pink-500" : "bg-gray-800 text-gray-400"}`}
                aria-label="Set slippage tolerance to 0.5%"
              >
                0.5%
              </button>
              <button 
                onClick={() => setSlippage(1.0)}
                className={`px-3 py-1 rounded-lg text-sm ${slippage === 1.0 ? "bg-pink-500/30 text-pink-500" : "bg-gray-800 text-gray-400"}`}
                aria-label="Set slippage tolerance to 1.0%"
              >
                1.0%
              </button>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={slippage.toString()}
                  onChange={(e) => setSlippage(parseFloat(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-1 w-16 text-sm"
                  aria-label="Custom slippage tolerance percentage"
                  placeholder="0.5"
                />
                <span className="absolute right-2 text-gray-400">%</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Transaction deadline</span>
              <div className="text-gray-400 text-sm flex items-center">
                <Info size={14} className="mr-1" />
                <span>Your transaction will revert if it is pending for more than this period of time.</span>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value="30"
                className="bg-gray-800 text-white rounded-lg px-3 py-1 w-16 text-sm"
                aria-label="Transaction deadline in minutes"
                placeholder="30"
              />
              <span className="ml-2 text-gray-400">minutes</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Interface Settings</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">Dark Mode</span>
                <button 
                  onClick={() => {}}
                  className={`w-10 h-5 rounded-full ${theme === "dark" ? "bg-pink-500" : "bg-gray-700"} relative`}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  <div 
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${theme === "dark" ? "right-0.5" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------- SWAP Tab UI ----------------------
  const renderSwapTab = (): React.ReactElement => {
    return (
      <div className="mt-4 flex flex-col space-y-1">
        {/* From Token */}
        <div className="relative bg-gray-800 rounded-2xl p-4">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-400 mb-2">{t.from}</div>
            <div className="text-sm text-gray-400">
              Balance: <span className="text-white">-</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-white"
              aria-label="From amount"
            />
            <button
              onClick={() => {
                setModalType("from");
                setIsFromModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-2xl py-2 px-3 transition-colors"
              aria-label={`Select token to swap from, currently ${fromToken?.symbol}`}
            >
              <img
                src={getTokenImage(fromToken?.symbol || "")}
                alt={fromToken?.symbol || "Token"}
                className="w-6 h-6 rounded-full"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "/images/placeholder-token.png";
                }}
              />
              <span className="font-medium text-white">{fromToken?.symbol}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-3 z-10 relative">
          <button
            onClick={handleSwapDirection}
            className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center text-pink-500 hover:text-pink-400 transition-colors"
            aria-label="Swap token direction"
          >
            <ArrowDownUp size={18} />
          </button>
        </div>

        {/* To Token */}
        <div className="relative bg-gray-800 rounded-2xl p-4">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-gray-400 mb-2">{t.toEstimated}</div>
            <div className="text-sm text-gray-400">
              Balance: <span className="text-white">-</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-white"
              aria-label="To amount"
            />
            <button
              onClick={() => {
                setModalType("to");
                setIsToModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-2xl py-2 px-3 transition-colors"
              aria-label={`Select token to swap to, currently ${toToken?.symbol}`}
            >
              <img
                src={getTokenImage(toToken?.symbol || "")}
                alt={toToken?.symbol || "Token"}
                className="w-6 h-6 rounded-full"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "/images/placeholder-token.png";
                }}
              />
              <span className="font-medium text-white">{toToken?.symbol}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Price Info */}
        {fromAmount && rate && !isProcessing && !error && (
          <div 
            className="px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-xl cursor-pointer mt-1"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                1 {fromToken?.symbol} = {formatNumber(rate)} {toToken?.symbol}
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-400 mr-1">
                  {isSettingsOpen ? "Hide" : "Show"} details
                </div>
                <ChevronDown 
                  className={`text-gray-400 transition-transform ${isSettingsOpen ? "transform rotate-180" : ""}`} 
                  size={16} 
                />
              </div>
            </div>
            
            {isSettingsOpen && (
              <div className="mt-3 space-y-2 pt-3 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expected Output</span>
                  <span className="text-white">
                    {toAmount} {toToken?.symbol}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price Impact</span>
                  <span className={`${priceImpact && priceImpact > 5 ? "text-red-500" : priceImpact && priceImpact > 3 ? "text-yellow-500" : "text-green-500"}`}>
                    {priceImpact ? priceImpact.toFixed(2) : "0.00"}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Liquidity Provider Fee</span>
                  <span className="text-white">
                    {fee ? formatCurrency(fee) : "0.00"} {fromToken?.symbol}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Route</span>
                  <span className="text-white">
                    {fromToken?.symbol} → {toToken?.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="px-4 py-3 bg-gray-800 rounded-xl mt-1">
            <div className="flex items-center justify-center text-gray-400">
              <Loader className="animate-spin mr-2" size={16} />
              <span>Calculating...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-xl mt-1 text-red-500 flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Connect Wallet Button */}
        <button
          onClick={onConnectWallet || (() => setIsWalletModalOpen(true))}
          className="mt-3 w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl transition-colors"
        >
          {isConnected ? "Swap" : t.connectWallet}
        </button>
      </div>
    );
  };

  // ---------------------- LIMIT Tab UI ----------------------
  const renderLimitTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span>Limit orders coming soon</span>
      </div>
    );
  };

  // ---------------------- SEND Tab UI ----------------------
  const renderSendTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span>Send feature coming soon</span>
      </div>
    );
  };

  // ---------------------- BUY Tab UI ----------------------
  const renderBuyTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span>Buy crypto feature coming soon</span>
      </div>
    );
  };

  // ---------------------- Render ----------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      {/* Success notification */}
      <SuccessNotification 
        message={successMessage}
        isVisible={showSuccessNotification}
      />
      
      {/* Main Content */}
      <main className="w-full max-w-lg px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Swap</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors relative"
              aria-label="Settings"
            >
              <Settings size={20} />
              <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </button>
          </div>
        </div>
        
        {/* Main Card */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
          {/* Tab Menu */}
          <div className="border-b border-gray-800">
            <div className="flex">
              {tabs.map((tabLabel) => (
                <button
                  key={tabLabel}
                  onClick={() => {}}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tabLabel
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tabLabel}
                  {activeTab === tabLabel && (
                    <div className="mt-2 h-0.5 bg-pink-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === t.swap && renderSwapTab()}
            {activeTab === t.limit && renderLimitTab()}
            {activeTab === t.send && renderSendTab()}
            {activeTab === t.buy && renderBuyTab()}
          </div>
        </div>
        
        {/* Auto Router Info */}
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <span>Zuniswap Auto Router</span>
        </div>
      </main>

      {/* Modals */}
      <TokenSelectModal
        isOpen={isFromModalOpen || isToModalOpen}
        onClose={() => {
          setIsFromModalOpen(false);
          setIsToModalOpen(false);
        }}
        onSelect={handleTokenSelect}
        tokens={tokens}
        modalType={modalType}
      />

      {!onConnectWallet && (
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SwapInterface;
