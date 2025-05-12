'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Header({ lang = 'zh' }: { lang?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={`/${lang}`} className="text-2xl font-bold flex items-center">
          <span className="text-primary-dark">Matrixdocx</span>
        </Link>
        
        {/* 桌面导航 */}
        <nav className="hidden md:flex space-x-6">
          <Link href={`/${lang}/projects`} className="text-gray-700 hover:text-primary">
            项目
          </Link>
          <Link href={`/${lang}/events`} className="text-gray-700 hover:text-primary">
            活动
          </Link>
          <Link href={`/${lang}/about`} className="text-gray-700 hover:text-primary">
            关于
          </Link>
        </nav>
        
        {/* 钱包连接按钮 - 会在后面创建 */}
        <div className="hidden md:block">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            连接钱包
          </button>
        </div>
        
        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link href={`/${lang}/projects`} className="text-gray-700 hover:text-primary">
              项目
            </Link>
            <Link href={`/${lang}/events`} className="text-gray-700 hover:text-primary">
              活动
            </Link>
            <Link href={`/${lang}/about`} className="text-gray-700 hover:text-primary">
              关于
            </Link>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              连接钱包
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}