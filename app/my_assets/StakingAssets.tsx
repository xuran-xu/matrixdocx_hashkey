"use client";

import Image from 'next/image';
import WalletBalance from './WalletBalance';
import { StakingProject, TotalEarnings } from './types';
import { useState } from 'react';
import { formatDistance } from 'date-fns';

const mockData: StakingProject[] = [
  {
    id: '1',
    name: 'HyperIndex',
    logo: '/hyperindex.jpg',
    apy: 5,
    stakedAmount: 100,
    status: 'active',
    holdingTime: 2592000,
    currentReward: 0.41,
    nextClaimTime: new Date(Date.now() + 86400000),
    totalReward: 1.23
  },
];

const totalEarnings: TotalEarnings = {
  totalStaked: 250,
  holdingPeriod: '30 days',
  currentReward: 0.41,
  rewardRate: '5%',
  nextClaimTime: new Date(Date.now() + 86400000),
  totalReward: 2.5,
  activeProjects: 2,
  projectNames: ['HyperIndex']
};

export default function StakingAssets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sora">
      <WalletBalance />

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <>
          <div className="bg-base-300/95 rounded-box px-0 py-8">
            <h2 className="text-3xl font-bold text-base-content mb-8 px-8">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
              {/* Block 1: XAUM */}
              <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <p className="text-base text-base-content/60">Total Staked</p>
                <p className="text-2xl font-bold text-primary">{totalEarnings.totalStaked} XAUM</p>
              </div>

              {/* Block 2: Time Info */}
              <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="mb-2">
                  <p className="text-base text-base-content/60">Holding Period</p>
                  <p className="text-xl font-bold text-primary">{totalEarnings.holdingPeriod}</p>
                </div>
                <div>
                  <p className="text-base text-base-content/60">Next Claim</p>
                  <p className="text-xl font-bold text-primary">{formatDistance(totalEarnings.nextClaimTime, new Date())}</p>
                </div>
              </div>

              {/* Block 3: Reward Info */}
              <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="mb-2">
                  <p className="text-base text-base-content/60">Current Reward</p>
                  <p className="text-xl font-bold text-primary">{totalEarnings.currentReward} XAUM</p>
                </div>
                <div>
                  <p className="text-base text-base-content/60">Reward Rate</p>
                  <p className="text-xl font-bold text-primary">{totalEarnings.rewardRate}</p>
                </div>
              </div>

              {/* Block 4: Project Info */}
              <div className="p-6 rounded-box border border-primary/30 bg-gradient-to-br from-base-300/95 to-base-200/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="mb-2">
                  <p className="text-base text-base-content/60">Total Reward</p>
                  <p className="text-2xl font-bold text-primary">{totalEarnings.totalReward} XAUM</p>
                </div>
                <div>
                  <p className="text-base text-base-content/60">Active Projects ({totalEarnings.activeProjects})</p>
                  <p className="text-base truncate text-primary">{totalEarnings.projectNames.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">My Projects</h2>
            <span className="text-base text-base-content/60">
              Total {mockData.length} projects
            </span>
          </div>

          <div className="space-y-4">
            {mockData.map((project) => (
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
                  <div className="p-4 rounded-lg bg-base-200/50 border border-primary/10">
                    <p className="text-base text-base-content/60">Holding Time</p>
                    <p className="text-xl font-bold text-primary">
                      {formatDistance(Date.now() - project.holdingTime * 1000, Date.now())}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-base-200/50 border border-primary/10">
                    <p className="text-base text-base-content/60">Current Reward</p>
                    <p className="text-xl font-bold text-primary">{project.currentReward} XAUM</p>
                  </div>
                  <div className="p-4 rounded-lg bg-base-200/50 border border-primary/10">
                    <p className="text-base text-base-content/60">Next Claim</p>
                    <p className="text-xl font-bold text-primary">
                      {formatDistance(project.nextClaimTime, Date.now())}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-base-200/50 border border-primary/10">
                    <p className="text-base text-base-content/60">Total Reward</p>
                    <p className="text-xl font-bold text-primary">{project.totalReward} XAUM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="btn bg-primary hover:bg-primary/80 text-black border-none transition-all duration-300 shadow-lg hover:shadow-xl">
                    Claim Reward
                  </button>
                  <button className="btn bg-base-100 hover:bg-base-200 border-primary/20 transition-all duration-300">
                    Unstake
                  </button>
                  <button className="btn bg-base-100 hover:bg-base-200 border-primary/20 transition-all duration-300">
                    Add Stake
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
