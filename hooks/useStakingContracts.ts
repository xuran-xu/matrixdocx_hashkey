'use client';

import { useAccount, useWriteContract, useChainId, usePublicClient } from 'wagmi';
import { getContractAddresses } from '@/config/contracts';
import { StakeType, StakingStats } from '@/types/contracts';
import { parseEther } from '@/utils/format';
import { HashKeyChainStakingABI } from '@/constants/abi';
import { useState, useEffect } from 'react';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { config } from '@/app/providers';
import { PublicClient } from 'viem';

export const stakeTypeMap = {
  "30days": 0,  // FIXED_30_DAYS
  "90days": 1,  // FIXED_90_DAYS
  "180days": 2, // FIXED_180_DAYS
  "365days": 3  // FIXED_365_DAYS
};

// 获取质押合约的基本信息
export function useStakingInfo(simulatedAmount: string = '1000') {
  const chainId = useChainId();
  const contractAddress = getContractAddresses(chainId).stakingContract;
  const simulatedAmountWei = parseEther(simulatedAmount || '0');
  const publicClient = usePublicClient();
  
  const [data, setData] = useState<{
    totalStaked: bigint;
    stakingStats: StakingStats | null;
    exchangeRate: bigint;
    minStakeAmount: bigint;
    isLoading: boolean;
  }>({
    totalStaked: BigInt(0),
    stakingStats: null,
    exchangeRate: BigInt(0),
    minStakeAmount: BigInt(0),
    isLoading: true,
  });
  
  useEffect(() => {
    const fetchStakingInfo = async () => {
      if (!publicClient || !contractAddress) return;
      
      setData(prev => ({ ...prev, isLoading: true }));
      
      try {
        console.log('Fetching staking info with amount:', simulatedAmountWei.toString());
        
        // 获取总质押量
        const totalValueLocked = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'totalValueLocked',
        });
        
        // 获取质押统计信息，传入模拟金额
        const detailedStakingStats = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'getDetailedStakingStats',
          args: [simulatedAmountWei], // 使用模拟金额作为参数
        });
        
        // 获取当前兑换率
        const currentExchangeRate = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'getCurrentExchangeRate',
        });
        
        // 获取最小质押金额
        const minStakeAmount = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'minStakeAmount',
        });
        
        setData({
          totalStaked: totalValueLocked as bigint,
          stakingStats: detailedStakingStats as StakingStats,
          exchangeRate: currentExchangeRate as bigint,
          minStakeAmount: minStakeAmount as bigint,
          isLoading: false,
        });
        
        console.log('Staking info fetched successfully:', {
          totalValueLocked,
          detailedStakingStats,
          currentExchangeRate,
          minStakeAmount
        });
      } catch (error) {
        console.error('Failed to fetch staking info:', error);
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchStakingInfo();
  }, [publicClient, contractAddress, simulatedAmountWei]);
  
  return data;
}

export function useStakeLocked() {
  const chainId = useChainId();
  const contractAddress = getContractAddresses(chainId).stakingContract;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const stakeLocked = async (amount: string, stakeType: StakeType) => {
    try {
      setIsPending(true);
      setError(null);
      
      const amountWei = parseEther(amount);
      console.log('Staking locked amount:', amount);
      // 发送交易
      const tx = await writeContract(config, {
        address: contractAddress,
        abi: HashKeyChainStakingABI,
        functionName: 'stakeLocked',
        args: [stakeType],
        value: amountWei,
      });      
      // 等待交易确认
      setIsConfirming(true);
      const receipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });
      
      console.log('Transaction confirmed:', receipt);
      
      // 如果没有抛出错误且交易成功，返回 true
      return receipt.status === 'success';
    } catch (submitError) {
      console.error('Staking failed:', submitError);
      if (submitError instanceof Error) {
        setError(submitError);
      } else {
        setError(new Error('Staking failed'));
      }
      throw submitError;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  };
  
  return { 
    stakeLocked, 
    isPending,
    isConfirming, // 新增状态跟踪交易确认过程
    error
  };
}
