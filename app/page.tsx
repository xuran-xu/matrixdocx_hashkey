'use client';

import React from 'react';
import MainLayout from './main-layout';
import StatsCard from '../components/StatsCard';
import StakingForm from '../components/StakingForm';
import StakingHistory from '../components/StakingHistory';
import FlowingParticles from '../components/FlowingParticles';
import Link from 'next/link';

export default function Home() {
  // Mock statistics data
  const stats = [
    { label: 'Total Staked', value: '1,234,567 HSK' },
    { label: 'Stakers', value: '8,765' },
    { label: 'Average APY', value: '11.5%' }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[90vh] flex items-center">
        {/* Flowing sand particles background */}
        <FlowingParticles />
        
        {/* Gradient overlay - removed to avoid covering particles */}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6 drop-shadow-lg">
              Begin Your Digital Gold Era
            </h1>
            <p className="text-xl text-base-content mb-8 drop-shadow">
              Hold gold effortlessly, earn rewards securely
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/stake" className="btn-staking py-3 px-8 font-medium">
                <span>Start Staking</span>
              </Link>
              <a 
                href="https://explorer.hsk.xyz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-transparent border border-neutral hover:border-gold text-base-content py-3 px-8 rounded-[0.5rem] font-medium
                  transition-all duration-300 hover:shadow-md"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-200/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      {/* Staking Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <StakingForm />
            </div>
            <div className="lg:col-span-2">
              <StakingHistory />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gold text-center mb-12">Why Choose HashKey Staking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-300/50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Secure & Reliable</h3>
              <p className="text-base-content">Your asset security is our top priority. All staking contracts are audited by third parties.</p>
            </div>
            <div className="bg-base-300/50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">High Returns</h3>
              <p className="text-base-content">Competitive staking rewards with APYs up to 15%.</p>
            </div>
            <div className="bg-base-300/50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Flexible Options</h3>
              <p className="text-base-content">Multiple staking periods to meet different user needs.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}