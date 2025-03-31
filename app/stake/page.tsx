'use client';

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../main-layout';
import { StakeType } from '@/types/contracts';
import { useAccount, useBalance } from 'wagmi';
import { useStakeLocked, useStakingInfo, useAllStakingAPRs } from '@/hooks/useStakingContracts';
import { useStakeFlexible } from '@/hooks/useFlexibleStaking';
import { toast } from 'react-toastify';
import { formatEther, parseEther } from 'viem';
import Link from 'next/link';

export default function StakePage() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });
  
  // 使用固定值进行APR计算，避免频繁调用合约
  const simulationAmount = '1000';
  
  // 从合约获取质押信息
  const { stakingStats, minStakeAmount, isLoading: statsLoading } = useStakingInfo(simulationAmount);
  
  // 从合约获取APR数据
  const { estimatedAPRs, maxAPRs, isLoading: aprsLoading } = useAllStakingAPRs(simulationAmount);
  
  const { 
    stakeLocked, 
    isPending,
    isConfirming,
  } = useStakeLocked();

  const { 
    stakeFlexible,
    isPending: isFlexiblePending,
    isConfirming: isFlexibleConfirming,
  } = useStakeFlexible();
  
  // State to track selected duration and transaction status
  const [selectedDays, setSelectedDays] = useState(30);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to track data source
  const [dataSource, setDataSource] = useState<'contract' | 'loading'>('loading');
  
  // 从URL参数中获取默认选择的质押类型
  useEffect(() => {
    // 获取URL参数
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    
    if (typeParam !== null) {
      // 将参数转换为数字
      const typeNumber = parseInt(typeParam, 10);
      
      // 根据质押类型设置对应的天数
      switch (typeNumber) {
        case StakeType.FIXED_30_DAYS:
          setSelectedDays(30);
          break;
        case StakeType.FIXED_90_DAYS:
          setSelectedDays(90);
          break;
        case StakeType.FIXED_180_DAYS:
          setSelectedDays(180);
          break;
        case StakeType.FIXED_365_DAYS:
          setSelectedDays(365);
          break;
        case StakeType.FLEXIBLE:
          setSelectedDays(0);
          break;
        default:
          // 默认选择30天
          setSelectedDays(30);
      }
      
      console.log('Selected stake type from URL:', typeNumber, 'days:', selectedDays);
    }
  }, []);
  
  // 更新数据源状态
  useEffect(() => {
    if (!statsLoading && !aprsLoading && stakingStats && estimatedAPRs && maxAPRs) {
      setDataSource('contract');
    } else {
      setDataSource('loading');
    }
  }, [statsLoading, aprsLoading, stakingStats, estimatedAPRs, maxAPRs]);
  
  // 从合约数据中提取质押选项
  const stakingOptions = useMemo(() => {
    if (aprsLoading || !estimatedAPRs || !maxAPRs) {
      console.log('APR data is still loading');
      return [];
    }
    
    try {
      console.log('Contract APR data available:', {
        estimatedAPRs: estimatedAPRs.map(apr => apr.toString()),
        maxAPRs: maxAPRs.map(apr => apr.toString())
      });
      
      // 计算格式化的APR值
      const apr30 = Number(estimatedAPRs[0] || BigInt(0)) / 100;
      const apr90 = Number(estimatedAPRs[1] || BigInt(0)) / 100;
      const apr180 = Number(estimatedAPRs[2] || BigInt(0)) / 100;
      const apr365 = Number(estimatedAPRs[3] || BigInt(0)) / 100;
      const aprFlexible = Number(estimatedAPRs[4] || BigInt(0)) / 100;

      const maxApr30 = Number(BigInt(360)) / 100;
      const maxApr90 = Number(BigInt(1000)) / 100;
      const maxApr180 = Number(BigInt(1800)) / 100;
      const maxApr365 = Number(BigInt(3400)) / 100;
      const maxAprFlexible = Number(BigInt(180)) / 100;
      // 硬编码的bonus值，按照图片中显示的数值
      const bonus30 = 0.00;  // 30天锁定期：+0.00%
      const bonus90 = 0.80;  // 90天锁定期：+0.80%
      const bonus180 = 2.00; // 180天锁定期：+2.00%
      const bonus365 = 4.00; // 365天锁定期：+4.00%
      
      console.log('Using hardcoded bonus values:', {
        '30 days': bonus30.toFixed(2) + '%',
        '90 days': bonus90.toFixed(2) + '%',
        '180 days': bonus180.toFixed(2) + '%',
        '365 days': bonus365.toFixed(2) + '%'
      });
      
      return [
        {
          title: 'Flexible',
          duration: 0,
          durationDisplay: 'Flexible',
          apr: aprFlexible,
          bonus: bonus30,
          maxApr: maxAprFlexible,
          stakeType: StakeType.FLEXIBLE
        },
        {
          title: '30 Day Lock',
          duration: 30,
          durationDisplay: '30 days',
          apr: apr30,
          bonus: bonus30,
          maxApr: maxApr30,
          stakeType: StakeType.FIXED_30_DAYS
        },
        {
          title: '90 Day Lock',
          duration: 90,
          durationDisplay: '90 days',
          apr: apr90,
          bonus: bonus90,
          maxApr: maxApr90,
          stakeType: StakeType.FIXED_90_DAYS
        },
        {
          title: '180 Day Lock',
          duration: 180,
          durationDisplay: '180 days',
          apr: apr180,
          bonus: bonus180,
          maxApr: maxApr180,
          stakeType: StakeType.FIXED_180_DAYS
        },
        {
          title: '365 Day Lock',
          duration: 365,
          durationDisplay: '365 days',
          apr: apr365,
          bonus: bonus365,
          maxApr: maxApr365,
          stakeType: StakeType.FIXED_365_DAYS
        }
      ];
    } catch (error) {
      console.error('Error processing APR data:', error);
      return []; // 出错时返回空数组
    }
  }, [estimatedAPRs, maxAPRs, aprsLoading]);
  
  // 获取最小质押金额（以HSK为单位）
  const minStakeAmountHSK = useMemo(() => {
    if (!minStakeAmount) return 100; // 默认值
    return Number(formatEther(minStakeAmount));
  }, [minStakeAmount]);
  
  // Helper function
  const getStakeTypeFromDays = (days: number): StakeType => {
    switch (days) {
      case 30:
        return StakeType.FIXED_30_DAYS;
      case 90:
        return StakeType.FIXED_90_DAYS;
      case 180:
        return StakeType.FIXED_180_DAYS;
      case 365:
        return StakeType.FIXED_365_DAYS;
      default:
        return StakeType.FLEXIBLE;
    }
  };
  
  // Handle staking operation
  const handleStake = async (amount: string, type: StakeType) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) < minStakeAmountHSK) {
      toast.error(`Minimum stake amount is ${minStakeAmountHSK} HSK`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      // 发送交易并等待确认
      const stakeTypeNumber = Number(type);
      console.log('Staking with parameters:', {
        amount,
        stakeType: stakeTypeNumber,
        typeOf: typeof stakeTypeNumber
      });
      let success = false;
      if (stakeTypeNumber === StakeType.FLEXIBLE) {
        // 如果是灵活质押，使用stake方法
        success = await stakeFlexible(amount);
      } else {
        // 如果是固定质押，使用stakeLocked方法  
        success = await stakeLocked(amount, stakeTypeNumber);
      }
      
      if (success) {
        toast.success('Staking transaction confirmed successfully');
        setStakeAmount('');
      }
    } catch (error) {
      console.error('Staking failed:', error);
      toast.error('Staking failed. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle max button click
  const handleMaxClick = () => {
    if (balanceData?.value && balanceData?.formatted) {
      try {
        // Reserve 2x average gas fee (approximately 0.001 ETH * 2)
        const gasReserve = parseEther('0.002');
        
        // Ensure we have enough balance to subtract gas reserve
        if (balanceData.value > gasReserve) {
          const maxAmount = balanceData.value - gasReserve;
          setStakeAmount(formatEther(maxAmount));
        } else {
          // If balance is too low, just set to 0
          setStakeAmount('0');
        }
      } catch (error) {
        console.error('Error calculating max amount:', error);
        // Fallback to setting full balance
        setStakeAmount(balanceData.formatted);
      }
    }
  };
  
  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-light text-white mb-8">Stake HSK</h1>
            
            {/* 添加数据源指示器 */}
            <div className="mb-4 text-sm">
              <span className="text-slate-400">
                Data Source: {' '}
                {dataSource === 'contract' ? (
                  <span className="text-green-500">Contract (Live Data)</span>
                ) : (
                  <span className="text-yellow-500">Loading...</span>
                )}
              </span>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-light text-white mb-6">Staking Amount</h2>
                
                {/* Amount input section */}
                <div className="mb-8">
                  <label className="block text-slate-300 mb-2">Enter staking amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow positive numbers
                        if (value === '' || Number(value) >= 0) {
                          setStakeAmount(value);
                        }
                      }}
                      min="0"
                      placeholder="Enter amount to stake"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600 transition-colors text-sm"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    Available: {balanceData?.formatted || '0'} {balanceData?.symbol || 'HSK'}
                  </div>
                </div>
                
                {/* 添加最小质押金额警告消息 */}
                {stakeAmount && Number(stakeAmount) < minStakeAmountHSK && (
                  <div className="mt-2 text-sm text-yellow-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Minimum stake amount is {minStakeAmountHSK} HSK
                    </div>
                  </div>
                )}
                
                {/* 添加选中方案的摘要信息 */}
                {selectedDays > 0 && stakingOptions.length > 0 && (
                  <div className="mt-4 mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-sm text-white">
                      <span className="text-cyan-400 font-medium">Selected Plan: </span>
                      <span className="text-white">{stakingOptions.find(opt => opt.duration === selectedDays)?.title || `${selectedDays} Day Lock`}</span>
                      <span className="mx-2 text-slate-500">|</span>
                      <span className="text-cyan-400 font-medium">Duration: </span>
                      <span className="text-white">{selectedDays} days</span>
                      <span className="mx-2 text-slate-500">|</span>
                      <span className="text-cyan-400 font-medium">APY: </span>
                      <span className="text-cyan-300 font-semibold">{stakingOptions.find(opt => opt.duration === selectedDays)?.apr.toFixed(2) || '0.00'}%</span>
                      {/* <span className="mx-2 text-slate-500">|</span>
                      <span className="text-cyan-400 font-medium">Lock Reward: </span>
                      {(stakingOptions.find(opt => opt.duration === selectedDays)?.bonus || 0) > 0 ? (
                        <span className="text-emerald-300 font-semibold">
                          {stakingOptions.find(opt => opt.duration === selectedDays)?.bonus.toFixed(2) || '0.00'}%
                        </span>
                      ) : (
                        <span className="text-slate-300">0.00%</span>
                      )} */}
                    </div>
                  </div>
                )}
                
                <h2 className="text-2xl font-light text-white mb-6">Select Lock Period</h2>
                
                {/* Lock period selection grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
                  {statsLoading || aprsLoading ? (
                    // Skeleton loading state
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className="p-6 rounded-lg border border-slate-700 bg-slate-800/30 animate-pulse">
                        <div className="h-6 bg-slate-700 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-slate-700 rounded mb-2 w-2/3"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    ))
                  ) : (
                    // Actual staking options
                    stakingOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDays(option.duration)}
                        className={`p-6 rounded-lg border ${
                          selectedDays === option.duration
                            ? 'border-primary bg-primary/20 ring-4 ring-primary/30 shadow-lg shadow-primary/10'
                            : 'border-slate-700 hover:border-primary/50 bg-slate-800/30'
                        } transition-all text-left relative`}
                        type="button"
                      >
                        {selectedDays === option.duration && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className={`text-xl ${selectedDays === option.duration ? 'text-cyan-300 font-bold' : 'text-white'} mb-2`}>
                          {option.title}
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <div className={`text-sm ${selectedDays === option.duration ? 'text-cyan-400 font-medium' : 'text-slate-400'}`}>Duration</div>
                          <div className={`text-base ${selectedDays === option.duration ? 'text-white font-semibold' : 'text-white'}`}>
                            {option.duration} days
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <div className={`text-sm ${selectedDays === option.duration ? 'text-cyan-400 font-medium' : 'text-slate-400'}`}>APY</div>
                          <div className={`text-xl font-bold ${selectedDays === option.duration ? 'text-cyan-300' : 'text-cyan-400'}`}>
                            {option.apr.toFixed(2)}%
                          </div>
                        </div>
                        {/* <div className="flex justify-between items-start">
                          <div className={`text-sm ${selectedDays === option.duration ? 'text-cyan-400 font-medium' : 'text-slate-400'}`}>Bonus</div>
                          {option.bonus > 0 ? (
                            <div className="text-right">
                              <div className={`text-xs ${selectedDays === option.duration ? 'text-emerald-200' : 'text-emerald-300'}`}>Lock Reward</div>
                              <div className={`text-lg ${selectedDays === option.duration ? 'text-emerald-300 font-semibold' : 'text-emerald-400'}`}>
                                {option.bonus.toFixed(2)}%
                              </div>
                            </div>
                          ) : (
                            <div className={`text-lg ${selectedDays === option.duration ? 'text-slate-300' : 'text-slate-500'}`}>0.00%</div>
                          )}
                        </div> */}
                        {option.maxApr > option.apr && (
                          <div className={`mt-2 text-xs font-medium ${selectedDays === option.duration ? 'text-emerald-300' : 'text-emerald-400'}`}>
                            Up to {option.maxApr.toFixed(2)}% APY
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
                
                {/* Submit button */}
                <button
                  onClick={() => handleStake(stakeAmount, getStakeTypeFromDays(selectedDays))}
                  disabled={!isConnected || isSubmitting || isPending || !stakeAmount || Number(stakeAmount) < minStakeAmountHSK}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {isPending 
                    ? 'Awaiting wallet confirmation...' 
                    : isConfirming 
                      ? 'Confirming transaction...' 
                      : 'Confirm Staking'}
                </button>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8">
              <h3 className="font-medium text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Staking Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-slate-300">Stake HSK tokens to earn competitive annual returns</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-slate-300">Longer lock periods provide higher rewards</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-slate-300">Staking rewards automatically compound</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-300">Received stHSK represents your share in the staking pool</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">
                    <Link 
                      href="/disclaimer" 
                      className="text-white hover:text-primary transition-colors"
                    >
                      View Staking Disclaimer and Risk Warning
                    </Link>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
