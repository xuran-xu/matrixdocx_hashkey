'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'Stake',
      path: '/stake',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      name: 'Portfolio',
      path: '/portfolio',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* 桌面端左侧导航栏 */}
      <div className={`hidden lg:block bg-white/50 backdrop-blur-sm border-r border-base-300 transition-all duration-300 ${
        isMenuCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Logo 区域 */}
        <div className="p-4 border-b border-base-300">
          <Link href="/" className="flex items-center justify-center">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
              <span className="text-xl font-bold text-primary">
                H
              </span>
            </div>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-neutral-600 hover:bg-base-200 hover:text-primary'
                  }`}
                  title={isMenuCollapsed ? item.name : undefined}
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    {item.icon}
                  </div>
                  {!isMenuCollapsed && (
                    <span className="transition-all">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 收缩按钮 */}
        <button
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          className="absolute bottom-4 -right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isMenuCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 在侧边栏底部添加钱包连接按钮 */}
        <div className={`absolute bottom-16 left-0 right-0 p-4 ${isMenuCollapsed ? 'flex justify-center' : ''}`}>
          <ConnectKitButton/>
        </div>
      </div>

      {/* 移动端顶部导航 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm border-b border-base-300">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary font-bold">
              H
            </span>
          </Link>

          {/* 添加钱包连接按钮 */}
          <div className="flex items-center gap-2">
            <ConnectKitButton />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-base-200"
            >
              <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单下拉 */}
        {isMobileMenuOpen && (
          <nav className="border-t border-base-300 bg-white/50 backdrop-blur-sm">
            <ul className="p-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-600 hover:bg-base-200 hover:text-primary'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1">
        <div className="lg:hidden h-16" /> {/* 移动端顶部导航占位 */}
        {children}
      </div>
    </div>
  );
}