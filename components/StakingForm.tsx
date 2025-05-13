'use client';

import React from 'react';

export default function StakingForm() {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6">质押 HSK</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">金额</label>
          <div className="flex">
            <input
              type="text"
              placeholder="0.0"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-medium rounded-r"
              disabled
            >
              最大
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">可用余额: 0 HSK</p>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">选择期限</label>
          <select
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          >
            <option>30 天 - 8% APY</option>
            <option>90 天 - 12% APY</option>
            <option>180 天 - 15% APY</option>
          </select>
        </div>
        
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded text-white font-medium"
          disabled
        >
          连接钱包以质押
        </button>
        
        <p className="text-sm text-gray-400 text-center">
          质押您的HSK代币以获得奖励，期限越长收益越高
        </p>
      </div>
    </div>
  );
}