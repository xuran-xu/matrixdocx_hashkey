import './globals.css'
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { Providers } from './providers'
import React from 'react'
import NavBar from '../components/NavBar'

const inter = Inter({ subsets: ['latin'] })
const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora'
});

export const metadata: Metadata = {
  title: 'HashKey Chain Staking',
  description: 'Stake your HSK tokens and earn rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <html lang="en" data-theme="dark">
      <body className={`${sora.className}`}>
        <div className='bg-gradient-to-b from-base-300 to-base-100 min-h-screen'>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}