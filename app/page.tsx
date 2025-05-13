'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from './main-layout';
import { formatBigInt } from '@/utils/format';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useStakingInfo } from '@/hooks/useStakingContracts';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  // 添加本地loading状态，初始为true
  const [initialLoading, setInitialLoading] = useState(true);
  const [simulatedAmount, setSimulatedAmount] = useState('1000');
  const [debouncedAmount, setDebouncedAmount] = useState(simulatedAmount);
  const { address: _address, isConnected } = useAccount();
  const { totalStaked, stakingStats, exchangeRate, isLoading: apiLoading } = useStakingInfo(debouncedAmount);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isAppEnabled, setIsAppEnabled] = useState(false);
  const [aprDataSource, setAprDataSource] = useState<'contract' | 'loading'>('loading');
  
  // 结合API加载状态和初始加载状态
  const isLoadingCombined = initialLoading || apiLoading;
  
  // Beijing launch time - March 3, 2025 20:00:00
  const launchTime = new Date('2025-03-01T20:00:00+08:00').getTime();

  // 检查环境变量
  useEffect(() => {
    const appEnabled = process.env.NEXT_PUBLIC_APP_ENABLED === 'true';
    setIsAppEnabled(appEnabled);
    console.log('App enabled from env:', appEnabled);
  }, []);

  // 获取服务器时间并检查是否已经发布
  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await axios.get('/api/time');
        const serverTimeStamp = new Date(response.data.time).getTime();
        const serverTimeObj = new Date(serverTimeStamp);
        setServerTime(serverTimeObj);
        
        // 检查是否已过发布时间
        const isPastLaunchTime = serverTimeStamp >= launchTime;
        setIsLaunched(isPastLaunchTime);
        setIsLoading(false);
        
        console.log('Server time:', serverTimeObj);
        console.log('Launch time:', new Date(launchTime));
        console.log('Is past launch time:', isPastLaunchTime);
      } catch (error) {
        console.error('Failed to fetch server time:', error);
        // 如果获取服务器时间失败，使用客户端时间
        const now = new Date();
        setServerTime(now);
        setIsLaunched(now.getTime() >= launchTime);
        setIsLoading(false);
      }
    };

    fetchServerTime();
  }, [launchTime]);

  // 设置倒计时间隔
  useEffect(() => {
    if (!serverTime || isLaunched) return;

    const calculateTimeLeft = () => {
      // 基于服务器时间 + 自获取以来的经过时间计算
      const elapsedSinceFetch = Date.now() - serverTime.getTime();
      const adjustedNow = new Date(serverTime.getTime() + elapsedSinceFetch);
      const timeDiff = launchTime - adjustedNow.getTime();
      
      if (timeDiff <= 0) {
        setIsLaunched(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // 如果倒计时结束，刷新页面
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [serverTime, isLaunched, launchTime]);
  
  // 当数据加载完成后，关闭初始加载状态
  useEffect(() => {
    if (!apiLoading && totalStaked !== undefined) {
      // 添加一个小延迟，确保UI平滑过渡
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 100);
      console.log('Total staked:', totalStaked);
      return () => clearTimeout(timer);
    }
  }, [apiLoading, totalStaked]);
  
  // Add debounce processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(simulatedAmount);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [simulatedAmount]);
  
  
  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // 未发布或应用未启用：显示倒计时
  if (!isLaunched || !isAppEnabled) {
    // 显示不同的消息，取决于是时间未到还是应用未启用
    const message = "Launching on March 3, 2025 20:00 UTC+8"
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          
          <h1 className="text-5xl md:text-7xl font-bold pb-8 bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent">
            HSK Staking
          </h1>
          
          <p className="text-lg md:text-2xl mb-10 text-gray-300">
            Get ready for the future of staking. Launching soon.
          </p>
          
          {!isLaunched && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center mb-10 md:mb-16 max-w-md md:max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="text-5xl md:text-6xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-xs md:text-sm uppercase tracking-wider mt-1 md:mt-2 text-gray-400">Days</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="text-5xl md:text-6xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm uppercase tracking-wider mt-1 md:mt-2 text-gray-400">Hours</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="text-5xl md:text-6xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm uppercase tracking-wider mt-1 md:mt-2 text-gray-400">Minutes</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="text-5xl md:text-6xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm uppercase tracking-wider mt-1 md:mt-2 text-gray-400">Seconds</div>
              </div>
            </div>
          )}
          
          <div className="text-base md:text-lg text-gray-400">
            {message}
          </div>
        </div>
      </div>
    );
  }
  
  // 在首页的合适位置添加数据来源指示器
  const renderDataSourceIndicator = () => {
    return (
      <div className="mb-4 text-sm">
        <span className="text-slate-400">
          APR Data Source: {' '}
          {aprDataSource === 'contract' ? (
            <span className="text-green-500">Contract (Live Data)</span>
          ) : (
            <span className="text-yellow-500">Loading...</span>
          )}
        </span>
      </div>
    );
  };
  
  // 已发布且应用已启用：显示主内容
  return (
    <MainLayout>
      <div className="min-h-screen text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-8">
        {/* <div className="container mx-auto px-4 pt-16 pb-24"> */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-white mb-6 font-sora">HashKey Chain Staking</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              _address: { _address }
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Total Staked Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 transition-all hover:border-primary/30 hover:bg-slate-800/80">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                </svg>
                <h3 className="text-sm font-medium text-slate-300">Total Staked</h3>
              </div>
              {isLoadingCombined ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-700 rounded w-32"></div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light tracking-tight text-white">
                    {typeof totalStaked === 'bigint' ? formatBigInt(totalStaked) : '0'}
                  </span>
                  <span className="text-lg font-light text-slate-400">HSK</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}