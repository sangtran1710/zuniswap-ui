import React from 'react';
import { Link } from 'react-router-dom';

const GlobalMenu: React.FC = () => {
  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-[#131A2A] backdrop-blur-md rounded-xl border border-white/[0.08] shadow-xl overflow-hidden z-50">
      <div className="p-2">
        <nav>
          <ul className="space-y-1">
            <li>
              <Link to="/tokens" className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                Tokens
              </Link>
            </li>
            <li>
              <Link to="/nfts" className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                NFTs
              </Link>
            </li>
            <li>
              <Link to="/pools" className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                Pools
              </Link>
            </li>
            <li className="border-t border-white/[0.08] my-1 pt-1">
              <a href="https://github.com/your-repo/zuniswap" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://docs.zuniswap.org" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                Docs
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default GlobalMenu; 