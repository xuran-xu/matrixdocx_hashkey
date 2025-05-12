'use client';

import React, { useState } from 'react';

// 模拟活动数据
const activityData = {
  title: "HashKey Chain Mining Event",
  description: "Participate in HashKey Chain mining activities, enjoy on-chain DeFi incentives and high returns!",
  apyRate: "8%~15%",
  minHoldingTime: "30 days",
  startDate: "January 1, 2025",
  endDate: "March 31, 2025",
  participationAddress: "0x1234...5678",
  rewardMechanisms: [
    {
      id: 1,
      title: "Token Holding Rewards",
      description: "Hold specified tokens for the minimum holding period to receive 8% base APY",
      icon: "💰"
    },
    {
      id: 2,
      title: "LP Providing Incentives",
      description: "Provide liquidity on specified DEX to earn additional 3% APY",
      icon: "💧"
    },
    {
      id: 3,
      title: "Staking Mining Rewards",
      description: "Participate in staking mining to earn additional 4% APY and governance tokens",
      icon: "⛏️"
    }
  ],
  faq: [
    {
      id: 1,
      question: "How to participate in HashKey mining events?",
      answer: "You need to connect your wallet first, then subscribe to relevant tokens at the specified address. Afterwards, you can choose to hold, provide liquidity, or stake for mining."
    },
    {
      id: 2,
      question: "How are rewards calculated and distributed?",
      answer: "The system automatically calculates rewards based on the user's holdings, holding period, and incentive projects participated in. Rewards will be distributed to participants' wallets within 7 working days after the event ends."
    },
    {
      id: 3,
      question: "Do I need to pay additional fees?",
      answer: "Participation in the event itself does not require additional fees, but you need to pay Gas fees for on-chain operations."
    }
  ]
};

export const ActivityRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState("rules");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <section className="bg-hashkey-dark-200/50 backdrop-blur rounded-lg border border-hashkey-dark-400/50 overflow-hidden shadow-hashkey">
      {/* Tabs */}
      <div className="flex border-b border-hashkey-dark-400/70">
        <button 
          className={`px-6 py-4 text-sm font-medium ${activeTab === 'rules' ? 'bg-hashkey-primary/20 text-white border-b-2 border-hashkey-primary' : 'text-gray-400 hover:text-white hover:bg-hashkey-dark-300/50'}`}
          onClick={() => setActiveTab('rules')}
        >
          Activity Rules
        </button>
        <button 
          className={`px-6 py-4 text-sm font-medium ${activeTab === 'faq' ? 'bg-hashkey-primary/20 text-white border-b-2 border-hashkey-primary' : 'text-gray-400 hover:text-white hover:bg-hashkey-dark-300/50'}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'rules' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flowing-title mb-3">{activityData.title}</h2>
              <p className="text-gray-300">{activityData.description}</p>
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-hashkey-dark-300/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Basic Information</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="w-32 text-gray-400">APY Rate:</span>{activityData.apyRate}</li>
                  <li className="flex items-center"><span className="w-32 text-gray-400">Min Holding Time:</span>{activityData.minHoldingTime}</li>
                  <li className="flex items-center"><span className="w-32 text-gray-400">Start Date:</span>{activityData.startDate}</li>
                  <li className="flex items-center"><span className="w-32 text-gray-400">End Date:</span>{activityData.endDate}</li>
                </ul>
              </div>
              <div className="bg-hashkey-dark-300/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">How to Participate</h3>
                <p className="mb-2 text-gray-300">Please subscribe or interact at the following address:</p>
                <div className="bg-hashkey-dark-400/70 p-2 rounded flex items-center">
                  <code className="text-hashkey-accent text-sm flex-1 overflow-hidden">{activityData.participationAddress}</code>
                  <button className="text-xs btn-hashkey py-1 px-2">
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Incentive Mechanisms */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Incentive Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activityData.rewardMechanisms.map((mechanism) => (
                  <div key={mechanism.id} className="bg-hashkey-dark-300/30 p-4 rounded-lg hover:bg-hashkey-dark-300/50 transition-colors">
                    <div className="text-3xl mb-2">{mechanism.icon}</div>
                    <h4 className="text-lg font-medium text-white mb-2">{mechanism.title}</h4>
                    <p className="text-gray-300 text-sm">{mechanism.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div className="mt-8 bg-hashkey-primary/10 border border-hashkey-primary/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Project Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <a href="#" className="btn-hashkey text-center">
                  DEX Platform
                </a>
                <a href="#" className="btn-hashkey text-center">
                  Liquidity Pools
                </a>
                <a href="#" className="btn-hashkey text-center">
                  Staking Platform
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            {activityData.faq.map((item) => (
              <div 
                key={item.id} 
                className="border border-hashkey-dark-400/70 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center bg-hashkey-dark-300/30 hover:bg-hashkey-dark-300/50 transition-colors"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span className="font-medium text-left text-white">{item.question}</span>
                  <span className="text-gray-400">
                    {expandedFaq === item.id ? "−" : "+"}
                  </span>
                </button>
                {expandedFaq === item.id && (
                  <div className="px-6 py-4 bg-hashkey-dark-400/30">
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 