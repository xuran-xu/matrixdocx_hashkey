'use client';

import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  highlight?: boolean;
  border?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, highlight = false, border }) => {
  let borderClass = '';
  
  if (highlight) {
    borderClass = 'border-primary border-2';
  } else if (border === 'accent') {
    borderClass = 'border-accent border-opacity-60';
  } else {
    borderClass = 'border-neutral';
  }

  return (
    <div 
      className={`p-6 rounded-box flex flex-col items-center text-center border ${borderClass} bg-base-300 bg-opacity-50`}
    >
      <h3 className="text-lg font-medium text-gold mb-2">{label}</h3>
      <p className={`text-2xl font-bold ${highlight ? 'text-primary text-3xl' : 'text-base-content'}`}>{value}</p>
    </div>
  );
};

export default StatsCard;