'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// XAUM代币合约地址
const XAUMAddress = '0x2577217c86ae2E8a5f70Abb663B9231E5d47D15a'; 
// https://hashkey.blockscout.com/token/0x2577217c86ae2E8a5f70Abb663B9231E5d47D15a?tab=contract_bytecode

export default function AddressBar() {
  const [copied, setCopied] = useState(false);

  // 复制后3秒重置状态
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(XAUMAddress).then(() => {
      setCopied(true);
    });
  };

  const handleAddToWallet = () => {
    // 检查是否有以太坊提供者
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: XAUMAddress,
            symbol: 'XAUM',
            decimals: 18,
            // 可选: 代币图标
            image: window.location.origin + '/gold_coin.png',
          },
        },
      })
      .then((success: boolean) => {
        if (success) {
          console.log('XAUM token added to wallet');
        } else {
          console.log('Token not added');
        }
      })
      .catch(console.error);
    } else {
      console.log('Ethereum provider not found');
      // 可以添加一个用户友好的提示
    }
  };

  return (
    <div className="token-address-box">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="token-address-icon">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-base-content mb-1">XAUM Token Address</h3>
            <p className="text-xs text-base-content/70 font-mono">{XAUMAddress}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <div className="token-address-copy-button" onClick={handleCopy}>
              <Image
                src={copied ? "/tick-circle.png" : "/copy.png"}
                alt="Copy"
                width={24}
                height={24}
              />
            </div>
            <span className="token-address-tooltip">
              {copied ? "已复制" : "复制地址"}
            </span>
          </div>
          
          <div className="relative group">
            <div className="token-address-copy-button" onClick={handleAddToWallet}>
              <Image
                src="/wallet.png"
                alt="Add to wallet"
                width={24}
                height={24}
              />
            </div>
            <span className="token-address-tooltip">
              添加到钱包
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 