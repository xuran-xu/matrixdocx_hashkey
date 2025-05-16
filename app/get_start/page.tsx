'use client';

import React, { useState } from 'react';
import MainLayout from '../main-layout';
import Image from 'next/image';

export default function GetStart() {
  // Mock wallet connection state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Mock exchange rate and balance
  const [inputAmount, setInputAmount] = useState<string>('');
  const exchangeRate = 0.1; // Mock rate: 1 HSK = 0.1 XAUM
  const mockBalances = {
    hsk: '10000',
    xaum: '1000'
  };

  // Calculate estimated XAUM amount
  const estimatedXAUM = inputAmount ? (parseFloat(inputAmount) * exchangeRate).toFixed(2) : '0';

  // 修改类型定义
  type StakingOptionKey = 'base' | 'hyperindex';
  
  // 修改 Staking 选项配置
  const stakingOptions = {
    base: {
      name: 'Base Holding',
      apy: '1',
      description: 'Basic XAUM holding rewards'
    },
    hyperindex: {
      name: 'HyperIndex LP',
      apy: '5',
      description: 'Provide liquidity to XAUM/HSK pool'
    }
  };

  // 添加 Staking 相关状态
  const [selectedOption, setSelectedOption] = useState<StakingOptionKey>('hyperindex');
  const [stakingAmount, setStakingAmount] = useState<string>('');
  
  // 处理 MAX 按钮点击
  const handleMaxClick = () => {
    setStakingAmount(mockBalances.xaum);
  };

  return (
    <MainLayout>
      {/* Main container with gradient background */}
      <div className="min-h-screen bg-base-200 pt-20 pb-20 font-sora">
        <div className="container mx-auto px-4 relative">
          {/* Step 1: Buy XAUM Section */}
          <div className="relative">
            <div className="mb-16"> {/* 减小底部间距 */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <h2 className="text-3xl font-bold text-base-content">
                  <span className="text-primary">Step 1. </span>Start Buying XAUM
                </h2>
              </div>

              {/* Exchange Form Card */}
              <div className="bg-base-300/95 rounded-box p-8 max-w-2xl mx-auto shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                    </svg>
                  </div>
                  <p className="text-lg mb-4">Click the button below to start purchasing XAUM</p>
                  <a 
                    href="#" 
                    className="btn bg-primary hover:bg-primary/80 text-black border-none transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Go to Exchange
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Staking Options Section */}
          <div className="relative pt-10">
            <div className="flex items-center gap-4 mb-12 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <h2 className="text-3xl font-bold text-base-content">
                <span className="text-primary">Step 2. </span>Choose Your Staking Option
              </h2>
            </div>

            {/* Main staking container with left-right split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Staking Options */}
              <div className="space-y-4">
                {/* HyperIndex Option */}
                <div 
                  className={`bg-base-300/95 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'hyperindex' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer staking-card-gradient hover:scale-105 hover:shadow-xl transition-all duration-300`}
                  onClick={() => setSelectedOption('hyperindex')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-primary">HyperIndex LP</h3>
                      <p className="text-base-content/70">Provide liquidity to XAUM/HSK pool</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">5% APY</div>
                      <label className="swap">
                        <input type="radio" name="staking-option" value="hyperindex" />
                        <div className="swap-on">✓</div>
                        <div className="swap-off"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Base Option */}
                <div 
                  className={`bg-base-300/95 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'base' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer staking-card-gradient hover:scale-105 hover:shadow-xl transition-all duration-300`}
                  onClick={() => setSelectedOption('base')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Base Holding</h3>
                      <p className="text-base-content/70">Basic XAUM holding rewards</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">1% APY</div>
                      <label className="swap">
                        <input type="radio" name="staking-option" value="base" />
                        <div className="swap-on">✓</div>
                        <div className="swap-off"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Staking Operation */}
              {selectedOption === 'base' ? (
                <div className="bg-base-300/95 rounded-box p-8 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-primary">Basic APY Rewards</h3>
                    <p className="text-base-content/80">
                      This is the basic APY. For higher reward, please participate in HyperIndex LP activities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-base-300/95 rounded-box p-8 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="space-y-6">
                    {/* Staking Amount Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-lg">Staking Amount</span>
                        <span className="label-text-alt">Balance: {mockBalances.xaum} XAUM</span>
                      </label>
                      <div className="join w-full">
                        <input 
                          type="number" 
                          placeholder="Enter amount" 
                          className="input input-bordered join-item w-full"
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                        />
                        <button 
                          className="btn join-item bg-primary hover:bg-primary/80 text-black border-none transition-all duration-300"
                          onClick={handleMaxClick}
                        >
                          MAX
                        </button>
                      </div>
                      {Number(mockBalances.xaum) === 0 && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            Please return to step 1 to buy XAUM first
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Transaction Overview */}
                    <div className="card bg-base-200/50 p-4 border border-primary/10">
                      <h3 className="text-lg font-bold mb-4 text-primary">Transaction Overview</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Selected Option</span>
                          <span className="font-bold">{stakingOptions[selectedOption].name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount</span>
                          <span className="font-bold">
                            {stakingAmount || '0'} XAUM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>APY</span>
                          <span className="font-bold text-primary">
                            {stakingOptions[selectedOption].apy}%
                          </span>
                        </div>
                        {/* 根据不同选项显示特定信息 */}
                        {selectedOption === 'hyperindex' && (
                          <div className="flex justify-between">
                            <span>Platform</span>
                            <span className="font-bold">HyperIndex DEX</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      className="btn bg-primary hover:bg-primary/80 text-black border-none w-full mt-auto transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={!stakingAmount || Number(stakingAmount) === 0}
                    >
                      Supply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
