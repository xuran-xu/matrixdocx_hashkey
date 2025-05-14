'use client';

import React from 'react';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? 'text-gold font-medium' 
      : 'text-base-content hover:text-gold transition-colors';
  };

  return (
    <nav className="bg-base-300/80 backdrop-blur border-b border-neutral py-3 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-gold font-bold text-xl">
            HashKey Chain X
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={isActive('/')}>
              Home
            </Link>
            <Link href="/stake" className={isActive('/stake')}>
              Stake
            </Link>
            <Link href="/my_assets" className={isActive('/my_assets')}>
              My Assets
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}