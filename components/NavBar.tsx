'use client';

import React from 'react';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path 
      ? 'text-gold font-medium' 
      : 'text-base-content hover:text-gold transition-colors';
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-base-300/80 backdrop-blur border-b border-neutral py-3 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto pl-0 pr-1 flex justify-between items-center">
        <div className="flex items-center space-x-0">
          <div onClick={() => handleNavigation('/')} className="cursor-pointer flex items-center">
            <div className="relative h-12 w-48">
              <Image
                src="/H-logo.png"
                alt="HashKey Chain Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8"> {/* 增加了间距 space-x-8 */}
            <div onClick={() => handleNavigation('/')} className={`cursor-pointer text-[16px] ${isActive('/')}`}>
              Home
            </div>
            <div onClick={() => handleNavigation('/get_start')} className={`cursor-pointer text-[16px] ${isActive('/get_start')}`}>
              Get start
            </div>
            <div onClick={() => handleNavigation('/my_assets')} className={`cursor-pointer text-[16px] ${isActive('/my_assets')}`}>
              My Assets
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}