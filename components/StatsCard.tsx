'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] border border-white/80">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-primary/70">{icon}</div>}
        <h3 className="text-sm font-medium text-primary/80">{title}</h3>
      </div>
      
      <div className="text-3xl font-light text-neutral-800">
        {value}
      </div>
    </div>
  );
}