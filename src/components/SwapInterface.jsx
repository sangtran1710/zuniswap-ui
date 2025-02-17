import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader,
  ArrowDownUp,
  Fuel,
  ChevronDown,
  Settings
} from "lucide-react";
import TokenSelector from "./TokenSelector";
import PriceInfo from "./PriceInfo";
import TokenSelectModal from "./TokenSelectModal";
import WalletModal from "./WalletModal";

// ---------------------------------
// Simple i18n data for English/Vietnamese
// ---------------------------------
const i18n = {
  english: {
    swap: "Swap",
    limit: "Limit",
    send: "Send",
    buy: "Buy",
    from: "From",
    toEstimated: "To (estimated)",
    connect: "Connect",
    connectWallet: "Connect Wallet",
    searchTokens: "Search tokens",
    finalizingQuote: "Finalizing quote...",
    failFetch: "Failed to fetch price data. Please try again.",
    globalPreferences: "Global preferences",
    theme: "Theme",
    language: "Language",
    currency: "Currency",
    auto: "Auto",
    light: "Light",
    dark: "Dark",
    english: "English",
    vietnamese: "Vietnamese",
    usd: "USD",
    vnd: "VND",
    trade: "Trade",
    explore: "Explore",
    pool: "Pool",
    fee: "Fee (0.25%)",
    networkCost: "Network cost",
    orderRouting: "Order routing",
    priceImpact: "Price impact",
    maxSlippage: "Max slippage",
    autoSlippage: "Auto",
    gasFee: "0.91",
    // For the Limit UI:
    when: "When",
    isWorth: "is worth",
    market: "Market",
    plus1: "+1%",
    plus5: "+5%",
    plus10: "+10%",
    sell: "Sell",
    buyWord: "Buy",
    expiry: "Expiry",
    day1: "1 day",
    week1: "1 week",
    month1: "1 month",
    year1: "1 year",
    limitDisclaimer: "Limits may not execute exactly when tokens reach the specified price."
  },
  vietnamese: {
    swap: "Hoán đổi",
    limit: "Lệnh",
    send: "Gửi",
    buy: "Mua",
    from: "Từ",
    toEstimated: "Tới (ước tính)",
    connect: "Kết nối",
    connectWallet: "Kết nối ví",
    searchTokens: "Tìm kiếm token",
    finalizingQuote: "Đang hoàn tất báo giá...",
    failFetch: "Không thể lấy dữ liệu giá. Vui lòng thử lại.",
    globalPreferences: "Tùy chỉnh chung",
    theme: "Chủ đề",
    language: "Ngôn ngữ",
    currency: "Tiền tệ",
    auto: "Tự động",
    light: "Sáng",
    dark: "Tối",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    usd: "USD",
    vnd: "VND",
    trade: "Giao dịch",
    explore: "Khám phá",
    pool: "Bể",
    fee: "Phí (0.25%)",
    networkCost: "Phí mạng",
    orderRouting: "Định tuyến",
    priceImpact: "Tác động giá",
    maxSlippage: "Độ trượt tối đa",
    autoSlippage: "Tự động",
    gasFee: "0.91",
    // For the Limit UI:
    when: "Khi",
    isWorth: "có giá",
    market: "Thị trường",
    plus1: "+1%",
    plus5: "+5%",
    plus10: "+10%",
    sell: "Bán",
    buyWord: "Mua",
    expiry: "Thời hạn",
    day1: "1 ngày",
    week1: "1 tuần",
    month1: "1 tháng",
    year1: "1 năm",
    limitDisclaimer: "Lệnh Limit có thể không khớp đúng khi giá chạm mức chỉ định."
  }
};

