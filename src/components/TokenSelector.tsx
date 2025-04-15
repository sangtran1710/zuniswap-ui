import React from "react";
import { ChevronDown } from "lucide-react";
import { getTokenImage } from "../utils/tokenUtils";

// Định nghĩa interface cho props
interface TokenSelectorProps {
  token: string;
  onTokenSelect: () => void;
  logo: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ token, onTokenSelect, logo }) => {
  return (
    <button
      onClick={onTokenSelect}
      className="flex items-center bg-gray-100 gap-2 rounded-2xl px-3 py-1.5 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <div className="flex items-center min-w-[20px]">
        <img
          src={logo}
          alt={token}
          className="w-5 h-5 rounded-full"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            // Cần ép kiểu target sang HTMLImageElement
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/api/placeholder/24/24";
          }}
        />
      </div>
      <span className="font-medium text-base text-gray-900">{token}</span>
      <ChevronDown
        size={16}
        className="text-gray-500 ml-0.5"
      />
    </button>
  );
};

export default TokenSelector;