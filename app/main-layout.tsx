'use client';

import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 pt-16 pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
