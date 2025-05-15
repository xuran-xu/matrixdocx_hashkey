'use client';

import React, { useState } from 'react';
import MainLayout from './main-layout';
import FlowingParticles from '../components/FlowingParticles';
import AddressBar from '../components/AddressBar';
import Link from 'next/link';

export default function Home() {
  // Mock statistics data
  const stats = [
    { label: 'Total Staked', value: '1,234,567 HSK', border: 'accent' },
    { label: 'Max APY', value: 'Up to 36%', highlight: true },
    { label: 'Reward Interval', value: '1 Block', border: 'accent' }
  ];

  // Staking options data
  const stakingOptions = [
    {
      title: 'HyperIndex Exchange',
      apy: '5%',
      description: 'Participate in HyperIndex XAUM/HSK LP pool to earn additional 4% APY rewards',
      logo: '/hyperindex.jpg',
    },
    {
      title: 'DODO Exchange',
      apy: '5%',
      description: 'Provide liquidity for DODO XAUM/HSK LP pool to earn multiple rewards',
      logo: '/DODO.png',
    },
    {
      title: 'Lending',
      apy: '5%',
      description: 'Lend your XAUM to earn stable interest rewards',
      logo: '/Hashprime.png',
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
              <Link href="/get_start" className="btn btn-primary hover:btn-accent transition-all duration-300 shadow-md hover:shadow-lg py-3 px-8 font-medium">
                <span>BUY XAUM</span>
              </Link>
            </div>
            
            {/* XAUM Token Address */}
            <AddressBar />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-200 bg-opacity-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-box flex flex-col items-center text-center border ${
                  stat.highlight 
                    ? 'border-primary border-2' 
                    : 'border-accent border-opacity-60'
                } bg-base-300 bg-opacity-50`}
              >
                <h3 className="text-lg font-medium text-gold mb-2">{stat.label}</h3>
                <p className={`text-2xl font-bold ${
                  stat.highlight ? 'text-primary text-3xl' : 'text-base-content'
                }`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Base APY Section */}
      <section className="py-12 bg-base-300 bg-opacity-30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-medium text-gold mb-4">Base Annual Yield</h2>
            <p className="text-base-content opacity-80">
              Basic holding reward rate is <span className="font-bold text-primary">APY=1%</span>
            </p>
          </div>
        </div>
      </section>

      {/* Staking Options Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gold text-center mb-12">
            Staking Options - Maximize Your Gold Yields
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stakingOptions.map((option, index) => (
              <div key={index} className="bg-base-300 border border-neutral p-6 rounded-box hover:border-primary transition-colors h-full flex flex-col">
                <div className="flex flex-col items-center flex-grow">
                  {option.logo && (
                    <div className="w-12 h-12 mb-4 flex items-center justify-center">
                      <img 
                        src={option.logo} 
                        alt={option.title} 
                        className={`${
                          option.title === 'Lending' 
                            ? 'h-15 w-auto'   // Hashprime logo 保持原始比例
                            : 'w-8 h-8'     // 其他 logo 固定宽高
                        } object-contain`}    // 保证图片不变形
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gold mb-2">{option.title}</h3>
                  <div className="text-2xl text-primary font-bold mb-4">
                    APY = {option.apy}
                  </div>
                  <p className="text-base-content text-center mb-6 flex-grow">{option.description}</p>
                  <Link href="/get_start" className="btn btn-primary btn-outline w-full mt-auto">
                    Get Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gold text-center mb-12">Why Choose HashKey Staking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-300 bg-opacity-50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Secure & Reliable</h3>
              <p className="text-base-content">Your asset security is our top priority. All staking contracts are audited by third parties.</p>
            </div>
            <div className="bg-base-300 bg-opacity-50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">High Returns</h3>
              <p className="text-base-content">Competitive staking rewards with APYs up to 36%.</p>
            </div>
            <div className="bg-base-300 bg-opacity-50 border border-neutral p-6 rounded-box">
              <div className="text-gold text-4xl mb-4">
                <i className="fas fa-hand-holding-usd"></i>
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
          <h2 className="text-3xl font-bold text-gold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <div 
                  className="p-4 bg-base-300 bg-opacity-50 border border-neutral rounded-lg cursor-pointer flex justify-between items-center"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-xl font-medium text-gold">{faq.question}</h3>
                  <span className="text-gold">
                    {openQuestion === index ? 
                      <i className="fas fa-chevron-up"></i> : 
                      <i className="fas fa-chevron-down"></i>
                    }
                  </span>
                </div>
                {openQuestion === index && (
                  <div className="p-4 bg-base-200 bg-opacity-30 border-l border-r border-b border-neutral rounded-b-lg mt-[-4px]">
                    <p className="text-base-content">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}