'use client';

import Image from 'next/image'
import { useTokenBalances } from '@/hooks/useBalance';
import { formatUnits } from 'viem';

// Define decimals for each token.
// Ideally, these might come from a more centralized configuration or be fetched if contracts support a decimals() view function.
const TOKEN_DECIMALS = {
  XAUM: 18, // Standard ERC20, assuming 18 decimals for XAUM
  USDT: 6,  // USDT commonly uses 6 decimals
  USDC: 6,  // USDC commonly uses 6 decimals
  HSK: 18,  // Assuming native token (HSK) has 18 decimals
};

export default function WalletBalance() {
  const { xaum, usdt, usdc, hsk, isLoading, error, refetch } = useTokenBalances();

  const getDisplayBalance = (balance: bigint, decimals: number) => {
    // Format to 4 decimal places for display
    const formatted = formatUnits(balance, decimals);
    return parseFloat(formatted).toFixed(4);
  };

  return (
    <div className="w-full bg-base-300/95 p-8 rounded-box shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold text-base-content/80">Wallet Balance</h2>
        <button className="btn btn-xs btn-ghost" onClick={refetch} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {/* {error && !isLoading && (
        <p className="text-error text-xs mb-2 truncate" title={error.message}>
          Error loading balances: {error.message.length > 50 ? error.message.substring(0, 50) + '...' : error.message}
        </p>
      )} */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* XAUM Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/xaum.png" alt="XAUM" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">XAUM</p>
            <p className="text-sm font-medium">
              {isLoading ? 'Loading...' : getDisplayBalance(xaum, TOKEN_DECIMALS.XAUM)}
            </p>
          </div>
        </div>

        {/* HSK Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/HSK.png" alt="HSK" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">HSK</p>
            <p className="text-sm font-medium">
              {isLoading ? 'Loading...' : getDisplayBalance(hsk, TOKEN_DECIMALS.HSK)}
            </p>
          </div>
        </div>

        {/* USDT Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/USDT.png" alt="USDT" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">USDT</p>
            <p className="text-sm font-medium">
              {isLoading ? 'Loading...' : getDisplayBalance(usdt, TOKEN_DECIMALS.USDT)}
            </p>
          </div>
        </div>

        {/* USDC Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/USDC.png" alt="USDC" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">USDC</p>
            <p className="text-sm font-medium">
              {isLoading ? 'Loading...' : getDisplayBalance(usdc, TOKEN_DECIMALS.USDC)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
