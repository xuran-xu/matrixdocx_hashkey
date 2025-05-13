'use client';

import React from 'react';
import MainLayout from '../main-layout';
import Link from 'next/link';

export default function StakePage() {
  // Mock staking options
  const stakingOptions = [
    {
      id: 1,
      title: "30 Day Lock",
      duration: "30 days",
      apr: "8.00%",
      maxApr: "12.00%",
      minAmount: "100 HSK"
    },
    {
      id: 2,
      title: "90 Day Lock",
      duration: "90 days",
      apr: "10.00%",
      maxApr: "15.00%",
      minAmount: "100 HSK"
    },
    {
      id: 3,
      title: "180 Day Lock",
      duration: "180 days",
      apr: "12.00%",
      maxApr: "20.00%",
      minAmount: "100 HSK"
    },
    {
      id: 4,
      title: "365 Day Lock",
      duration: "365 days",
      apr: "15.00%",
      maxApr: "30.00%",
      minAmount: "100 HSK"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Stake Your HSK</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose a staking option that suits your needs and start earning rewards
          </p>
        </div>

        {/* Staking Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stakingOptions.map(option => (
            <div key={option.id} className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
              <div className="bg-slate-700/50 p-4 border-b border-slate-600">
                <h3 className="text-xl font-bold text-white text-center">{option.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white font-medium">{option.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current APR:</span>
                  <span className="text-blue-400 font-bold">{option.apr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max APR:</span>
                  <span className="text-green-400 font-bold">{option.maxApr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Amount:</span>
                  <span className="text-white">{option.minAmount}</span>
                </div>
                <button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Connect Wallet to Stake
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Staking Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Choose Lock Period</h3>
              <p className="text-gray-300">Select a staking period that matches your investment strategy</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold text-white mb-2">Stake HSK Tokens</h3>
              <p className="text-gray-300">Deposit your HSK tokens into the staking contract</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 h-16 w-16 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-300">Accumulate rewards automatically based on your staking period</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-700/30 p-4">
                <h3 className="text-lg font-bold text-white">What is the minimum staking amount?</h3>
              </div>
              <div className="p-4 bg-slate-800/30">
                <p className="text-gray-300">The minimum amount to stake is 100 HSK tokens.</p>
              </div>
            </div>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-700/30 p-4">
                <h3 className="text-lg font-bold text-white">Can I withdraw my staked tokens before the lock period ends?</h3>
              </div>
              <div className="p-4 bg-slate-800/30">
                <p className="text-gray-300">No, staked tokens are locked for the full duration of the selected period.</p>
              </div>
            </div>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-700/30 p-4">
                <h3 className="text-lg font-bold text-white">How are rewards calculated?</h3>
              </div>
              <div className="p-4 bg-slate-800/30">
                <p className="text-gray-300">Rewards are calculated based on your staking amount, the chosen lock period, and the current APR rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