const SwapInterface = () => {
  // ---------------------- State for Swap Logic ----------------------
  const [selectedFromToken, setSelectedFromToken] = useState({ symbol: "ETH", id: "ethereum" });
  const [selectedToToken, setSelectedToToken] = useState({ symbol: "USDT", id: "tether" });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("from");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Swap");
  const [isQuoting, setIsQuoting] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [priceImpact, setPriceImpact] = useState(null);
  const [error, setError] = useState(null);

  // ---------------------- State for Preferences ----------------------
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [theme, setTheme] = useState("auto");       // 'auto' | 'light' | 'dark'
  const [language, setLanguage] = useState("english"); // 'english' | 'vietnamese'
  const [currency, setCurrency] = useState("usd");     // 'usd' | 'vnd'

  // Toggle fee details
  const [showFees, setShowFees] = useState(false);

  // ---------------------- State for Limit Logic (Minimal) ----------------------
  const [limitPrice, setLimitPrice] = useState("");
  const [limitSell, setLimitSell] = useState("");
  const [limitBuy, setLimitBuy] = useState("");
  const [limitExpiry, setLimitExpiry] = useState("1 day");

  // ---------------------- NEW: State for Send & Buy ----------------------
  const [sendAmount, setSendAmount] = useState("");
  const [sendToken, setSendToken] = useState({ symbol: "ETH", id: "ethereum" });
  const [sendRecipient, setSendRecipient] = useState("");

  const [buyToken, setBuyToken] = useState(null);
  const [buyAmount, setBuyAmount] = useState("");

  // i18n
  const t = i18n[language];

  // Theme toggling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value || isNaN(Number(value))) return value;
    const num = parseFloat(value).toFixed(2);
    return currency === "usd" ? `$${num}` : `₫${num}`;
  };

  // Token config
  const tokens = [
    { symbol: "ETH", id: "ethereum" },
    { symbol: "USDC", id: "usd-coin" },
    { symbol: "USDT", id: "tether" },
    { symbol: "BTC", id: "bitcoin" },
    { symbol: "BNB", id: "binancecoin" },
    { symbol: "LINK", id: "chainlink" },
    { symbol: "XRP", id: "ripple" },
    { symbol: "SOL", id: "solana" }
  ];

  const tabs = [t.swap, t.limit, t.send, t.buy];

  const getTokenImage = (symbol) => {
    const logos = {
      ETH: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
      BTC: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
      USDT: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
      USDC: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
      BNB: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png",
      LINK: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png",
      XRP: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png",
      SOL: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png"
    };
    return logos[symbol] || "/api/placeholder/32/32";
  };

  const formatNumber = (num) => parseFloat(num).toFixed(2);

  // Reset
  const handleReset = () => {
    setSelectedFromToken({ symbol: "ETH", id: "ethereum" });
    setSelectedToToken({ symbol: "USDT", id: "tether" });
    setFromAmount("");
    setToAmount("");
    setActiveTab(t.swap);
    setError(null);
    setExchangeRate(null);
    setPriceImpact(null);

    // Reset limit
    setLimitPrice("");
    setLimitSell("");
    setLimitBuy("");
    setLimitExpiry("1 day");

    // Reset send
    setSendAmount("");
    setSendToken({ symbol: "ETH", id: "ethereum" });
    setSendRecipient("");

    // Reset buy
    setBuyToken(null);
    setBuyAmount("");
  };

  // Fetch price
  const fetchPrice = async () => {
    setLoading(true);
    setIsQuoting(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedFromToken.id},${selectedToToken.id}&vs_currencies=usd`
      );
      if (res.data[selectedFromToken.id] && res.data[selectedToToken.id]) {
        const fromPrice = res.data[selectedFromToken.id].usd;
        const toPrice = res.data[selectedToToken.id].usd;
        if (fromPrice && toPrice) {
          const rate = fromPrice / toPrice;
          setExchangeRate(rate);
          const impact = Math.abs((1 - rate) * 100);
          setPriceImpact(impact < 0.01 ? "<0.01" : formatNumber(impact));
        } else {
          throw new Error("Invalid price data received");
        }
      }
    } catch (error) {
      setError(t.failFetch);
      setExchangeRate(null);
      setPriceImpact(null);
    } finally {
      setLoading(false);
      setTimeout(() => setIsQuoting(false), 1000);
    }
  };

  useEffect(() => {
    if (fromAmount && !isNaN(fromAmount)) {
      const debounceTimer = setTimeout(() => {
        fetchPrice();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [selectedFromToken.id, selectedToToken.id, fromAmount]);

  useEffect(() => {
    if (fromAmount && exchangeRate && !isNaN(fromAmount)) {
      const calculatedAmount = parseFloat(fromAmount) * exchangeRate;
      setToAmount(formatNumber(calculatedAmount));
    }
  }, [exchangeRate, fromAmount]);

  const handleFromAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
      if (!val) setToAmount("");
    }
  };

  const handleTokenSelect = (symbol) => {
    const token = tokens.find((t) => t.symbol === symbol);
    if (!token) return;
    if (modalType === "from") {
      if (token.symbol === selectedToToken.symbol) {
        setSelectedToToken(selectedFromToken);
      }
      setSelectedFromToken(token);
    } else {
      if (token.symbol === selectedFromToken.symbol) {
        setSelectedFromToken(selectedToToken);
      }
      setSelectedToToken(token);
    }
    setIsModalOpen(false);
    setFromAmount("");
    setToAmount("");
  };

  const handleSwapDirection = () => {
    // swap from/to tokens
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(selectedFromToken);
    // also swap the amounts
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // ---------------------- SWAP Tab UI ----------------------
  const renderSwapTab = () => {
    return (
      <>
        {/* Existing Swap UI (unchanged) */}
        {/* From Token */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-300">{t.from}</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-gray-900 dark:text-gray-100"
            />
            <TokenSelector
              token={selectedFromToken.symbol}
              onTokenSelect={() => {
                setModalType("from");
                setIsModalOpen(true);
              }}
              logo={getTokenImage(selectedFromToken.symbol)}
            />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwapDirection}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-pink-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-300">{t.toEstimated}</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-gray-900 dark:text-gray-100"
            />
            <TokenSelector
              token={selectedToToken.symbol}
              onTokenSelect={() => {
                setModalType("to");
                setIsModalOpen(true);
              }}
              logo={getTokenImage(selectedToToken.symbol)}
            />
          </div>
        </div>

        {/* Price/Fee Info */}
        {fromAmount && !error && (
          <div className="mt-4">
            {/* Price ratio row with gas icon & arrow toggle */}
            <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-between">
              <span>
                1 {selectedFromToken.symbol} ={" "}
                {exchangeRate ? formatNumber(exchangeRate) : "..."}{" "}
                {selectedToToken.symbol}
              </span>
              <div className="flex items-center">
                <div
                  className="flex items-center cursor-pointer ml-2"
                  onClick={() => setShowFees(!showFees)}
                >
                  <Fuel />
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(t.gasFee)}
                  </span>
                  <ChevronDown
                    className={`ml-1 transition-transform ${showFees ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Expandable fees */}
            <div
              className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                showFees ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-300">{t.fee}</span>
                    <div className="relative inline-block group">
                      <span className="cursor-help text-gray-400">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 w-48 z-10">
                        The fee charged by the protocol and liquidity providers for each trade.
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-100">
                    {formatCurrency(
                      (parseFloat(fromAmount || 0) * 0.0025 * exchangeRate).toFixed(2)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-300">{t.networkCost}</span>
                    <div className="relative inline-block group">
                      <span className="cursor-help text-gray-400">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 w-48 z-10">
                        The estimated cost of the transaction on the network.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src={getTokenImage("ETH")} alt="ETH" className="w-4 h-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-100">
                      {formatCurrency(t.gasFee)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {t.orderRouting}
                    </span>
                    <div className="relative inline-block group">
                      <span className="cursor-help text-gray-400">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 w-48 z-10">
                        The protocol used to execute this trade.
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-100">Zuniswap API</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {t.priceImpact}
                    </span>
                    <div className="relative inline-block group">
                      <span className="cursor-help text-gray-400">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 w-48 z-10">
                        The difference between the market price and your trade price due to trade size.
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-100">
                    +{priceImpact}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-300">
                  <span>
                    1 {selectedToToken.symbol} ={" "}
                    {exchangeRate ? (1 / exchangeRate).toFixed(8) : "..."}{" "}
                    {selectedFromToken.symbol} (
                    {formatCurrency(exchangeRate ? exchangeRate.toFixed(2) : "0")})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-800 text-red-600 dark:text-red-100 rounded-xl text-sm">
            {error}
          </div>
        )}

        {isQuoting && (
          <div className="w-full bg-pink-50 dark:bg-pink-900 text-pink-600 dark:text-pink-100 rounded-xl py-4 px-4 mt-4 flex items-center justify-center">
            <Loader className="animate-spin h-4 w-4 mr-2" />
            <span>{t.finalizingQuote}</span>
          </div>
        )}

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="w-full bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-100 rounded-xl py-4 font-medium mt-4 hover:bg-pink-200 dark:hover:bg-pink-700 transition-all"
        >
          {t.connectWallet}
        </button>
      </>
    );
  };

  // ---------------------- LIMIT Tab UI (Simplified) ----------------------
  const renderLimitTab = () => {
    return (
      <div className="flex flex-col space-y-4">
        {/* ... existing Limit UI code remains unchanged ... */}
        {/* Price row, quick price buttons, sell/buy fields, expiry, connect button, etc. */}
        {/* (All from your code above) */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {t.when} 1 {selectedFromToken.symbol}
          </span>
          <input
            type="text"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={exchangeRate ? formatNumber(exchangeRate) : "0.00"}
            className="w-20 text-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 text-sm"
          />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {t.isWorth} {selectedToToken.symbol}
          </span>
        </div>

        {/* Quick Price Buttons */}
        <div className="flex justify-center space-x-2 text-xs">
          <button
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
            onClick={() => setLimitPrice(exchangeRate ? formatNumber(exchangeRate) : "0")}
          >
            {t.market}
          </button>
          <button
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(exchangeRate) * 1.01;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
          >
            {t.plus1}
          </button>
          <button
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(exchangeRate) * 1.05;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
          >
            {t.plus5}
          </button>
          <button
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(exchangeRate) * 1.1;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
          >
            {t.plus10}
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Sell */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{t.sell}</label>
            <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
              <input
                type="text"
                value={limitSell}
                onChange={(e) => setLimitSell(e.target.value)}
                placeholder="0"
                className="bg-transparent text-lg outline-none w-12 text-gray-900 dark:text-gray-100 text-center"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-300">{selectedFromToken.symbol}</span>
            </div>
          </div>

          <ArrowDownUp className="text-gray-400 dark:text-gray-500 mx-4" size={20} />

          {/* Buy */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{t.buyWord}</label>
            <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
              <input
                type="text"
                value={limitBuy}
                onChange={(e) => setLimitBuy(e.target.value)}
                placeholder="0"
                className="bg-transparent text-lg outline-none w-12 text-gray-900 dark:text-gray-100 text-center"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-300">{selectedToToken.symbol}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs">
          <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">{t.expiry}:</span>
          {["1 day", "1 week", "1 month", "1 year"].map((item) => (
            <button
              key={item}
              onClick={() => setLimitExpiry(item)}
              className={`px-3 py-1 rounded-full transition-colors ${
                limitExpiry === item
                  ? "bg-pink-100 dark:bg-pink-700 text-pink-600 dark:text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {item === "1 day" ? t.day1
               : item === "1 week" ? t.week1
               : item === "1 month" ? t.month1
               : t.year1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="w-full bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-100 rounded-xl py-3 font-medium hover:bg-pink-200 dark:hover:bg-pink-700 transition-all"
        >
          {t.connectWallet}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {t.limitDisclaimer}
        </p>
      </div>
    );
  };

  // ---------------------- NEW: SEND Tab UI ----------------------
  const renderSendTab = () => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          You're sending
        </span>

        {/* Big amount display */}
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {sendAmount || "$0"}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {sendAmount
            ? `${sendAmount} ${sendToken.symbol}`
            : `0 ${sendToken.symbol}`}
        </div>

        {/* For a real app, you'd have a token selector here. We'll keep it simple. */}
        <div className="flex items-center space-x-2">
          <img
            src={getTokenImage(sendToken.symbol)}
            alt={sendToken.symbol}
            className="w-5 h-5"
          />
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            {sendToken.symbol}
          </span>
        </div>

        {/* Input for sendAmount */}
        <input
          type="text"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          placeholder="0"
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-center text-gray-800 dark:text-gray-100 w-24"
        />

        {/* Recipient address */}
        <div className="w-full">
          <label className="block text-sm text-gray-500 dark:text-gray-300 mb-1">
            To
          </label>
          <input
            type="text"
            value={sendRecipient}
            onChange={(e) => setSendRecipient(e.target.value)}
            placeholder="Wallet address or ENS name"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="w-full bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-100 rounded-xl py-3 font-medium hover:bg-pink-200 dark:hover:bg-pink-700 transition-all"
        >
          Connect Wallet
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Be sure to confirm the address carefully. Transactions cannot be reversed.
        </p>
      </div>
    );
  };

  // ---------------------- NEW: BUY Tab UI ----------------------
  const renderBuyTab = () => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          You're buying
        </span>

        {/* Big numeric display */}
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {buyAmount || "$0"}
        </div>

        {buyToken ? (
          <div className="flex items-center space-x-2">
            <img
              src={getTokenImage(buyToken.symbol)}
              alt={buyToken.symbol}
              className="w-5 h-5"
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {buyToken.symbol}
            </span>
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-pink-100 dark:bg-pink-700 text-pink-600 dark:text-white rounded-full font-medium hover:bg-pink-200 dark:hover:bg-pink-600"
          >
            Select a token
          </button>
        )}

        {/* Quick amounts row */}
        <div className="flex space-x-2">
          {["$100", "$300", "$1000"].map((amount) => (
            <button
              key={amount}
              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={() => setBuyAmount(amount)}
            >
              {amount}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="w-full bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-100 rounded-xl py-3 font-medium hover:bg-pink-200 dark:hover:bg-pink-700 transition-all"
        >
          Connect Wallet
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          This feature may require a third-party provider to purchase tokens.
        </p>
      </div>
    );
  };

  // ---------------------- Render ----------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Navbar */}
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-8">
          <span
            onClick={handleReset}
            className="text-pink-600 font-bold text-xl cursor-pointer hover:opacity-80"
          >
            Zuniswap
          </span>
          <div className="flex items-center space-x-6">
            <button className="text-gray-900 dark:text-gray-200 font-medium">{t.trade}</button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium">
              {t.explore}
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium">
              {t.pool}
            </button>
          </div>
        </div>

        {/* Right: Settings + Connect */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Settings size={16} />
            </button>
            {isPreferencesOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 text-sm z-10">
                <div className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  {t.globalPreferences}
                </div>
                <div className="space-y-4">
                  {/* Theme */}
                  <div>
                    <div className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1">
                      {t.theme}
                    </div>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100"
                      onChange={(e) => setTheme(e.target.value)}
                      value={theme}
                    >
                      <option value="auto">{t.auto}</option>
                      <option value="light">{t.light}</option>
                      <option value="dark">{t.dark}</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <div className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1">
                      {t.language}
                    </div>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100"
                      onChange={(e) => setLanguage(e.target.value)}
                      value={language}
                    >
                      <option value="english">{t.english}</option>
                      <option value="vietnamese">{t.vietnamese}</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <div className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1">
                      {t.currency}
                    </div>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100"
                      onChange={(e) => setCurrency(e.target.value)}
                      value={currency}
                    >
                      <option value="usd">{t.usd}</option>
                      <option value="vnd">{t.vnd}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="text-pink-600 font-medium hover:opacity-80"
          >
            {t.connect}
          </button>
        </div>
      </div>

      {/* Main Content: Search bar above the card, centered. */}
      <div className="container mx-auto px-4 mt-8 flex flex-col items-center">
        {/* Search tokens */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={t.searchTokens}
              className="pl-10 pr-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none w-64 text-gray-800 dark:text-gray-100"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
              🔍
            </span>
          </div>
        </div>

        {/* Swap/Limit Card */}
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 text-gray-900 dark:text-gray-100 transition-colors">
          {/* Tab Switcher */}
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tabLabel) => (
              <button
                key={tabLabel}
                onClick={() => setActiveTab(tabLabel)}
                className={`px-4 py-2 relative transition-colors duration-200 ${
                  activeTab === tabLabel
                    ? "text-pink-600"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {tabLabel}
                {activeTab === tabLabel && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-pink-600" />
                )}
              </button>
            ))}
          </div>

          {/* Conditional Rendering: Swap vs Limit vs others */}
          {activeTab === t.swap && renderSwapTab()}

          {activeTab === t.limit && (
            <div className="space-y-4">
              {renderLimitTab()}
            </div>
          )}

          {/* NEW: Send tab UI */}
          {activeTab === t.send && (
            <div className="space-y-4">
              {renderSendTab()}
            </div>
          )}

          {/* NEW: Buy tab UI */}
          {activeTab === t.buy && (
            <div className="space-y-4">
              {renderBuyTab()}
            </div>
          )}
        </div>
      </div>

      {/* TokenSelectModal */}
      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleTokenSelect}
        tokens={tokens}
        getTokenImage={getTokenImage}
      />

      {/* WalletModal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};

export default SwapInterface;
