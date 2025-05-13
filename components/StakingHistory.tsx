'use client';

import React from 'react';

export default function StakingHistory() {
  const mockHistory = [
    {
      id: '1',
      type: '质押',
      amount: '1000',
      date: '2023-09-01',
      status: '进行中'
    },
    {
      id: '2',
      type: '解锁',
      amount: '500',
      date: '2023-08-15',
      status: '已完成'
    },
    {
      id: '3',
      type: '提取',
      amount: '250',
      date: '2023-07-20',
      status: '已完成'
    }
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg overflow-hidden shadow-lg border border-slate-700">
      <div className="p-5 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">质押历史</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">类型</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">金额</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">日期</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.length > 0 ? (
              mockHistory.map((item) => (
                <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-800/70">
                  <td className="py-3 px-4 text-white">{item.type}</td>
                  <td className="py-3 px-4 text-white">{item.amount} HSK</td>
                  <td className="py-3 px-4 text-gray-300">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === '已完成' ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-700">
                <td colSpan={4} className="py-4 px-4 text-center text-gray-400">
                  尚无交易记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 text-center border-t border-slate-700">
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium" disabled>
          查看全部交易记录
        </button>
      </div>
    </div>
  );
}