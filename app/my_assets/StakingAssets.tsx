"use client";

import Image from 'next/image';
import { useAccount } from 'wagmi';
import WalletBalance from './WalletBalance';
import { StakingProject, TotalEarnings, StakeRecord } from './types';
import { useState, useEffect, useMemo } from 'react';
import { formatDistance, format } from 'date-fns';
import FlowingParticles from '@/components/FlowingParticles';
import { useXaumHoldingDays } from '@/hooks/useXaumHoldingDays';
import { useLpDailySnapshot } from '@/hooks/useLpDailySnapshot';
import { LpDailySnapshotItem } from '@/types/hyperIndex';

const mockData: StakingProject[] = [
  {
    id: '1',
    name: 'HyperIndex',
    logo: '/hyperindex.jpg',
    apy: 5,
    stakedAmount: 0,
    status: 'active',
    holdingTime: 0,
    currentReward: 0,
    nextClaimTime: new Date(Date.now() + 86400000),
    totalReward: 0
  },
];

const totalEarnings: TotalEarnings = {
  totalStaked: 250,
  holdingPeriod: '30 days',
  currentReward: 0,
  rewardRate: '5%',
  nextClaimTime: new Date(Date.now() + 86400000),
  totalReward: 0,
  projectNames: ['HyperIndex']
};

const mockRecords: StakeRecord[] = [
  {
    id: '1',
    projectName: 'HyperIndex',
    amount: 0.5,
    timestamp: new Date(Date.now() - 3600000),
    type: 'claim',
    status: 'completed'
  },
  {
    id: '2',
    projectName: 'HyperIndex',
    amount: 100,
    timestamp: new Date(Date.now() - 86400000),
    type: 'stake',
    status: 'completed'
  }
];

