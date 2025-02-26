'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '../main-layout';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { LockedStakeInfo } from '@/types/contracts';
import { formatBigInt } from '@/utils/format';
import { useUnstakeLocked, useUserStakingInfo, useLockedStakeInfo, batchGetStakingInfo } from '@/hooks/useStakingContracts';
import StakedPositionCard from '@/components/StakingPositionCard';
import { getContractAddresses } from '@/config/contracts';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { lockedStakeCount, activeLockedStakes, isLoading: loadingInfo } = useUserStakingInfo();
  const { unstakeLocked } = useUnstakeLocked();
  const [stakedPositions, setStakedPositions] = useState<Array<{ id: number, info: LockedStakeInfo }>>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [selectedStakeId, setSelectedStakeId] = useState<number | null>(null);
  // const stakeInfo = useLockedStakeInfo(selectedStakeId);
  const chainId = useChainId();
  const contractAddress = getContractAddresses(chainId).stakingContract;
  const publicClient = usePublicClient();
  const [totalRewards, setTotalRewards] = useState<bigint>(BigInt(0));

  // 加载用户所有锁定质押
  useEffect(() => {
    const fetchStakedPositions = async () => {
      if (!isConnected || !address || !lockedStakeCount || !publicClient) return;
      
      setIsLoadingPositions(true);
      
      // 创建ID数组
      const stakeIds = Array.from({ length: Number(lockedStakeCount) }, (_, i) => i);
      
      // 批量获取所有质押信息
      const stakesInfo = await batchGetStakingInfo(contractAddress, publicClient, stakeIds, address);
      
      // 计算总收益
      const totalReward = stakesInfo
        .filter(info => !info.error && !info.isWithdrawn)
        .reduce((sum, info) => sum + info.reward, BigInt(0));
      
      setTotalRewards(totalReward);
      
      // 转换为所需格式
      const positions = stakesInfo
        .filter(info => !info.error && !info.isWithdrawn)
        .map(info => ({
          id: info.id,
          info: {
            sharesAmount: info.sharesAmount,
            hskAmount: info.hskAmount,
            currentHskValue: info.currentHskValue,
            lockEndTime: info.lockEndTime,
            isWithdrawn: info.isWithdrawn,
            isLocked: info.isLocked
          }
        }));
      
      setStakedPositions(positions);
      setIsLoadingPositions(false);
    };
    
    fetchStakedPositions();
  }, [address, isConnected, lockedStakeCount, publicClient, contractAddress]);

  // 处理解锁
  const handleUnstake = async (stakeId: number) => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    
    try {
      await unstakeLocked(stakeId);
      alert('解锁请求已提交');
      // 重新加载质押数据
    } catch (error) {
      console.error('解锁失败:', error);
      alert('解锁失败，请查看控制台了解详情');
    }
  };

  // const handleSelectStake = (id: number) => { setSelectedStakeId(id); };

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="container mx-auto text-center py-12">
          <h1 className="text-3xl font-bold mb-6">我的质押</h1>
          <p className="text-xl mb-8">请连接钱包查看您的质押信息</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen w-full bg-gradient-to-b from-base-200 to-base-100">
        <div className="w-full px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-light text-primary mb-8">我的质押</h1>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">活跃质押</h3>
                </div>
                <p className="text-2xl font-medium text-neutral-800">
                  {loadingInfo ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    Number(activeLockedStakes || 0)
                  )}
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">历史质押</h3>
                </div>
                <p className="text-2xl font-medium text-neutral-800">
                  {loadingInfo ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    Number(lockedStakeCount || 0) - Number(activeLockedStakes || 0)
                  )}
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">总收益</h3>
                </div>
                <p className="text-2xl font-medium text-green-600">
                  {isLoadingPositions ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    `+${formatBigInt(totalRewards)} HSK`
                  )}
                </p>
              </div>
            </div>

            {/* 活跃质押列表 */}
            <h2 className="text-2xl font-light text-primary mb-6">活跃质押</h2>
            
            {isLoadingPositions ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : stakedPositions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {stakedPositions.map((position) => (
                  <div key={position.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                    <StakedPositionCard
                      stakeId={position.id}
                      sharesAmount={position.info.sharesAmount}
                      hskAmount={position.info.hskAmount}
                      currentHskValue={position.info.currentHskValue}
                      lockEndTime={position.info.lockEndTime}
                      isWithdrawn={position.info.isWithdrawn}
                      isLocked={position.info.isLocked}
                      onUnstake={handleUnstake}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-12 text-center shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                <p className="text-lg text-neutral-600 mb-4">您尚未创建任何质押</p>
                <a 
                  href="/stake" 
                  className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  去质押
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}