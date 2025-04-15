/// <reference types="react" />
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
import TokenSelectModal from "./TokenSelectModal";
import WalletModal from "./WalletModal";
import i18n from "../i18n";
import { LanguageOption, ThemeOption, CurrencyOption, Token, TabOption } from "../types";
import IsometricBox from "./IsometricBox";
import IsometricButton from "./IsometricButton";

type ModalType = 'from' | 'to';
type LimitExpiryOption = '1 day' | '1 week' | '1 month' | '1 year';

const SwapInterface: React.FC = () => {
  // ---------------------- State for Swap Logic ----------------------
  const [selectedFromToken, setSelectedFromToken] = useState<Token>({ symbol: "ETH", id: "ethereum" });
  const [selectedToToken, setSelectedToToken] = useState<Token>({ symbol: "USDT", id: "tether" });
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("from");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabOption>("Swap");
  const [isQuoting, setIsQuoting] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------------------- State for Preferences ----------------------
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeOption>("auto");
  const [language, setLanguage] = useState<LanguageOption>("english");
  const [currency, setCurrency] = useState<CurrencyOption>("usd");

  // Toggle fee details
  const [showFees, setShowFees] = useState<boolean>(false);

  // ---------------------- State for Limit Logic (Minimal) ----------------------
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [limitSell, setLimitSell] = useState<string>("");
  const [limitBuy, setLimitBuy] = useState<string>("");
  const [limitExpiry, setLimitExpiry] = useState<LimitExpiryOption>("1 day");

  // ---------------------- NEW: State for Send & Buy ----------------------
  const [sendAmount, setSendAmount] = useState<string>("");
  const [sendToken, setSendToken] = useState<Token>({ symbol: "ETH", id: "ethereum" });
  const [sendRecipient, setSendRecipient] = useState<string>("");

  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [buyAmount, setBuyAmount] = useState<string>("");

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
  const formatCurrency = (value: string | number): string => {
    if (!value || isNaN(Number(value))) return String(value);
    const num = parseFloat(String(value)).toFixed(2);
    return currency === "usd" ? `$${num}` : `₫${num}`;
  };

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

  const tabs: TabOption[] = [t.swap as TabOption, t.limit as TabOption, t.send as TabOption, t.buy as TabOption];

  const getTokenImage = (symbol: string): string => {
    const logos: Record<string, string> = {
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

  const formatNumber = (num: number): string => parseFloat(String(num)).toFixed(2);

  // Reset
  const handleReset = (): void => {
    setSelectedFromToken({ symbol: "ETH", id: "ethereum" });
    setSelectedToToken({ symbol: "USDT", id: "tether" });
    setFromAmount("");
    setToAmount("");
    setActiveTab(t.swap as TabOption);
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
  const fetchPrice = async (): Promise<void> => {
    // setLoading(true); // Nếu không dùng, xoá luôn
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
      // setLoading(false);
      setTimeout(() => setIsQuoting(false), 1000);
    }
  };

  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const debounceTimer = setTimeout(() => {
        fetchPrice();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [selectedFromToken.id, selectedToToken.id, fromAmount]);

  useEffect(() => {
    if (fromAmount && exchangeRate && !isNaN(Number(fromAmount))) {
      const calculatedAmount = parseFloat(fromAmount) * exchangeRate;
      setToAmount(formatNumber(calculatedAmount));
    }
  }, [exchangeRate, fromAmount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
      if (!val) setToAmount("");
    }
  };

  const handleTokenSelect = (symbol: string): void => {
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

  const handleSwapDirection = (): void => {
    // swap from/to tokens
    const tempFrom = selectedFromToken;
    const tempTo = selectedToToken;
    setSelectedFromToken(tempTo);
    setSelectedToToken(tempFrom);

    // also swap the amounts
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // ---------------------- SWAP Tab UI ----------------------
  const renderSwapTab = (): React.ReactElement => {
    return (
      <>
        {/* From Token */}
        <IsometricBox
          className="rounded-xl p-4 hover:brightness-105 transition-all mb-4"
          depth={15}
          frontColor="var(--iso-primary)"
          rightColor="var(--iso-secondary)"
        >
          <label
            htmlFor="fromAmount"
            className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-300"
          >
            {t.from}
          </label>
          <div className="flex items-center justify-between">
            <input
              id="fromAmount"
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-gray-900 dark:text-gray-100"
              aria-label="From amount"
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
        </IsometricBox>

        {/* Swap Direction Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwapDirection}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-pink-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all iso-icon"
            aria-label="Swap token direction"
            title="Swap token direction"
          >
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* To Token */}
        <IsometricBox
          className="rounded-xl p-4 hover:brightness-105 transition-all mb-4"
          depth={15}
          frontColor="var(--iso-secondary)"
          rightColor="var(--iso-primary)"
        >
          <label
            htmlFor="toAmount"
            className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-300"
          >
            {t.toEstimated}
          </label>
          <div className="flex items-center justify-between">
            <input
              id="toAmount"
              type="text"
              value={toAmount}
              readOnly
              placeholder="0"
              className="bg-transparent text-2xl outline-none w-1/2 text-gray-900 dark:text-gray-100"
              aria-label="To amount"
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
        </IsometricBox>

        {/* Price/Fee Info */}
        {fromAmount && !error && (
          <IsometricBox
            className="mt-4 p-3 rounded-xl"
            depth={10}
          >
            {/* Price ratio row with gas icon & arrow toggle */}
            <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-between">
              <span>
                1 {selectedFromToken.symbol} ={" "}
                {exchangeRate ? formatNumber(exchangeRate) : "..."}{" "}
                {selectedToToken.symbol}
              </span>
              <button
                type="button"
                className="flex items-center cursor-pointer ml-2"
                onClick={() => setShowFees(!showFees)}
                aria-label="Toggle fees"
                title="Toggle fees details"
              >
                <Fuel />
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">
                  {formatCurrency(t.gasFee)}
                </span>
                <ChevronDown
                  className={`ml-1 transition-transform ${showFees ? "rotate-180" : ""}`}
                />
              </button>
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
                      (parseFloat(fromAmount || "0") * 0.0025 * (exchangeRate || 0)).toFixed(2)
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
          </IsometricBox>
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

        {/* Connect Wallet Button */}
        <IsometricButton
          onClick={() => setIsWalletModalOpen(true)}
          color="#3b82f6"
          fullWidth
          className="mt-8 py-4 text-center text-white font-bold text-lg shadow-lg"
          depth={12}
        >
          Connect Wallet
        </IsometricButton>
      </>
    );
  };

  // ---------------------- LIMIT Tab UI (Simplified) ----------------------
  const renderLimitTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col space-y-4">
        <IsometricBox
          className="p-4 rounded-xl"
          depth={15}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {t.when} 1 {selectedFromToken.symbol}
            </span>
            <input
              type="text"
              value={limitPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimitPrice(e.target.value)}
              placeholder={exchangeRate ? formatNumber(exchangeRate) : "0.00"}
              className="w-20 text-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 text-sm iso-input"
              aria-label="Limit price"
            />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {t.isWorth} {selectedToToken.symbol}
            </span>
          </div>
        </IsometricBox>

        {/* Quick Price Buttons */}
        <div className="flex justify-center space-x-2 text-xs">
          <IsometricButton
            className="px-3 py-1 rounded-full text-gray-600 dark:text-gray-300"
            onClick={() => setLimitPrice(exchangeRate ? formatNumber(exchangeRate) : "0")}
            aria-label="Set limit price to market"
            color="var(--iso-light)"
            depth={3}
          >
            {t.market}
          </IsometricButton>
          <IsometricButton
            className="px-3 py-1 rounded-full text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(String(exchangeRate)) * 1.01;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
            aria-label="Set limit price plus 1%"
            color="var(--iso-light)"
            depth={3}
          >
            {t.plus1}
          </IsometricButton>
          <IsometricButton
            className="px-3 py-1 rounded-full text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(String(exchangeRate)) * 1.05;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
            aria-label="Set limit price plus 5%"
            color="var(--iso-light)"
            depth={3}
          >
            {t.plus5}
          </IsometricButton>
          <IsometricButton
            className="px-3 py-1 rounded-full text-gray-600 dark:text-gray-300"
            onClick={() => {
              if (exchangeRate) {
                const newPrice = parseFloat(String(exchangeRate)) * 1.1;
                setLimitPrice(formatNumber(newPrice));
              }
            }}
            aria-label="Set limit price plus 10%"
            color="var(--iso-light)"
            depth={3}
          >
            {t.plus10}
          </IsometricButton>
        </div>

        <div className="flex items-center justify-between">
          {/* Sell */}
          <IsometricBox
            className="p-2 rounded-xl"
            depth={10}
            frontColor="var(--iso-primary)"
          >
            <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{t.sell}</label>
            <div className="flex items-center">
              <input
                type="text"
                value={limitSell}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimitSell(e.target.value)}
                placeholder="0"
                className="bg-transparent text-lg outline-none w-12 text-gray-900 dark:text-gray-100 text-center"
                aria-label="Limit sell amount"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-300">{selectedFromToken.symbol}</span>
            </div>
          </IsometricBox>

          <ArrowDownUp className="text-gray-400 dark:text-gray-500 mx-4 iso-icon" size={20} />

          {/* Buy */}
          <IsometricBox
            className="p-2 rounded-xl"
            depth={10}
            frontColor="var(--iso-secondary)"
          >
            <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{t.buyWord}</label>
            <div className="flex items-center">
              <input
                type="text"
                value={limitBuy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimitBuy(e.target.value)}
                placeholder="0"
                className="bg-transparent text-lg outline-none w-12 text-gray-900 dark:text-gray-100 text-center"
                aria-label="Limit buy amount"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-300">{selectedToToken.symbol}</span>
            </div>
          </IsometricBox>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs">
          <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">{t.expiry}:</span>
          {["1 day", "1 week", "1 month", "1 year"].map((item) => (
            <IsometricButton
              key={item}
              onClick={() => setLimitExpiry(item as LimitExpiryOption)}
              className={`px-3 py-1 rounded-full ${
                limitExpiry === item ? "text-pink-600" : "text-gray-600 dark:text-gray-300"
              }`}
              aria-label={`Set limit order expiry to ${item}`}
              color={limitExpiry === item ? "var(--iso-accent)" : "var(--iso-light)"}
              depth={3}
            >
              {item === "1 day" ? t.day1
               : item === "1 week" ? t.week1
               : item === "1 month" ? t.month1
               : t.year1}
            </IsometricButton>
          ))}
        </div>

        <IsometricButton
          onClick={() => setIsWalletModalOpen(true)}
          color="#3b82f6"
          fullWidth
          className="mt-8 py-4 text-center text-white font-bold text-lg shadow-lg"
          depth={12}
        >
          Connect Wallet
        </IsometricButton>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {t.limitDisclaimer}
        </p>
      </div>
    );
  };

  // ---------------------- NEW: SEND Tab UI ----------------------
  const renderSendTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          You're sending
        </span>

        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {sendAmount || "$0"}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {sendAmount
            ? `${sendAmount} ${sendToken.symbol}`
            : `0 ${sendToken.symbol}`}
        </div>

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

        <input
          type="text"
          value={sendAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendAmount(e.target.value)}
          placeholder="0"
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-center text-gray-800 dark:text-gray-100 w-24 iso-input"
          aria-label="Amount to send"
        />

        {/* Recipient address */}
        <div className="w-full">
          <label
            htmlFor="recipientInput"
            className="block text-sm text-gray-500 dark:text-gray-300 mb-1"
          >
            To
          </label>
          <input
            id="recipientInput"
            type="text"
            value={sendRecipient}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendRecipient(e.target.value)}
            placeholder="Wallet address or ENS name"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 iso-input"
            aria-label="Recipient address or ENS"
          />
        </div>

        <IsometricButton
          onClick={() => setIsWalletModalOpen(true)}
          color="#3b82f6"
          fullWidth
          className="mt-8 py-4 text-center text-white font-bold text-lg shadow-lg"
          depth={12}
        >
          Connect Wallet
        </IsometricButton>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Be sure to confirm the address carefully. Transactions cannot be reversed.
        </p>
      </div>
    );
  };

  // ---------------------- NEW: BUY Tab UI ----------------------
  const renderBuyTab = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          You're buying
        </span>

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
            className="px-4 py-2 bg-pink-100 dark:bg-pink-700 text-pink-600 dark:text-white rounded-full font-medium hover:bg-pink-200 dark:hover:bg-pink-600 iso-button"
            aria-label="Select a token to buy"
          >
            Select a token
          </button>
        )}

        {/* Quick amounts row */}
        <div className="flex space-x-2">
          {["$100", "$300", "$1000"].map((amount) => (
            <IsometricButton
              key={amount}
              className="px-3 py-1 rounded-full text-gray-600 dark:text-gray-300"
              onClick={() => setBuyAmount(amount)}
              aria-label={`Buy ${amount} worth of token`}
              color="var(--iso-light)"
              depth={3}
            >
              {amount}
            </IsometricButton>
          ))}
        </div>

        <IsometricButton
          onClick={() => setIsWalletModalOpen(true)}
          color="#3b82f6"
          fullWidth
          className="mt-8 py-4 text-center text-white font-bold text-lg shadow-lg"
          depth={12}
        >
          Connect Wallet
        </IsometricButton>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          This feature may require a third-party provider to purchase tokens.
        </p>
      </div>
    );
  };

  // ---------------------- Render ----------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors flex iso-container">
      {/* Sidebar */}
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 fixed h-full iso-sidebar">
        {/* Logo */}
        <div
          onClick={() => {
            handleReset();
            window.location.reload();
          }}
          className="cursor-pointer hover:opacity-80 mb-8 iso-logo"
        >
          <img src="/assets/Logo-ZC-SWAP.svg" alt="Zuniswap Logo" className="w-12 h-12" />
        </div>
        
        {/* Vertical Navigation */}
        <div className="flex flex-col items-center space-y-6">
          <button 
            className="p-2 rounded-lg bg-blue-50 text-blue-600 iso-icon"
            aria-label="Trade"
            title="Trade"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 iso-icon"
            aria-label="Explore"
            title="Explore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 iso-icon"
            aria-label="Pool"
            title="Pool"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 iso-icon"
            aria-label="Tokens"
            title="Tokens"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-16 perspective-1000">
        {/* Top Header */}
        <div className="flex items-center justify-end w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          {/* Right: Settings + Connect */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full iso-icon"
                aria-label="Open preferences"
                title="Open preferences"
              >
                <Settings size={16} />
              </button>
              {isPreferencesOpen && (
                <IsometricBox 
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg p-4 text-sm z-10"
                  depth={15}
                  frontColor="var(--iso-primary)"
                  rightColor="var(--iso-secondary)"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    {t.globalPreferences}
                  </div>
                  <div className="space-y-4">
                    {/* Theme */}
                    <div>
                      <label
                        htmlFor="theme-select"
                        className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1 block"
                      >
                        {t.theme}
                      </label>
                      <select
                        id="theme-select"
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100 iso-input"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setTheme(e.target.value as ThemeOption)
                        }
                        value={theme}
                        aria-label="Select theme"
                      >
                        <option value="auto">{t.auto}</option>
                        <option value="light">{t.light}</option>
                        <option value="dark">{t.dark}</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label
                        htmlFor="language-select"
                        className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1 block"
                      >
                        {t.language}
                      </label>
                      <select
                        id="language-select"
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100 iso-input"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setLanguage(e.target.value as LanguageOption)
                        }
                        value={language}
                        aria-label="Select language"
                      >
                        <option value="english">{t.english}</option>
                        <option value="vietnamese">{t.vietnamese}</option>
                      </select>
                    </div>

                    {/* Currency */}
                    <div>
                      <label
                        htmlFor="currency-select"
                        className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold mb-1 block"
                      >
                        {t.currency}
                      </label>
                      <select
                        id="currency-select"
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-100 iso-input"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setCurrency(e.target.value as CurrencyOption)
                        }
                        value={currency}
                        aria-label="Select currency"
                      >
                        <option value="usd">{t.usd}</option>
                        <option value="vnd">{t.vnd}</option>
                      </select>
                    </div>
                  </div>
                </IsometricBox>
              )}
            </div>

            <IsometricButton
              onClick={() => setIsWalletModalOpen(true)}
              color="#3b82f6"
              depth={8}
              className="px-4 py-2 text-white font-bold shadow-lg rounded-full"
            >
              {t.connect}
            </IsometricButton>
          </div>
        </div>

        {/* Main Content: Search bar above the card, centered. */}
        <div className="container mx-auto px-4 mt-8 flex flex-col items-center">
          {/* Search tokens */}
          <div className="mb-6">
            <div className="relative">
              <label htmlFor="searchTokens" className="sr-only">
                {t.searchTokens}
              </label>
              <input
                id="searchTokens"
                type="text"
                placeholder={t.searchTokens}
                className="pl-10 pr-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none w-64 text-gray-800 dark:text-gray-100 iso-input"
                aria-label={t.searchTokens}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
                🔍
              </span>
            </div>
          </div>

          {/* Swap/Limit Card */}
          <IsometricBox 
            className="max-w-md w-full rounded-2xl p-4 text-gray-900 dark:text-gray-100 transition-colors"
            depth={30}
            frontColor="var(--iso-primary)"
            rightColor="var(--iso-secondary)"
          >
            {/* Tab Switcher */}
            <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tabLabel) => (
                <button
                  key={tabLabel}
                  onClick={() => setActiveTab(tabLabel)}
                  className={`px-4 py-2 relative transition-colors duration-200 ${
                    activeTab === tabLabel
                      ? "text-pink-600 iso-text"
                      : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                  aria-label={`Switch to ${tabLabel} tab`}
                >
                  {tabLabel}
                  {activeTab === tabLabel && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-pink-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Conditional Rendering: Swap vs Limit vs Send vs Buy */}
            {activeTab === t.swap && renderSwapTab()}

            {activeTab === t.limit && (
              <div className="space-y-4">
                {renderLimitTab()}
              </div>
            )}

            {activeTab === t.send && (
              <div className="space-y-4">
                {renderSendTab()}
              </div>
            )}

            {activeTab === t.buy && (
              <div className="space-y-4">
                {renderBuyTab()}
              </div>
            )}
          </IsometricBox>
        </div>
      </div>

      {/* TokenSelectModal */}
      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleTokenSelect}
        tokens={tokens}
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
