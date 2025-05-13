'use client';

import React from 'react';

export interface StatsCardProps {
  label: string;
  value: string;
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-lg">
      <h3 className="text-gray-400 text-sm font-semibold mb-2">{label}</h3>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}