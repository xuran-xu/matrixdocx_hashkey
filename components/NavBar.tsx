'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-800 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-white font-bold text-xl">
            HashKey Staking
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              首页
            </Link>
            <Link href="/stake" className="text-gray-300 hover:text-white">
              质押
            </Link>
            <Link href="/portfolio" className="text-gray-300 hover:text-white">
              我的资产
            </Link>
            <Link href="/events" className="text-gray-300 hover:text-white">
              事件
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}