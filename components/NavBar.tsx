'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectKitButton } from 'connectkit';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-primary/5 hover:text-primary';
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/" className={isActive('/')}>Dashboard</Link></li>
            <li><Link href="/stake" className={isActive('/stake')}>Stake</Link></li>
            <li><Link href="/portfolio" className={isActive('/portfolio')}>My Portfolio</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl text-primary font-bold">
          HashKey Staking
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/" className={`px-4 py-2 rounded-md mx-1 ${isActive('/')}`}>Dashboard</Link></li>
          <li><Link href="/stake" className={`px-4 py-2 rounded-md mx-1 ${isActive('/stake')}`}>Stake</Link></li>
          <li><Link href="/portfolio" className={`px-4 py-2 rounded-md mx-1 ${isActive('/portfolio')}`}>My Portfolio</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <ConnectKitButton />
      </div>
    </div>
  );
}