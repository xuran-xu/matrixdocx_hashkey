'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from './main-layout';
import StatsCard from '@/components/StatsCard';
import { StakeType } from '@/types/contracts';
import { formatBigInt } from '@/utils/format';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useStakeLocked, useStakingInfo } from '@/hooks/useStakingContracts';
import { useRouter } from 'next/navigation';
import { StakingOptionCard } from '@/components/StakingOptionCard';

export default function Home() {
  const [simulatedAmount, setSimulatedAmount] = useState('1000');
  const [debouncedAmount, setDebouncedAmount] = useState(simulatedAmount);
  const { address, isConnected } = useAccount();
  const { totalStaked, stakingStats, exchangeRate, minStakeAmount, isLoading } = useStakingInfo(debouncedAmount);
  const { stakeLocked, isPending } = useStakeLocked();
  const router = useRouter();
  
  // 添加防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(simulatedAmount);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [simulatedAmount]);
  
  // 处理质押选项卡片点击
  const handleStakeClick = async (type: StakeType) => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    
    try {
      await stakeLocked(simulatedAmount, type);
      alert('质押请求已提交');
    } catch (error) {
      console.error('质押失败:', error);
      alert('质押失败，请查看控制台了解详情');
    }
  };
  
  // 从合约数据中提取APR和奖励信息
  const stakingOptions = React.useMemo(() => {
    // 默认选项，当合约数据不可用时显示
    const defaultOptions = [
      {
        title: '30天锁定',
        duration: 30,
        apr: 1.20,
        bonus: 0,
        maxApr: 1.20,
        penalty: 500, // 5.00%
        stakeType: StakeType.FIXED_30_DAYS
      },
      {
        title: '90天锁定',
        duration: 90,
        apr: 3.50,
        bonus: 0.80,
        maxApr: 3.50,
        penalty: 1000, // 10.00%
        stakeType: StakeType.FIXED_90_DAYS
      },
      {
        title: '180天锁定',
        duration: 180,
        apr: 6.50,
        bonus: 2.00,
        maxApr: 6.50,
        penalty: 1500, // 15.00%
        stakeType: StakeType.FIXED_180_DAYS
      },
      {
        title: '365天锁定',
        duration: 365,
        apr: 12.00,
        bonus: 4.00,
        maxApr: 12.00,
        penalty: 2000, // 20.00%
        stakeType: StakeType.FIXED_365_DAYS
      },
    ];

    // 如果没有合约数据，返回默认选项
    if (!stakingStats || !stakingStats.currentAPRs || !stakingStats.maxPossibleAPRs) {
      console.log('使用默认质押选项');
      return defaultOptions;
    }
    
    try {
      console.log('使用合约数据计算质押选项:', stakingStats);
      
      // 提取数据并计算
      return [
        {
          title: '30天锁定',
          duration: 30,
          apr: Number(stakingStats.currentAPRs[0] || BigInt(0)) / 100,
          bonus: stakingStats.baseBonus ? Number(stakingStats.baseBonus[0] || BigInt(0)) / 100 : 0,
          maxApr: Number(stakingStats.maxPossibleAPRs[0] || BigInt(0)) / 100,
          penalty: 500, // 5.00%
          stakeType: StakeType.FIXED_30_DAYS
        },
        {
          title: '90天锁定',
          duration: 90,
          apr: Number(stakingStats.currentAPRs[1] || BigInt(0)) / 100,
          bonus: stakingStats.baseBonus ? Number(stakingStats.baseBonus[1] || BigInt(0)) / 100 : 0,
          maxApr: Number(stakingStats.maxPossibleAPRs[1] || BigInt(0)) / 100,
          penalty: 1000, // 10.00%
          stakeType: StakeType.FIXED_90_DAYS
        },
        {
          title: '180天锁定',
          duration: 180,
          apr: Number(stakingStats.currentAPRs[2] || BigInt(0)) / 100,
          bonus: stakingStats.baseBonus ? Number(stakingStats.baseBonus[2] || BigInt(0)) / 100 : 0,
          maxApr: Number(stakingStats.maxPossibleAPRs[2] || BigInt(0)) / 100,
          penalty: 1500, // 15.00%
          stakeType: StakeType.FIXED_180_DAYS
        },
        {
          title: '365天锁定',
          duration: 365,
          apr: Number(stakingStats.currentAPRs[3] || BigInt(0)) / 100,
          bonus: stakingStats.baseBonus ? Number(stakingStats.baseBonus[3] || BigInt(0)) / 100 : 0,
          maxApr: Number(stakingStats.maxPossibleAPRs[3] || BigInt(0)) / 100,
          penalty: 2000, // 20.00%
          stakeType: StakeType.FIXED_365_DAYS
        },
      ];
    } catch (error) {
      console.error('Error processing staking stats:', error);
      return defaultOptions; // 出错时返回默认选项
    }
  }, [stakingStats]);
  
  // 处理模拟金额输入变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setSimulatedAmount(value);
    }
  };
  
  return (
    <MainLayout>
      <div className="min-h-screen w-full bg-gradient-to-b from-base-200 to-base-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-primary mb-3">HashKey Chain 质押</h1>
            <p className="text-base text-neutral-600">安全高效地质押您的HSK代币，获取被动收益</p>
            
            {!isConnected && (
              <div className="mt-6">
                <p className="text-sm text-neutral-500 mb-4">连接您的钱包开始质押</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 总质押量卡片 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80 transition-all hover:shadow-[0_4px_20px_-4px_rgba(16,24,40,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z M12 12v-2 M12 14h.01" />
                </svg>
                <h3 className="text-sm font-medium text-primary/80">总质押量</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight text-neutral-800">
                  {typeof totalStaked === 'bigint' ? formatBigInt(totalStaked) : '0'}
                </span>
                <span className="text-lg font-light text-neutral-600">HSK</span>
              </div>
            </div>

            {/* 当前兑换率卡片 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80 transition-all hover:shadow-[0_4px_20px_-4px_rgba(16,24,40,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h12M3 12h8m-8 5h16" />
                </svg>
                <h3 className="text-sm font-medium text-primary/80">当前兑换率</h3>
                <div className="tooltip tooltip-right" data-tip="随着奖励累积，兑换率会增加">
                  <svg className="w-4 h-4 text-primary/40 hover:text-primary/60 transition-colors cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight text-neutral-800">1</span>
                <span className="text-lg font-light text-neutral-600">stHSK</span>
                <span className="text-neutral-400">=</span>
                <span className="text-3xl font-light tracking-tight text-neutral-800">
                  {typeof exchangeRate === 'bigint' ? formatBigInt(exchangeRate) : '1'}
                </span>
                <span className="text-lg font-light text-neutral-600">HSK</span>
              </div>
            </div>

            {/* 区块奖励卡片 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80 transition-all hover:shadow-[0_4px_20px_-4px_rgba(16,24,40,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-sm font-medium text-primary/80">奖励间隔</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight text-neutral-800">1 区块</span>
              </div>
            </div>
          </div>
          
          {/* 前往质押按钮 */}
          <div className="text-center mb-16">
            <Link 
              href="/stake" 
              className="inline-flex items-center px-8 py-3 rounded-xl bg-primary/90 text-white hover:bg-primary transition-colors text-sm font-medium shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:shadow-[0_1px_2px_rgba(16,24,40,0.1)]"
            >
              前往质押页面
              <svg className="w-4 h-4 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* 模拟质押金额输入 */}
          {/* <div className="mb-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-3 text-center text-primary/80">模拟质押金额</h2>
            <div className="relative">
              <input
                type="text"
                value={simulatedAmount}
                onChange={handleAmountChange}
                className="input input-bordered w-full text-center text-primary/80"
                placeholder="输入HSK数量"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              )}
            </div>
          </div> */}
          
          {/* 质押选项卡片 */}
          <h2 className="text-2xl font-semibold mb-6 text-center text-primary/80">质押选项</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stakingOptions.map((option, index) => (
              <StakingOptionCard
                key={index}
                title={option.title}
                duration={`${option.duration} 天`}
                apr={`${option.apr.toFixed(2)}%`}
                bonus={option.bonus > 0 ? `+${option.bonus.toFixed(2)}%` : undefined}
                maxApr={`${option.maxApr.toFixed(2)}%`}
                penalty={`${(option.penalty / 100).toFixed(2)}%`}
                stakeType={option.stakeType}
                isDisabled={!isConnected}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}