import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HashKey Chain Staking',
  description: 'Stake your HSK tokens and earn rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  // 使用key强制重新渲染组件树
  const forceUpdateKey = new Date().getTime();
  
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* 添加meta标签禁用缓存 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className} key={forceUpdateKey}>
        <div className='bg-gradient-to-b from-base-300 to-base-100 min-h-screen'>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}