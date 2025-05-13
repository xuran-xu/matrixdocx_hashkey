'use client';

import React from 'react';
import MainLayout from '../main-layout';
import Link from 'next/link';

export default function EventsPage() {
  // 模拟活动数据
  const events = [
    {
      id: 1,
      title: "HashKey Chain Mining Event",
      description: "Participate in HashKey Chain mining activities, enjoy on-chain DeFi incentives and high returns!",
      startDate: "January 1, 2025",
      endDate: "March 31, 2025",
      status: "upcoming",
      rewards: "1,000,000 HSK",
      participants: 0,
      image: "/images/events/mining.jpg"
    },
    {
      id: 2,
      title: "HSK Token Airdrop",
      description: "Early supporters of HashKey ecosystem will receive exclusive token airdrops.",
      startDate: "December 15, 2024",
      endDate: "December 31, 2024",
      status: "upcoming",
      rewards: "500,000 HSK",
      participants: 0,
      image: "/images/events/airdrop.jpg"
    },
    {
      id: 3,
      title: "Trading Competition",
      description: "Trade HSK tokens and win prizes based on your trading volume.",
      startDate: "November 1, 2024",
      endDate: "November 30, 2024",
      status: "upcoming",
      rewards: "250,000 HSK",
      participants: 0,
      image: "/images/events/trading.jpg"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">HashKey Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Participate in HashKey ecosystem events and earn rewards
          </p>
        </div>

        {/* Event Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full text-white font-medium border border-slate-700">
            All Events
          </button>
          <button className="px-6 py-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-gray-300 hover:text-white font-medium border border-slate-700/50">
            Active
          </button>
          <button className="px-6 py-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-gray-300 hover:text-white font-medium border border-slate-700/50">
            Upcoming
          </button>
          <button className="px-6 py-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-gray-300 hover:text-white font-medium border border-slate-700/50">
            Completed
          </button>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 shadow-lg transition-transform hover:transform hover:scale-[1.02]">
              <div className="h-48 bg-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-slate-900/80" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-800/80 text-purple-200 border border-purple-700">
                    {event.status === 'active' ? 'Active' : event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-300 mb-4">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Start Date</p>
                    <p className="text-sm text-white">{event.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">End Date</p>
                    <p className="text-sm text-white">{event.endDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Rewards</p>
                    <p className="text-sm text-green-400 font-medium">{event.rewards}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Participants</p>
                    <p className="text-sm text-white">{event.participants.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/events/${event.id}`} 
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <button className="px-4 py-2 bg-purple-600/90 hover:bg-purple-600 rounded-lg text-white text-sm font-medium">
                    Participate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Past Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Past Events</h2>
          
          <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
            <div className="p-12 text-center text-gray-400">
              <p>No past events found</p>
            </div>
          </div>
        </div>

        {/* Subscribe to Events */}
        <div className="bg-gradient-to-r from-purple-900/50 to-slate-900/50 rounded-xl p-8 border border-purple-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated with HashKey Events</h2>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter to get notified about upcoming events, airdrops, and other opportunities</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white w-full sm:w-80"
              />
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}