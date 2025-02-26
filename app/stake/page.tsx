'use client';

import React, { useState } from 'react';
import MainLayout from '../main-layout';
import { StakeType } from '@/types/contracts';
import { useAccount, useBalance } from 'wagmi';
import { useStakeLocked, useStakingInfo } from '@/hooks/useStakingContracts';
import { toast } from 'react-toastify';

export default function StakePage() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });
  const { stakingStats, } = useStakingInfo();
  const { 
    stakeLocked, 
    isPending,
  } = useStakeLocked();
  
  // 添加状态来跟踪选中的期限和交易状态
  const [selectedDays, setSelectedDays] = useState(30);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 从合约数据中提取APR和奖励信息
  const getStakingOptions = () => {
    if (!stakingStats) return [];
    
    // 确保stakingStats是数组形式并且有足够的元素
    if (!Array.isArray(stakingStats) || stakingStats.length < 5) {
      return [];
    }
    
    // 使用双重类型断言，先转为 unknown 再转为元组
    const stats = (stakingStats as unknown) as [bigint, bigint[], bigint[], bigint[], bigint[]];
    const currentAPRs = stats[2];
    const maxPossibleAPRs = stats[3];
    const baseBonus = stats[4];
    
    return [
      {
        title: '30天锁定',
        duration: 30,
        apr: Number(currentAPRs[0] || 0),
        bonus: Number(baseBonus[0] || 0),
        maxApr: Number(maxPossibleAPRs[0] || 0),
        penalty: 500, // 5%
        stakeType: StakeType.FIXED_30_DAYS,
      },
      {
        title: '90天锁定',
        duration: 90,
        apr: Number(currentAPRs[1] || 0),
        bonus: Number(baseBonus[1] || 0),
        maxApr: Number(maxPossibleAPRs[1] || 0),
        penalty: 1000, // 10%
        stakeType: StakeType.FIXED_90_DAYS,
      },
      {
        title: '180天锁定',
        duration: 180,
        apr: Number(currentAPRs[2] || 0),
        bonus: Number(baseBonus[2] || 0),
        maxApr: Number(maxPossibleAPRs[2] || 0),
        penalty: 1500, // 15%
        stakeType: StakeType.FIXED_180_DAYS,
      },
      {
        title: '365天锁定',
        duration: 365,
        apr: Number(currentAPRs[3] || 0),
        bonus: Number(baseBonus[3] || 0),
        maxApr: Number(maxPossibleAPRs[3] || 0),
        penalty: 2000, // 20%
        stakeType: StakeType.FIXED_365_DAYS,
      },
    ];
  };
  
  const stakingOptions = getStakingOptions();
  
  // 添加这个辅助函数
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
        return StakeType.FIXED_30_DAYS;
    }
  };
  
  // 处理质押操作
  const handleStake = async (amount: string, type: StakeType) => {
    if (!isConnected) {
      toast.error('请先连接钱包');
      return;
    }
    
    if (!amount || Number(amount) <= 0) {
      toast.error('请输入有效的质押金额');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 显示等待用户确认的通知
      const toastId = toast.loading('请在钱包中确认交易...');
      
      try {
        // 调用质押函数并等待交易确认
        await stakeLocked(amount, type);
        
        // 交易已确认成功
        toast.update(toastId, {
          render: '质押成功！',
          type: 'success',
          isLoading: false,
          autoClose: 5000
        });
        
        setStakeAmount(''); // 清空输入
      } catch (error) {
        console.error('质押失败:', error);
        
        // 显示错误通知
        toast.update(toastId, {
          render: '质押失败，请查看控制台了解详情',
          type: 'error',
          isLoading: false,
          autoClose: 5000
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="min-h-screen w-full bg-gradient-to-b from-base-200 to-base-100">
        <div className="w-full px-4 py-12">
          <div className="flex w-full">
            <div className="flex w-full justify-center lg:flex-row gap-8">
              {/* 左侧：质押表单 */}
              <div className="lg:w-2/5">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                  <h2 className="text-2xl font-light text-primary mb-6">质押 HSK</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-primary/80 text-sm mb-1 block">质押金额</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="w-full px-4 py-3 text-primary/80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="输入质押金额"
                          disabled={isSubmitting || isPending}
                        />
                        <button
                          onClick={() => balanceData && setStakeAmount(balanceData.formatted)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary-dark"
                          type="button"
                        >
                          最大
                        </button>
                      </div>
                      {balanceData && (
                        <div className="text-xs text-gray-500 mt-1">
                          可用: {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                        </div>
                      )}
                    </div>
                    
                    {/* 质押期限选项 */}
                    <div>
                      <label className="text-gray-600 text-sm mb-2 block">选择质押期限</label>
                      <div className="grid grid-cols-2 gap-3">
                        {stakingOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDays(option.duration)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedDays === option.duration
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                            type="button"
                          >
                            <div className="text-sm font-medium text-primary/80">{option.title}</div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-primary/80">期限</div>
                              <div className="text-sm font-medium text-primary/80">{option.duration}天</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-primary/80">APR</div>
                              <div className="text-sm font-medium text-primary">{(option.apr / 100).toFixed(2)}%</div>
                            </div>
                            {option.bonus > 0 && (
                              <div className="flex justify-between items-center mt-1">
                                <div className="text-xs text-primary/80">奖励</div>
                                <div className="text-xs text-green-600">+{(option.bonus / 100).toFixed(2)}%</div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* 提交按钮 */}
                    <button
                      onClick={() => handleStake(stakeAmount, getStakeTypeFromDays(selectedDays))}
                      disabled={!isConnected || isSubmitting || isPending || !stakeAmount}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg mt-4 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isPending ? '处理中...' : '确认质押'}
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
                  <h3 className="font-medium text-neutral-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    质押说明
                  </h3>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span className="text-neutral-800">质押HSK代币可获得不同期限的年化收益</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span className="text-neutral-800">锁定期越长，奖励越高</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-warning/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-neutral-800">提前解锁会受到惩罚</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-success/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-neutral-800">质押奖励会自动复利</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-info/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <span className="text-neutral-800">获得的stHSK代表您在质押池中的份额</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 右侧：质押选项 */}
              {/* <div className="lg:w-3/5">
                <h2 className="text-2xl font-light text-primary mb-6">选择质押期限</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stakingOptions.map((option, index) => (
                    <StakingOptionCard
                      key={index}
                      {...option}
                      onStake={(type) => handleStake('1000', type)}
                      stakeType={option.stakeType}
                      isDisabled={!isConnected || isPending}
                    />
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}