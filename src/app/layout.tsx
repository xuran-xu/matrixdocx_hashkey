import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Matrixdocx - 区块链生态系统',
  description: '探索、连接并参与我们蓬勃发展的区块链生态系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.variable + " font-sans"}>
        {children}
      </body>
    </html>
  );
}