export default function StakingAssets() {
  const { address: walletAddress } = useAccount();

  // Define a mock pair address for HyperIndex. In a real app, this might come from project data.
  const HYPERINDEX_PAIR_ADDRESS = "0xF8365695ccC4FCa53241d7d42BbDc3b2e7d43AE4"; // Example address

  const { holdingDays, isLoading: isLoadingHoldingDays, error: errorHoldingDays } = useXaumHoldingDays();
  const { data: lpSnapshotData, isLoading: isLoadingLpSnapshot, error: errorLpSnapshot, refetch: refetchLpSnapshot } = useLpDailySnapshot(HYPERINDEX_PAIR_ADDRESS, walletAddress);

  const pageIsLoading = isLoadingHoldingDays || isLoadingLpSnapshot;
  const pageError = useMemo(() => {
    if (errorHoldingDays) return errorHoldingDays.message;
    if (errorLpSnapshot) return errorLpSnapshot.message;
    return null;
  }, [errorHoldingDays, errorLpSnapshot]);

  const latestLpSnapshot: LpDailySnapshotItem | null = useMemo(() => {
    if (lpSnapshotData && lpSnapshotData.length > 0) {
      // Assuming the API returns data sorted by date or we sort it here if necessary.
      // For now, taking the last item as the latest.
      return lpSnapshotData[lpSnapshotData.length - 1];
    }
    return null;
  }, [lpSnapshotData]);

  // Effect to refetch LP data if walletAddress changes
  useEffect(() => {
    if (walletAddress && HYPERINDEX_PAIR_ADDRESS) {
      // refetchLpSnapshot(); // useLpDailySnapshot already refetches on address change
    }
  }, [walletAddress, refetchLpSnapshot]);

  return (
    <div className="relative min-h-screen">
      <FlowingParticles />
      <div className="space-y-8 font-sora relative z-10">
        <WalletBalance />

        {pageIsLoading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <div className="bg-base-300/95 rounded-box p-8">
              <h2 className="text-2xl font-bold text-base-content mb-8">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Block 1: XAUM */}
                <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-base text-base-content/60">Total Value (USD)</p>
                  <p className="text-2xl font-bold text-primary">
                    {latestLpSnapshot ? parseFloat(latestLpSnapshot.valueUsd).toFixed(2) : '0.00'} USD
                  </p>
                </div>

                {/* Block 2: Time Info */}
                <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-2">
                    <p className="text-base text-base-content/60">Holding Period</p>
                    <p className="text-xl font-bold text-primary">
                      {holdingDays !== undefined ? `${holdingDays} days` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-base-content/60">Next Claim</p>
                    <p className="text-xl font-bold text-primary">
                      {/* This data is still from mock, as hooks don't provide it */}
                      {formatDistance(totalEarnings.nextClaimTime, new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Block 3: Reward Info */}
                <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-2">
                    <p className="text-base text-base-content/60">Current Reward</p>
                    <p className="text-xl font-bold text-primary">
                      {/* This data is still from mock */}
                      {totalEarnings.currentReward} XAUM
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-base-content/60">Reward Rate</p>
                    {/* This data is still from mock */}
                    <p className="text-xl font-bold text-primary">{totalEarnings.rewardRate}</p> 
                  </div>
                </div>

                {/* Block 4: Project Info */}
                <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-2">
                    <p className="text-base text-base-content/60">Total Reward</p>
                    <p className="text-2xl font-bold text-primary">
                      {/* This data is still from mock */}
                      {totalEarnings.totalReward} XAUM
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-base-content/60">Projects</p>
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/hyperindex.jpg" 
                        alt="HyperIndex" 
                        width={20} 
                        height={20} 
                        className="rounded-full"
                      />
                      <p className="text-base truncate text-primary">
                        {/* This data is still from mock */}
                        {totalEarnings.projectNames.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Projects Section */}
            <div className="bg-base-300/95 rounded-box p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-base-content">My Projects</h2>
                <span className="text-base text-base-content/60">
                  Total {mockData.length} projects
                </span>
              </div>
              
              <div className="space-y-4">
                {mockData.map((project) => ( // Assuming mockData might have more projects in future
                  <div key={project.id} className="bg-base-300/95 rounded-box p-8 border border-primary/20 hover:shadow-xl transition-all duration-300 backdrop-blur-sm staking-card-gradient">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Image src={project.logo} alt={project.name} width={40} height={40} className="rounded-full" />
                        <div>
                          <h3 className="text-xl font-bold text-primary">{project.name}</h3>
                          <span className={`text-base ${project.status === 'active' ? 'text-success' : 'text-warning'}`}>
                            {project.status === 'active' ? 'Active' : 'Ended'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base text-base-content/60">Current APY</p>
                        <p className="text-3xl font-bold text-primary">{project.apy}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-base-200/50 border border-primary/10">
                        <p className="text-base text-base-content/60">Holding Time</p>
                        <p className="text-xl font-bold text-primary">
                          {formatDistance(Date.now() - project.holdingTime * 1000, Date.now(), { addSuffix: false })}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-base-200/50 border border-primary/10">
                        <p className="text-base text-base-content/60">Current Reward</p>
                        <p className="text-xl font-bold text-primary">{project.currentReward} XAUM</p>
                      </div>
                      <div className="p-3 rounded-lg bg-base-200/50 border border-primary/10">
                        <p className="text-base text-base-content/60">Next Claim</p>
                        <p className="text-xl font-bold text-primary">
                          {formatDistance(project.nextClaimTime, Date.now(), { addSuffix: true })}
                        </p>
                      </div>
                      {project.name === 'HyperIndex' && latestLpSnapshot && (
                        <div className="p-3 rounded-lg bg-base-200/50 border border-primary/10">
                          <p className="text-base text-base-content/60">Value (USD)</p>
                          <p className="text-xl font-bold text-primary">
                            {parseFloat(latestLpSnapshot.valueUsd).toFixed(2)} USD
                          </p>
                        </div>
                      )}
                      {/* 
                        If project.name !== 'HyperIndex' or no snapshot, this block will be smaller.
                        To maintain grid structure, you might want a placeholder or adjust col-span.
                        For simplicity, this example adds it conditionally.
                      */}
                       <div className="p-3 rounded-lg bg-base-200/50 border border-primary/10">
                        <p className="text-base text-base-content/60">Total Reward</p>
                        <p className="text-xl font-bold text-primary">{project.totalReward} XAUM</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staking Records Section */}
            <div className="bg-base-300/95 rounded-box p-8">
              <h2 className="text-2xl font-bold text-base-content mb-8">Staking Records</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-base-content/60">
                      <th>Project</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-base-200/50">
                        <td className="font-medium">{record.projectName}</td>
                        <td className="capitalize">{record.type}</td>
                        <td>{record.amount} XAUM</td>
                        <td>{format(record.timestamp, 'MMM dd, yyyy HH:mm')}</td>
                        <td>
                          <span className={`badge ${
                            record.status === 'completed' ? 'badge-success' : 'badge-warning'
                          } badge-sm`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
