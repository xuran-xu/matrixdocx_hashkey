// src/components/StakingHistory.tsx
import React from 'react';
import { useStakingHistory } from '@/hooks/useStakingHistory';
import { useAccount } from 'wagmi';
import { formatBigInt } from '@/utils/format';
import Link from 'next/link';

export default function StakingHistory() {
  const { address } = useAccount();
  const { loading, error, allStakes } = useStakingHistory(address);

  if (loading) return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
      <svg className="animate-spin w-8 h-8 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-slate-400">正在加载交易历史...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
      <p className="text-red-400">加载交易历史出错: {error.message}</p>
    </div>
  );

  if (!allStakes || allStakes.length === 0) return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
      <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-medium text-white mb-2">没有交易历史</h3>
      <p className="text-slate-400">您还没有进行过任何质押或赎回操作。</p>
    </div>
  );

  // 获取交易哈希列表（不重复）
  const transactionHashes = [...new Set(allStakes.map(stake => stake.id.split('-')[0]))];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">交易列表</h1>
      
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  交易哈希
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  类型
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  数量
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/20 divide-y divide-slate-700">
              {transactionHashes.map((txHash) => {
                // 找到与此哈希相关的第一个质押记录
                const stake = allStakes.find(s => s.id.split('-')[0] === txHash);
                if (!stake) return null;

                // 确定交易类型
                const txType = stake.isWithdrawn && stake.unstakeAt 
                  ? '赎回' 
                  : '质押';
                
                // 确定交易状态
                const status = stake.isWithdrawn 
                  ? '已完成' 
                  : (new Date(Number(stake.lockEndTime) * 1000) < new Date() ? '可赎回' : '锁定中');

                return (
                  <tr key={txHash} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`https://explorer.hashkeypro.io/tx/${txHash}`} target="_blank" className="text-blue-400 hover:text-blue-300">
                        {txHash.substring(0, 8)}...{txHash.substring(txHash.length - 6)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {txType === '质押' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400">
                          质押
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-400">
                          赎回
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {status === '已完成' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-900/30 text-gray-400">
                          已完成
                        </span>
                      ) : status === '可赎回' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/30 text-yellow-400">
                          可赎回
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900/30 text-purple-400">
                          锁定中
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {txType === '质押' 
                        ? stake.formattedStakedAt.toLocaleString() 
                        : (stake.formattedUnstakeAt?.toLocaleString() || 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {txType === '质押' 
                        ? formatBigInt(stake.hskAmount) + ' HSK'
                        : formatBigInt(stake.unstakeAmount || 0n) + ' HSK'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}