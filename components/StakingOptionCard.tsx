'use client';

import React from 'react';
// import { StakeType } from '@/types/contracts';
// import Link from 'next/link';

interface StakingOptionCardProps {
  title: string;
  duration: string;
  apr: string;
  bonus?: string;
  maxApr: string;
  penalty: string;
  stakeType: number;
  isDisabled?: boolean;
}

export function StakingOptionCard({
  title,
  duration,
  apr,
  bonus,
  maxApr,
  penalty,
  stakeType,
  isDisabled = false
}: StakingOptionCardProps) {
  return (
    <div className="bg-white rounded-lg border border-primary/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="py-4">
        <h3 className="text-lg font-bold text-center text-primary/80">{title}</h3>
      </div>
      
      <div className="p-5 flex-grow">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-primary/80">锁定期限</span>
            <span className="font-medium text-primary/80">{duration}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-primary/80">当前 APR</span>
            <span className="font-medium text-primary/80">{apr}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-primary/80">额外奖励</span>
            {bonus !== undefined ? (
              <span className="font-medium text-primary/80">{bonus}%</span>
            ) : (
              <span className="font-medium text-primary/80">0%</span>
            )}
          </div>
          
          <div className="flex justify-between">
            <span className="text-primary/80">最大 APR</span>
            <span className="font-medium text-primary/80">{maxApr}%</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-primary/80">提前解锁惩罚</span>
            <span className="font-medium text-primary/80">{penalty}%</span>
          </div>
        </div>
      </div>
      
      {/* <div className="p-4 mt-auto">
        <Link href={`/stake?type=${stakeType}`} className="w-full">
          <button 
            className="w-full py-3 bg-primary/80 text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={isDisabled}
          >
            查看详情
          </button>
        </Link>
      </div> */}
    </div>
  );
}