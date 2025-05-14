'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <NavBar />
      <main className="pt-16 pb-24 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
