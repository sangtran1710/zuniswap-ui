import React from "react";
import { ChevronDown } from "lucide-react";
import { getTokenImage } from "../utils/tokenUtils";

const TokenSelector = ({ token, onTokenSelect, logo }) => {
  return (
    <button 
      onClick={onTokenSelect}
      className="flex items-center bg-gray-100 gap-2 rounded-2xl px-3 py-1.5 hover:bg-gray-200 transition-colors"
    >
      <div className="flex items-center min-w-[20px]">
        <img 
          src={logo}
          alt={token}
          className="w-5 h-5 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/24/24";
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