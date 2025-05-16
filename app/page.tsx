'use client';

import React, { useState } from 'react';
import MainLayout from './main-layout';
import FlowingParticles from '../components/FlowingParticles';
import AddressBar from '../components/AddressBar';
import Link from 'next/link';
import { ShieldCheckIcon, ChartBarIcon, CurrencyDollarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function Home() {
  // Mock statistics data
  const stats = [
    { 
      label: 'Max APY', 
      value: '5%', 
      subValue: ['Base APY = 1%', 'Additional Reward = 4%'],
      highlight: true 
    },
    { label: 'Total Staked', value: '1,234,567 HSK', border: 'accent' },
    { label: 'Reward Interval', value: '1 Block', border: 'accent' }
  ];

  // Staking options data
  const stakingOptions = [
    {
      title: 'HyperIndex Exchange',
      apy: '5%',
      description: 'Participate in HyperIndex XAUM/HSK LP pool to earn additional 4% APY rewards',
      logo: '/hyper.png',
    },
    {
      title: 'More Options Coming Soon',
    },
  ];

  // FAQ data
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "What is XAUM token?",
      answer: "XAUM is a digital asset linked to gold prices. Each XAUM token is backed by real gold, providing users with a digital channel for gold investment."
    },
    {
      question: "How to start staking XAUM?",
      answer: "You need to first acquire XAUM tokens, then connect your wallet through our platform, select staking terms and amounts. The entire process is secure and convenient, taking only minutes to complete."
    },
    {
      question: "How are staking rewards calculated?",
      answer: "Staking rewards are based on your staking amount, term, and current APY rate. Rewards are settled every block, and you can choose to withdraw or reinvest your rewards at any time."
    },
    {
      question: "What are the risks of staking?",
      answer: "Our smart contracts have been rigorously audited, but we still recommend users understand the basic risks of blockchain technology. As with any investment, market fluctuations may affect the value of XAUM."
    }
  ];

  // Toggle question expand/collapse state
  const toggleQuestion = (index: number) => {
    if (openQuestion === index) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(index);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[90vh] flex items-center">
        {/* Flowing sand particles background */}
        <FlowingParticles />
        
        {/* Gradient overlay - removed to avoid covering particles */}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold gold-shine-text mb-6 drop-shadow-lg">
              Begin Your Digital Gold Era
            </h1>
            <p className="text-xl text-base-content mb-8 drop-shadow">
              Hold gold effortlessly, earn rewards securely
            </p>
            <div className="flex justify-center">
              <Link href="/get_start" className="btn bg-primary hover:bg-primary/80 text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl py-3 px-8">
                <span>BUY XAUM</span>
              </Link>
            </div>
            
            {/* XAUM Token Address */}
            <AddressBar />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-[400px,2px,1fr] gap-12">
            {/* Max APY Card */}
            <div className="p-4 rounded-lg flex flex-col items-center justify-center">
              <h3 className="text-base-content mb-2">{stats[0].label}</h3>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-primary mb-6">{stats[0].value}</p>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6"></div>
                <div className="flex flex-col gap-3 items-center">
                  {stats[0].subValue?.map((text, i) => (
                    <span key={i} className="text-base text-base-content/90">{text}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-full border-r border-dashed border-primary/30"></div>

            {/* Other Stats */}
            <div className="flex flex-col justify-center gap-6 pl-12">
              {stats.slice(1).map((stat, index) => (
                <div
                  key={index}
                  className="p-3 flex items-center gap-4"
                >
                  <h3 className="text-base-content">{stat.label}:</h3>
                  <p className="text-2xl font-bold text-primary/80">{
                    stat.label === 'Total Staked' ? '1,234,567 XAUM' : stat.value
                  }</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staking Options Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-base-content text-center mb-12">
            Staking Options - Maximize Your Gold Yields
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
            {stakingOptions.map((option, index) => (
              <div 
                key={index} 
                className="relative bg-gradient-to-b from-base-300 to-amber-400/30 p-6 rounded-xl h-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 backdrop-blur-sm max-w-xs mx-auto w-full"
              >
                {option.description ? (
                  // 有描述的卡片保持原有布局
                  <div className="flex flex-col items-center">
                    {option.logo && (
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <img src={option.logo} alt={option.title} className="w-12 h-12 object-contain" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-primary/80 mb-3">{option.title}</h3>
                    {option.apy && (
                      <div className="text-2xl text-primary font-bold mb-4">
                        APY = {option.apy}
                      </div>
                    )}
                    <p className="text-base-content text-center mb-6">{option.description}</p>
                    <Link href="/get_start" className="btn bg-primary hover:bg-primary/80 text-black border-none w-[150px] transition-all duration-300">
                      Get Start
                    </Link>
                  </div>
                ) : (
                  // 无描述的卡片使用完全居中布局
                  <div className="flex items-center justify-center h-full w-full">
                    <h3 className="text-2xl font-bold text-primary text-center">{option.title}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-base-content text-center mb-12">Why Choose HashKey Staking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x-2 divide-dashed divide-primary/30">
            <div className="bg-base-300/30 p-8 rounded-none text-center">
              <div className="text-gold flex justify-center mb-4">
                <ShieldCheckIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Secure & Reliable</h3>
              <p className="text-base-content">Your asset security is our top priority. All staking contracts are audited by third parties.</p>
            </div>
            <div className="bg-base-300/30 p-8 rounded-none text-center">
              <div className="text-gold flex justify-center mb-4">
                <ChartBarIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">High Returns</h3>
              <p className="text-base-content">Competitive staking rewards with APYs up to 5%.</p>
            </div>
            <div className="bg-base-300/30 p-8 rounded-none text-center">
              <div className="text-gold flex justify-center mb-4">
                <CurrencyDollarIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Flexible Options</h3>
              <p className="text-base-content">Multiple staking periods to meet different user needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Q&A Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-base-content text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-base-300 rounded-lg overflow-hidden">
                <button
                  className="w-full p-4 flex justify-between items-center bg-base-200 hover:bg-base-300 transition-colors duration-200"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-lg font-medium text-primary text-left">{faq.question}</h3>
                  <span className="text-base-content/80 ml-4">
                    {openQuestion === index ? 
                      <ChevronUpIcon className="w-5 h-5" /> : 
                      <ChevronDownIcon className="w-5 h-5" />
                    }
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    openQuestion === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 bg-base-100/50">
                    <p className="text-base-content/90">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}