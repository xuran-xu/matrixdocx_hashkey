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
    <div className="space-y-6">
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
          <div className="bg-base-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Block 1: XAUM */}
              <div className="p-4 bg-base-100 rounded-lg">
                <p className="text-sm text-base-content/60">Total Staked</p>
                <p className="text-xl font-bold">{totalEarnings.totalStaked} XAUM</p>
              </div>

              {/* Block 2: Time Info */}
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="mb-2">
                  <p className="text-sm text-base-content/60">Holding Period</p>
                  <p className="font-medium">{totalEarnings.holdingPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Next Claim</p>
                  <p className="font-medium">{formatDistance(totalEarnings.nextClaimTime, new Date())}</p>
                </div>
              </div>

              {/* Block 3: Reward Info */}
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="mb-2">
                  <p className="text-sm text-base-content/60">Current Reward</p>
                  <p className="font-medium text-success">{totalEarnings.currentReward} XAUM</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Reward Rate</p>
                  <p className="font-medium text-primary">{totalEarnings.rewardRate}</p>
                </div>
              </div>

              {/* Block 4: Project Info */}
              <div className="p-4 bg-base-100 rounded-lg">
                <div className="mb-2">
                  <p className="text-sm text-base-content/60">Total Reward</p>
                  <p className="text-xl font-bold text-success">{totalEarnings.totalReward} XAUM</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Active Projects ({totalEarnings.activeProjects})</p>
                  <p className="text-sm truncate">{totalEarnings.projectNames.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 添加项目列表标题 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Projects</h2>
            <span className="text-sm text-base-content/60">
              Total {mockData.length} projects
            </span>
          </div>

          <div className="space-y-4">
            {mockData.map((project) => (
              <div key={project.id} className="bg-base-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Image src={project.logo} alt={project.name} width={40} height={40} />
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <span className={`text-sm ${project.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {project.status === 'active' ? 'Active' : 'Ended'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-base-content/60">Current APY</p>
                    <p className="text-xl font-bold text-primary">{project.apy}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-base-content/60">Holding Time</p>
                    <p className="font-medium">
                      {formatDistance(Date.now() - project.holdingTime * 1000, Date.now())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Current Reward</p>
                    <p className="font-medium text-success">{project.currentReward} XAUM</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Next Claim</p>
                    <p className="font-medium">
                      {formatDistance(project.nextClaimTime, Date.now())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Total Reward</p>
                    <p className="font-medium text-success">{project.totalReward} XAUM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-primary">Claim Reward</button>
                  <button className="btn btn-outline">Unstake</button>
                  <button className="btn btn-ghost">Add Stake</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
