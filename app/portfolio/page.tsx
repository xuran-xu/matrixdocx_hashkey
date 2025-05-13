'use client';

import React from 'react';
import MainLayout from '../main-layout';
import Link from 'next/link';

export default function PortfolioPage() {
  // Mock staking positions
  const stakingPositions = [
    {
      id: 1,
      amount: "1,000 HSK",
      type: "30 Day Lock",
      startDate: "2023-10-15",
      endDate: "2023-11-14",
      rewards: "6.52 HSK",
      apr: "8.00%",
      status: "Active"
    },
    {
      id: 2,
      amount: "2,500 HSK",
      type: "90 Day Lock",
      startDate: "2023-09-01",
      endDate: "2023-11-30",
      rewards: "52.08 HSK",
      apr: "10.00%",
      status: "Active"
    },
    {
      id: 3,
      amount: "500 HSK",
      type: "180 Day Lock",
      startDate: "2023-07-10",
      endDate: "2024-01-06",
      rewards: "30.00 HSK",
      apr: "12.00%",
      status: "Active"
    }
  ];

  // Mock user statistics
  const userStats = {
    totalStaked: "4,000 HSK",
    totalRewards: "88.60 HSK",
    averageApr: "9.85%",
    activePositions: 3
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track and manage your staking positions and rewards
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Staked</h3>
            <div className="text-3xl font-bold text-white">{userStats.totalStaked}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Rewards</h3>
            <div className="text-3xl font-bold text-green-400">{userStats.totalRewards}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Average APR</h3>
            <div className="text-3xl font-bold text-blue-400">{userStats.averageApr}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Active Positions</h3>
            <div className="text-3xl font-bold text-white">{userStats.activePositions}</div>
          </div>
        </div>

        {/* Active Staking Positions */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden shadow-lg mb-12">
          <div className="p-5 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Active Staking Positions</h2>
            <Link href="/stake" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              + New Stake
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Amount</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Type</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Start Date</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">End Date</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Rewards</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">APR</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stakingPositions.length > 0 ? (
                  stakingPositions.map((position) => (
                    <tr key={position.id} className="border-t border-slate-700 hover:bg-slate-800/70">
                      <td className="py-3 px-4 text-white font-medium">{position.amount}</td>
                      <td className="py-3 px-4 text-white">{position.type}</td>
                      <td className="py-3 px-4 text-gray-300">{position.startDate}</td>
                      <td className="py-3 px-4 text-gray-300">{position.endDate}</td>
                      <td className="py-3 px-4 text-green-400 font-medium">{position.rewards}</td>
                      <td className="py-3 px-4 text-blue-400">{position.apr}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400">
                          {position.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium" disabled>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-slate-700">
                    <td colSpan={8} className="py-6 px-4 text-center text-gray-400">
                      You don't have any active staking positions yet.
                      <div className="mt-4">
                        <Link href="/stake" className="btn-hashkey mx-auto">
                          Start Staking
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rewards History Chart */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 shadow-lg mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Rewards History</h2>
          <div className="h-64 flex items-center justify-center border border-slate-700 rounded p-4">
            <p className="text-gray-400">Rewards chart visualization will be displayed here</p>
          </div>
        </div>

        {/* Completed Stakes */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
          <div className="p-5 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Completed Stakes</h2>
          </div>
          
          <div className="p-10 text-center text-gray-400">
            <p>No completed staking positions found.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}