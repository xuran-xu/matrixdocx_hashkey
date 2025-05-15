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

  type StakingOptionKey = 'base' | 'hyperindex' | 'dodo' | 'lending';
  
  // 添加 Staking 相关状态
  const [selectedOption, setSelectedOption] = useState<StakingOptionKey>('base');
  const [stakingAmount, setStakingAmount] = useState<string>('');
  
  // Staking 选项配置
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
    },
    dodo: {
      name: 'DODO LP',
      apy: '5',
      description: 'Provide liquidity to XAUM/YYY pool'
    },
    lending: {
      name: 'Lending Pool',
      apy: '5',
      description: 'Earn interest by lending your XAUM'
    }
  };

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
            {/* Connection line between step numbers - 使用固定颜色，精确控制高度 */}
            <div className="absolute left-5 top-[60px] w-[2px] h-[calc(100%+40px)] bg-gold opacity-50"></div>
            
            <div className="mb-16"> {/* 减小底部间距 */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <Image
                  src="/number-1.png"
                  alt="Step 1"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h2 className="text-3xl font-bold text-gold">
                  Start Buying XAUM
                </h2>
              </div>

              {/* Exchange Form Card */}
              <div className="bg-base-300 rounded-box p-8 max-w-2xl mx-auto shadow-lg border border-primary/20">
                {!isWalletConnected ? (
                  <div className="text-center py-8">
                    <p className="text-lg mb-4">Please connect your wallet to continue</p>
                    <button 
                      className="btn btn-primary hover:bg-primary/90 transition-all duration-300"
                      onClick={() => setIsWalletConnected(true)}
                    >
                      Connect Wallet
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Exchange Form */}
                    <div className="space-y-6">
                      {/* Input HSK */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-base-content">Input HSK Amount</span>
                          <span className="label-text-alt">Balance: {mockBalances.hsk} HSK</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            placeholder="0.00"
                            className="input input-bordered w-full bg-base-200 focus:border-primary"
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                          />
                          <button className="btn btn-outline">MAX</button>
                        </div>
                      </div>

                      {/* Exchange Rate */}
                      <div className="flex justify-center items-center text-base-content">
                        <i className="fas fa-arrow-down text-2xl"></i>
                      </div>

                      {/* Output XAUM */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-base-content">Estimated XAUM</span>
                          <span className="label-text-alt">Balance: {mockBalances.xaum} XAUM</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={estimatedXAUM}
                          disabled
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-4 pt-4">
                        <button className="btn btn-primary w-full hover:brightness-110 transition-all">
                          Approve HSK
                        </button>
                        <button className="btn btn-accent w-full">
                          Buy XAUM
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Staking Options Section */}
          <div className="relative pt-10">
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <Image
                src="/circle-2.png"
                alt="Step 2"
                width={40}
                height={40}
                className="object-contain"
              />
              <h2 className="text-3xl font-bold text-gold">
                Choose Your Staking Option
              </h2>
            </div>

            {/* Main staking container with left-right split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Staking Options */}
              <div className="space-y-4">
                {/* Base Option */}
                <div 
                  className={`bg-base-300 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'base' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer`}
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

                {/* HyperIndex Option */}
                <div 
                  className={`bg-base-300 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'hyperindex' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer`}
                  onClick={() => setSelectedOption('hyperindex')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">HyperIndex LP</h3>
                      <p className="text-base-content/70">Provide liquidity to XAUM/HSK pool</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">5% APY</div>
                      <label className="swap">
                        <input type="radio" name="staking-option" value="hyperindex" />
                        <div className="swap-on">✓</div>
                        <div className="swap-off"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* DODO Option */}
                <div 
                  className={`bg-base-300 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'dodo' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer`}
                  onClick={() => setSelectedOption('dodo')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">DODO LP</h3>
                      <p className="text-base-content/70">Provide liquidity to XAUM/YYY pool</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">5% APY</div>
                      <label className="swap">
                        <input type="radio" name="staking-option" value="dodo" />
                        <div className="swap-on">✓</div>
                        <div className="swap-off"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Lending Option */}
                <div 
                  className={`bg-base-300 rounded-lg p-6 border-2 hover:bg-base-200 transition-colors ${
                    selectedOption === 'lending' ? 'border-primary shadow-lg' : 'border-transparent'
                  } cursor-pointer`}
                  onClick={() => setSelectedOption('lending')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Lending Pool</h3>
                      <p className="text-base-content/70">Earn interest by lending your XAUM</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">5% APY</div>
                      <label className="swap">
                        <input type="radio" name="staking-option" value="lending" />
                        <div className="swap-on">✓</div>
                        <div className="swap-off"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Staking Operation */}
              {selectedOption !== 'base' && (
                <div className="bg-base-300 rounded-box p-8 shadow-lg border border-primary/20">
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
                          className="btn join-item btn-primary"
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
                    <div className="card bg-base-200 p-4">
                      <h3 className="text-lg font-bold mb-4">Transaction Overview</h3>
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
                          <span className="font-bold text-accent">
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
                        {selectedOption === 'dodo' && (
                          <div className="flex justify-between">
                            <span>Platform</span>
                            <span className="font-bold">DODO DEX</span>
                          </div>
                        )}
                        {selectedOption === 'lending' && (
                          <div className="flex justify-between">
                            <span>Lock Period</span>
                            <span className="font-bold">Flexible</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      className="btn btn-primary w-full font-medium hover:brightness-110 transition-all"
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
