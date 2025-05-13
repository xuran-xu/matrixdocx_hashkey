'use client';

import React from 'react';
import MainLayout from './main-layout';
import StatsCard from '../components/StatsCard';
import StakingForm from '../components/StakingForm';
import StakingHistory from '../components/StakingHistory';
import Link from 'next/link';

export default function Home() {
  // 模拟的统计数据
  const stats = [
    { label: '总质押量', value: '1,234,567 HSK' },
    { label: '质押者人数', value: '8,765' },
    { label: '平均收益率', value: '11.5% APY' }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              在 HashKey Chain 上质押您的资产
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              安全、简单地参与 HashKey 生态系统并赚取奖励
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/stake" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium">
                开始质押
              </Link>
              <a href="https://explorer.hsk.xyz" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-gray-500 hover:border-white text-white py-3 px-8 rounded-lg font-medium">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      {/* Staking Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <StakingForm />
            </div>
            <div className="lg:col-span-2">
              <StakingHistory />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">为什么选择 HashKey Staking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <div className="text-blue-500 text-4xl mb-4">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">安全可靠</h3>
              <p className="text-gray-300">您的资产安全是我们的首要任务，我们的质押合约经过第三方审计。</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <div className="text-blue-500 text-4xl mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">高收益回报</h3>
              <p className="text-gray-300">提供具有竞争力的质押奖励，年收益率最高可达 15%。</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <div className="text-blue-500 text-4xl mb-4">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">灵活选择</h3>
              <p className="text-gray-300">提供多种质押期限选择，满足不同用户的需求。</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}