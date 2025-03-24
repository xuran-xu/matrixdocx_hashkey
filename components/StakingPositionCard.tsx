'use client';

import React from 'react';
import { formatBigInt, formatTimestamp, getRemainingDays } from '@/utils/format';

interface StakedPositionCardProps {
  stakeId: number;
  sharesAmount: bigint;
  hskAmount: bigint;
  currentHskValue: bigint;
  lockEndTime: bigint;
  isWithdrawn: boolean;
  isLocked: boolean;
  actualReward?: bigint;
  onUnstake: (stakeId: number) => void;
}

export default function StakedPositionCard({
  stakeId,
  sharesAmount,
  hskAmount,
  currentHskValue,
  lockEndTime,
  isWithdrawn,
  isLocked,
  actualReward = BigInt(0),
  onUnstake
}: StakedPositionCardProps) {
  // 计算收益/损失
  const profitRaw = currentHskValue - hskAmount;
  const profitPercentage = Number(currentHskValue) / Number(hskAmount) - 1;
  
  // 格式化为可读数值
  const sharesFormatted = formatBigInt(sharesAmount);
  const hskAmountFormatted = formatBigInt(hskAmount);
  const currentValueFormatted = formatBigInt(currentHskValue);
  const profitFormatted = formatBigInt(profitRaw);
  const actualRewardFormatted = formatBigInt(actualReward, 18, 4);
  const profitPercentFormatted = (profitPercentage * 100).toFixed(2);
  
  // 计算剩余时间
  const remainingDays = getRemainingDays(lockEndTime);
  const lockEndTimeFormatted = formatTimestamp(lockEndTime);
  
  // 确定卡片状态颜色
  let statusColor = "text-gray-500";
  let statusText = "未知";
  
  if (isWithdrawn) {
    statusColor = "text-gray-500";
    statusText = "已提取";
  } else if (isLocked) {
    statusColor = "text-primary";
    statusText = "锁定中";
  } else {
    statusColor = "text-success";
    statusText = "可提取";
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h3 className="card-title">质押 #{stakeId + 1}</h3>
          <div className={`badge ${statusColor}`}>{statusText}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-primary/80">质押份额</p>
            <p className="font-semibold text-primary/80">{sharesFormatted} stHSK</p>
          </div>
          
          <div>
            <p className="text-sm text-primary/80">原始质押</p>
            <p className="font-semibold text-primary/80">{hskAmountFormatted} HSK</p>
          </div>
          
          <div>
            <p className="text-sm text-primary/80">当前价值</p>
            <p className="font-semibold text-primary/80">{currentValueFormatted} HSK</p>
          </div>
          
          <div>
            <p className="text-sm text-primary/80">实际奖励</p>
            <p className="font-semibold text-green-500">{actualRewardFormatted} HSK</p>
          </div>
          
          <div>
            <p className="text-sm text-primary/80">收益</p>
            <p className={`font-semibold ${Number(profitRaw) >= 0 ? 'text-success' : 'text-error'}`}>
              {Number(profitRaw) >= 0 ? '+' : ''}{profitFormatted} HSK ({profitPercentFormatted}%)
            </p>
          </div>
          
          {!isWithdrawn && (
            <>
              <div>
                <p className="text-sm text-primary/80">锁定结束时间</p>
                <p className="font-semibold">{lockEndTimeFormatted}</p>
              </div>
              
              {isLocked && (
                <div>
                  <p className="text-sm text-primary/80">剩余锁定时间</p>
                  <p className="font-semibold text-primary/80">{remainingDays} 天</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {!isWithdrawn && (
          <div className="card-actions justify-end mt-4">
            <button 
              className={`btn ${isLocked ? 'btn-warning' : 'btn-primary'}`}
              onClick={() => onUnstake(stakeId)}
            >
              {isLocked ? '提前解锁 (有惩罚)' : '解锁'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}