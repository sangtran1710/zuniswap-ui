// src/types/index.ts

// Token interface
export interface Token {
    symbol: string;
    id: string;
  }
  
  // i18n interface
  export interface I18nStrings {
    swap: string;
    limit: string;
    send: string;
    buy: string;
    from: string;
    toEstimated: string;
    connect: string;
    connectWallet: string;
    searchTokens: string;
    finalizingQuote: string;
    failFetch: string;
    globalPreferences: string;
    theme: string;
    language: string;
    currency: string;
    auto: string;
    light: string;
    dark: string;
    english: string;
    vietnamese: string;
    usd: string;
    vnd: string;
    trade: string;
    explore: string;
    pool: string;
    fee: string;
    networkCost: string;
    orderRouting: string;
    priceImpact: string;
    maxSlippage: string;
    autoSlippage: string;
    gasFee: string;
    when: string;
    isWorth: string;
    market: string;
    plus1: string;
    plus5: string;
    plus10: string;
    sell: string;
    buyWord: string;
    expiry: string;
    day1: string;
    week1: string;
    month1: string;
    year1: string;
    limitDisclaimer: string;
  }
  
  // Theme, language và currency options
  export type ThemeOption = 'auto' | 'light' | 'dark';
  export type LanguageOption = 'english' | 'vietnamese';
  export type CurrencyOption = 'usd' | 'vnd';
  export type TabOption = 'Swap' | 'Limit' | 'Send' | 'Buy';
  export type ModalType = 'from' | 'to';