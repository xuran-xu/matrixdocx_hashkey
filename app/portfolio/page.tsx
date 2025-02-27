'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import MainLayout from '../main-layout';
import { useAccount, useChainId, usePublicClient, useBlockNumber } from 'wagmi';
import { LockedStakeInfo } from '@/types/contracts';
import { formatBigInt } from '@/utils/format';
import { useUnstakeLocked, useUserStakingInfo, batchGetStakingInfo } from '@/hooks/useStakingContracts';
import { getContractAddresses } from '@/config/contracts';
import { toast } from 'react-toastify';
import { HashKeyChainStakingABI } from '@/constants/abi';
import { StHSKABI } from '@/constants/abi';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { lockedStakeCount, activeLockedStakes, isLoading: loadingInfo } = useUserStakingInfo();
  const { unstakeLocked } = useUnstakeLocked();
  const [stakedPositions, setStakedPositions] = useState<Array<{ id: number, info: LockedStakeInfo, estimatedProfit?: bigint, pendingReward?: bigint }>>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [processingStakeId, setProcessingStakeId] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const chainId = useChainId();
  const contractAddress = getContractAddresses(chainId).stakingContract;
  const publicClient = usePublicClient();
  const [totalRewards, setTotalRewards] = useState<bigint>(BigInt(0));
  const [estimatedTotalRewards, setEstimatedTotalRewards] = useState<bigint>(BigInt(0));
  
  // Get the current block number (automatically updates)
  const { data: currentBlockNumber } = useBlockNumber({ watch: true });
  
  // Add refs to prevent infinite update loops
  const stakedPositionsRef = useRef(stakedPositions);
  useEffect(() => {
    stakedPositionsRef.current = stakedPositions;
  }, [stakedPositions]);
  
  const lastProcessedBlock = useRef<bigint | null>(null);
  
  // Track contract data for reward estimation
  const [rewardParams, setRewardParams] = useState({
    lastRewardBlock: BigInt(0),
    hskPerBlock: BigInt(0),
    totalPooledHSK: BigInt(0),
    totalShares: BigInt(0),
    exchangeRate: BigInt(0)
  });
  
  // Fetch contract reward parameters
  const fetchRewardParams = useCallback(async () => {
    if (!publicClient || !contractAddress) return;
    
    try {
      // Get stHSK contract address
      const stHSKAddress = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: HashKeyChainStakingABI,
        functionName: 'stHSK',
      }) as `0x${string}`;
      
      // Fetch all required parameters in parallel
      const [lastRewardBlock, hskPerBlock, totalPooledHSK, totalShares, exchangeRate] = await Promise.all([
        publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'lastRewardBlock',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'hskPerBlock',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'totalPooledHSK',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: stHSKAddress,
          abi: StHSKABI,
          functionName: 'totalSupply',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: HashKeyChainStakingABI,
          functionName: 'getCurrentExchangeRate',
        }) as Promise<bigint>
      ]) as [bigint, bigint, bigint, bigint, bigint];
      
      setRewardParams({
        lastRewardBlock: lastRewardBlock,
        hskPerBlock: hskPerBlock,
        totalPooledHSK: totalPooledHSK,
        totalShares: totalShares,
        exchangeRate: exchangeRate
      });
      
      console.log('Reward params updated:', {
        lastRewardBlock: lastRewardBlock.toString(),
        hskPerBlock: hskPerBlock.toString(),
        totalPooledHSK: totalPooledHSK.toString(),
        totalShares: totalShares.toString(),
        exchangeRate: exchangeRate.toString()
      });
    } catch (error) {
      console.error('Failed to fetch reward parameters:', error);
    }
  }, [publicClient, contractAddress]);
  
  const calculateEstimatedRewards = useCallback(() => {
    if (!currentBlockNumber || !stakedPositionsRef.current.length || 
        rewardParams.totalShares === BigInt(0)) {
      return;
    }
    
    // Don't process the same block multiple times
    if (lastProcessedBlock.current === currentBlockNumber) {
      return;
    }
    
    setIsEstimating(true);
    lastProcessedBlock.current = currentBlockNumber;
    
    try {
      // Calculate blocks since the last reward update
      const blockDiff = BigInt(currentBlockNumber) - rewardParams.lastRewardBlock;
      
      if (blockDiff <= BigInt(0)) {
        setIsEstimating(false);
        return;
      }
      
      console.log(`Estimating rewards for ${blockDiff} blocks since last update`);
      
      // Constants definition
      const SECONDS_PER_BLOCK = BigInt(2);  // Average seconds per block (2 sec)
      const SECONDS_PER_YEAR = BigInt(365 * 24 * 3600);  // Seconds in a year
      const BLOCKS_PER_YEAR = SECONDS_PER_YEAR / SECONDS_PER_BLOCK;  // Blocks per year
      const BASIS_POINTS = BigInt(10000);  // Basis points (100% = 10000)
      const MAX_APR = BigInt(3000);  // Global max APR (30%)
      
      // Estimate new total rewards, apply global APR limit
      let estimatedNewRewards = blockDiff * rewardParams.hskPerBlock;
      
      // Check if above MAX_APR (global limit)
      const annualReward = rewardParams.hskPerBlock * BLOCKS_PER_YEAR;
      const currentGlobalAPR = rewardParams.totalPooledHSK > BigInt(0) ? 
        (annualReward * BASIS_POINTS) / rewardParams.totalPooledHSK : MAX_APR;
      
      if (currentGlobalAPR > MAX_APR) {
        estimatedNewRewards = (rewardParams.totalPooledHSK * MAX_APR * blockDiff) / 
                             (BASIS_POINTS * BLOCKS_PER_YEAR);
        console.log(`APR limit applied: ${estimatedNewRewards} (global APR: ${currentGlobalAPR / BigInt(100)}%)`);
      }
      
      // Update each position's estimated rewards - apply APR limits
      const updatedPositions = stakedPositionsRef.current.map(position => {
        // Skip withdrawn stakes
        if (position.info.isWithdrawn) return position;
        
        // Determine max APR for this stake (based on lock period)
        let maxAPR;
        const now = BigInt(Math.floor(Date.now() / 1000));
        const lockEndTime = BigInt(position.info.lockEndTime);
        const isLocked = now < lockEndTime;
        
        if (!isLocked) {
          // Unlocked stakes use 30-day lock APR cap
          maxAPR = BigInt(120); // 1.2%
        } else {
          // Locked stakes based on remaining time
          const remainingTime = lockEndTime - now;
          
          if (remainingTime <= BigInt(30 * 24 * 3600)) {
            maxAPR = BigInt(120); // 30-day lock: 1.2%
          } else if (remainingTime <= BigInt(90 * 24 * 3600)) {
            maxAPR = BigInt(350); // 90-day lock: 3.5%
          } else if (remainingTime <= BigInt(180 * 24 * 3600)) {
            maxAPR = BigInt(650); // 180-day lock: 6.5%
          } else {
            maxAPR = BigInt(1200); // 365-day lock: 12.0%
          }
        }
        
        // Calculate max possible reward for this period based on max APR
        const maxRewardForPeriod = (position.info.hskAmount * maxAPR * blockDiff) / 
                                  (BASIS_POINTS * BLOCKS_PER_YEAR);
        
        // Calculate user's share of global rewards
        const userShareRatio = position.info.sharesAmount * BigInt(10000) / rewardParams.totalShares;
        const baseNewRewards = (estimatedNewRewards * userShareRatio) / BigInt(10000);
        
        // Apply APR limit, take the smaller value
        const userNewRewards = baseNewRewards < maxRewardForPeriod ? 
                              baseNewRewards : maxRewardForPeriod;
        
        // Calculate estimated total profit
        const confirmedProfit = position.info.currentHskValue - position.info.hskAmount;
        const estimatedProfit = confirmedProfit + userNewRewards;
        
        // Log detailed calculation info (for debugging)
        if (position.id === 2) { // Only show details for the first stake
          console.log(`Stake #${position.id} calculation details:`, {
            shares: position.info.sharesAmount.toString(),
            totalShares: rewardParams.totalShares.toString(),
            shareRatio: (Number(userShareRatio) / 10000).toFixed(6),
            baseReward: baseNewRewards.toString(),
            maxAPR: (Number(maxAPR) / 100).toFixed(2) + '%',
            maxRewardForPeriod: maxRewardForPeriod.toString(),
            appliedReward: userNewRewards.toString(),
            confirmedProfit: confirmedProfit.toString(),
            estimatedProfit: estimatedProfit.toString()
          });
        }
        
        return {
          ...position,
          estimatedProfit,
          pendingReward: userNewRewards
        };
      });
      
      // Calculate new total estimated rewards
      const newEstimatedTotalRewards = updatedPositions
        .filter(pos => !pos.info.isWithdrawn)
        .reduce((sum, pos) => {
          const profit = pos.estimatedProfit || (pos.info.currentHskValue - pos.info.hskAmount);
          return sum + profit;
        }, BigInt(0));
      
      setStakedPositions(updatedPositions);
      setEstimatedTotalRewards(newEstimatedTotalRewards);
      
      console.log('Updated estimated total rewards:', newEstimatedTotalRewards.toString());
      
    } catch (error) {
      console.error('Error calculating estimated rewards:', error);
    } finally {
      setIsEstimating(false);
    }
  }, [currentBlockNumber, rewardParams]);
  
  // Apply estimated rewards when block changes
  useEffect(() => {
    if (stakedPositions.length > 0 && rewardParams.lastRewardBlock > 0) {
      calculateEstimatedRewards();
    }
  }, [calculateEstimatedRewards, stakedPositions.length, rewardParams.lastRewardBlock]);
  
  // Load all user locked stakes
  const fetchStakedPositions = useCallback(async () => {
    if (!isConnected || !address || !lockedStakeCount || !publicClient) return;
    
    setIsLoadingPositions(true);
    
    try {
      // Create stake ID array
      const stakeIds = Array.from({ length: Number(lockedStakeCount) }, (_, i) => i);
      
      // Fetch reward parameters before getting stake info
      await fetchRewardParams();
      
      // Batch fetch all stake information
      const stakesInfo = await batchGetStakingInfo(contractAddress, publicClient, stakeIds, address);
      
      // Calculate total confirmed rewards for reference only
      const confirmedTotalReward = stakesInfo
        .filter(info => !info.error && !info.isWithdrawn)
        .reduce((sum, info) => sum + info.reward, BigInt(0));
      
      setTotalRewards(confirmedTotalReward);
      
      // Convert to required format - include all positions, including withdrawn ones
      const positions = stakesInfo
        .filter(info => !info.error)
        .map(info => ({
          id: info.id,
          info: {
            sharesAmount: info.sharesAmount,
            hskAmount: info.hskAmount,
            currentHskValue: info.currentHskValue,
            lockEndTime: info.lockEndTime,
            isWithdrawn: info.isWithdrawn,
            isLocked: info.isLocked
          },
          // Initialize with confirmed values, will be updated by calculateEstimatedRewards
          estimatedProfit: info.reward,
          pendingReward: BigInt(0)
        }));
      
      setStakedPositions(positions);
      setLastUpdateTime(new Date());
      
      console.log('Stakes data loaded successfully:', positions.length, 'positions');
    } catch (error) {
      console.error('Failed to fetch staked positions:', error);
      toast.error('Failed to load your stakes');
    } finally {
      setIsLoadingPositions(false);
    }
  }, [address, isConnected, lockedStakeCount, publicClient, contractAddress, fetchRewardParams]);
  
  // Initial data load
  useEffect(() => {
    fetchStakedPositions();
    
    // Fetch reward parameters regularly but less frequently
    const intervalId = setInterval(() => {
      fetchRewardParams();
    }, 300000); // Every 5 minutes instead of every minute
    
    return () => clearInterval(intervalId);
  }, [fetchStakedPositions, fetchRewardParams]);
  
  // Handle unstaking
  const handleUnstake = async (stakeId: number) => {
    if (processingStakeId !== null) {
      toast.warn('Please wait for the current transaction to complete');
      return;
    }
    
    setProcessingStakeId(stakeId);
    
    try {
      await unstakeLocked(stakeId);
      toast.success('Unstaking transaction submitted successfully');
      
      // Update UI to reflect changes
      setStakedPositions(prev => prev.filter(pos => pos.id !== stakeId));
      
      // Recalculate total rewards
      setTotalRewards(prev => {
        const unstakePosition = stakedPositions.find(pos => pos.id === stakeId);
        if (!unstakePosition) return prev;
        return prev - (unstakePosition.info.currentHskValue - unstakePosition.info.hskAmount);
      });
      
      // Update estimated total rewards
      setEstimatedTotalRewards(prev => {
        const unstakePosition = stakedPositions.find(pos => pos.id === stakeId);
        if (!unstakePosition) return prev;
        return prev - (unstakePosition.estimatedProfit || (unstakePosition.info.currentHskValue - unstakePosition.info.hskAmount));
      });
      
    } catch (error) {
      console.error('Unstaking failed:', error);
      toast.error('Failed to unstake. See console for details.');
    } finally {
      setProcessingStakeId(null);
    }
  };
  
  // Manually refresh data
  const handleRefresh = () => {
    fetchStakedPositions();
    toast.info('Refreshing stake information...');
  };
  
  // Format remaining time
  const formatTimeRemaining = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;
    
    if (remaining <= 0) return 'Unlocked';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) {
      return `${days} days ${hours} hrs`;
    } else if (hours > 0) {
      const minutes = Math.floor((remaining % 3600) / 60);
      return `${hours} hrs ${minutes} mins`;
    } else {
      const minutes = Math.floor(remaining / 60);
      return `${minutes} mins`;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-light text-white">My Stakes</h1>
              <button 
                onClick={handleRefresh}
                disabled={isLoadingPositions}
                className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:cursor-not-allowed flex items-center"
              >
                {isLoadingPositions ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
            
            {lastUpdateTime && (
              <div className="text-sm text-slate-400 mb-4">
                Last update: {lastUpdateTime.toLocaleTimeString()}
                {estimatedTotalRewards > totalRewards && (
                  <span className="ml-2 text-green-400">
                    • Rewards are continuously accumulating
                  </span>
                )}
              </div>
            )}
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">Active Stakes</h3>
                </div>
                <p className="text-2xl font-medium text-white">
                  {loadingInfo || isLoadingPositions ? (
                    <span className="inline-block w-10 h-7 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    Number(activeLockedStakes || 0)
                  )}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">Completed Stakes</h3>
                </div>
                <p className="text-2xl font-medium text-white">
                  {loadingInfo ? (
                    <span className="inline-block w-10 h-7 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    Number(lockedStakeCount || 0) - Number(activeLockedStakes || 0)
                  )}
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-primary/80">Total Rewards</h3>
                </div>
                <p className="text-2xl font-medium text-green-500">
                  {isLoadingPositions ? (
                    <span className="inline-block w-24 h-7 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    <>
                      +{formatBigInt(estimatedTotalRewards)} HSK
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Active stakes list */}
            <h2 className="text-2xl font-light text-white mb-6">Active Stakes</h2>
            
            {isLoadingPositions ? (
              // Skeleton loading cards
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
                    <div className="flex flex-wrap justify-between mb-4">
                      <div className="mb-4 w-1/3">
                        <div className="h-5 bg-slate-700 rounded mb-2 w-20"></div>
                        <div className="h-7 bg-slate-700 rounded w-24"></div>
                      </div>
                      <div className="mb-4 w-1/3">
                        <div className="h-5 bg-slate-700 rounded mb-2 w-20"></div>
                        <div className="h-7 bg-slate-700 rounded w-24"></div>
                      </div>
                      <div className="mb-4 w-1/3">
                        <div className="h-5 bg-slate-700 rounded mb-2 w-20"></div>
                        <div className="h-7 bg-slate-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-slate-700 rounded w-32 ml-auto"></div>
                  </div>
                ))}
              </div>
            ) : stakedPositions.length > 0 ? (
              <div className="space-y-4">
                {stakedPositions
                  .filter(position => !position.info.isWithdrawn)
                  .map((position) => (
                  <div key={position.id} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <div className="flex flex-wrap justify-between mb-6">
                      <div className="w-full sm:w-auto mb-4 sm:mb-0">
                        <h3 className="text-sm text-slate-400 mb-1">Stake #{position.id}</h3>
                        <div className="flex items-center">
                          <p className="text-xl font-medium text-white">
                            {formatBigInt(position.info.sharesAmount)} stHSK
                          </p>
                          {position.info.isLocked && (
                            <span className="ml-3 px-2 py-1 text-xs font-medium bg-primary/20 text-primary/90 rounded">
                              Locked
                            </span>
                          )}
                          {!position.info.isLocked && (
                            <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded">
                              Unlocked
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto mb-4 sm:mb-0 sm:mx-4">
                        <p className="text-sm text-slate-400 mb-1">Current Value</p>
                        <p className="text-xl font-medium text-white">
                          {/* Show estimated current value */}
                          {formatBigInt(position.info.hskAmount + (position.estimatedProfit || BigInt(0)))} HSK
                        </p>
                      </div>
                      
                      <div className="w-full sm:w-auto mb-4 sm:mb-0">
                        <p className="text-sm text-slate-400 mb-1">Profit</p>
                        <p className="text-xl font-medium text-green-500">
                          {/* Only show estimated profit */}
                          +{formatBigInt(position.estimatedProfit || BigInt(0))} HSK
                          {position.pendingReward && position.pendingReward > 0 && (
                            <span className="block text-xs text-green-400">
                              (+{formatBigInt(position.pendingReward)} since last update)
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <p className="text-sm text-slate-400 mb-1">
                          {position.info.isLocked ? 'Time Remaining' : 'Unlocked on'}
                        </p>
                        <p className="text-xl font-medium text-white">
                          {position.info.isLocked ? 
                            formatTimeRemaining(position.info.lockEndTime) : 
                            new Date(Number(position.info.lockEndTime) * 1000).toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>
                    
                    {!position.info.isWithdrawn && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleUnstake(position.id)}
                          disabled={processingStakeId === position.id}
                          className={`px-4 py-2 rounded ${
                            position.info.isLocked
                              ? 'bg-yellow-500/70 hover:bg-yellow-500 text-white'
                              : 'bg-primary/80 hover:bg-primary text-white'
                          } transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed`}
                        >
                          {processingStakeId === position.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              Unstake {position.info.isLocked && '(Early)'}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // No stakes found
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
                <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">No Active Stakes</h3>
                <p className="text-slate-400 mb-6">
                  You don't have any active stakes yet. Start staking to earn rewards.
                </p>
                <a 
                  href="/stake" 
                  className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Start Staking
                </a>
              </div>
            )}
            
            {/* Completed stakes section */}
            {stakedPositions.some(pos => pos.info.isWithdrawn) && (
              <>
                <h2 className="text-2xl font-light text-white mb-6 mt-12">Completed Stakes</h2>
                <div className="space-y-4">
                  {stakedPositions
                    .filter(position => position.info.isWithdrawn)
                    .map((position) => (
                    <div key={position.id} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 opacity-70">
                      <div className="flex flex-wrap justify-between mb-2">
                        <div className="w-full sm:w-auto mb-4 sm:mb-0">
                          <h3 className="text-sm text-slate-400 mb-1">Stake #{position.id}</h3>
                          <div className="flex items-center">
                            <p className="text-xl font-medium text-white">
                              {formatBigInt(position.info.sharesAmount)} stHSK
                            </p>
                            <span className="ml-3 px-2 py-1 text-xs font-medium bg-slate-600/50 text-slate-300 rounded">
                              Withdrawn
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full sm:w-auto mb-4 sm:mb-0 sm:mx-4">
                          <p className="text-sm text-slate-400 mb-1">Staked Amount</p>
                          <p className="text-xl font-medium text-white">
                            {formatBigInt(position.info.hskAmount)} HSK
                          </p>
                        </div>
                        
                        <div className="w-full sm:w-auto">
                          <p className="text-sm text-slate-400 mb-1">Withdrawn Amount</p>
                          <p className="text-xl font-medium text-white">
                            {formatBigInt(position.info.currentHskValue)} HSK
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}