'use client';

import React, { useState } from 'react';

export const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const connectWallet = () => {
    setIsConnected(true);
    setAddress('0x1234...5678');
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="btn-hashkey"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 bg-hashkey-dark-300/50 hover:bg-hashkey-dark-300 text-white border border-hashkey-primary/30 rounded-md transition duration-200 flex items-center gap-2 text-sm shadow-hashkey"
          >
            <div className="w-2 h-2 bg-hashkey-success rounded-full"></div>
            {address}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-hashkey-dark-200 rounded-md shadow-hashkey-lg overflow-hidden z-50 border border-hashkey-dark-400/70">
              <div className="p-4">
                <div className="text-sm text-gray-300 mb-2">Connected to</div>
                <div className="font-medium text-white truncate mb-4">{address}</div>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-hashkey-dark-300 rounded-md transition duration-200">
                    View My Activities
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-hashkey-dark-300 rounded-md transition duration-200">
                    Copy Address
                  </button>
                  <button 
                    onClick={disconnectWallet}
                    className="w-full text-left px-3 py-2 text-sm text-hashkey-error hover:bg-hashkey-dark-300 rounded-md transition duration-200"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 