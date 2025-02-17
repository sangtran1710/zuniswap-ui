export const getTokenImage = (symbol) => {
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