'use client';

import React, { useState } from 'react';
import { StakeType } from '@/types/contracts';
import { formatBigInt } from '@/utils/format';

interface StakingFormProps {
  minStakeAmount: bigint;
  onStake: (amount: string, type: StakeType) => Promise<void>;
  isConnected: boolean;
  userBalance?: bigint;
  isPending: boolean;
}

export default function StakingForm({
  minStakeAmount,
  onStake,
  isConnected,
  userBalance = BigInt(0),
  isPending
}: StakingFormProps) {
  const [amount, setAmount] = useState('');
  const [stakeType, setStakeType] = useState<StakeType>(StakeType.FIXED_365_DAYS);
  
  const minStakeFormatted = formatBigInt(minStakeAmount);
  const userBalanceFormatted = formatBigInt(userBalance);
  
  const handleSubmit = async () => {
    if (!isConnected) return;
    
    try {
      await onStake(amount, stakeType);
      // 成功后清空表单
      setAmount('');
    } catch (error) {
      console.error('质押失败:', error);
    }
  };
  
  const setMaxAmount = () => {
    if (userBalance) {
      setAmount(formatBigInt(userBalance, 18, 18));
    }
  };
  
  const isAmountValid = () => {
    try {
      const amountValue = parseFloat(amount);
      const minStakeValue = parseFloat(minStakeFormatted);
      return amountValue >= minStakeValue && amountValue <= parseFloat(userBalanceFormatted);
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">质押 HSK</h2>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">质押金额 (HSK)</span>
              {userBalance && (
                <span className="label-text-alt">余额: {userBalanceFormatted} HSK</span>
              )}
            </label>
            
            <div className="input-group">
              <input
                type="number"
                placeholder={`最小质押额 ${minStakeFormatted} HSK`}
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={parseFloat(minStakeFormatted)}
                step="0.01"
                required
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={setMaxAmount}
                disabled={!isConnected || userBalance === BigInt(0)}
              >
                最大
              </button>
            </div>
            
            <label className="label">
              <span className="label-text-alt text-error">
                {minStakeAmount && parseFloat(amount) < parseFloat(minStakeFormatted) && amount !== '' 
                  ? `最小质押额为 ${minStakeFormatted} HSK` 
                  : ''}
              </span>
            </label>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">锁定期限</span>
            </label>
            
            <select
              className="select select-bordered w-full"
              value={stakeType}
              onChange={(e) => setStakeType(parseInt(e.target.value) as StakeType)}
            >
              <option value={StakeType.FIXED_30_DAYS}>30 天 - 基础奖励</option>
              <option value={StakeType.FIXED_90_DAYS}>90 天 - 奖励 +0.8%</option>
              <option value={StakeType.FIXED_180_DAYS}>180 天 - 奖励 +2.0%</option>
              <option value={StakeType.FIXED_365_DAYS}>365 天 - 奖励 +4.0%</option>
            </select>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!isConnected || !isAmountValid() || isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                '质押'
              )}
            </button>
          </div>
          
          {!isConnected && (
            <p className="text-center text-sm text-error">请先连接钱包</p>
          )}
        </form>
      </div>
    </div>
  );
}