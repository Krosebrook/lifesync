import React from 'react';
import { Crown } from 'lucide-react';

export default function PremiumBadge({ size = 'sm' }) {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold rounded-full ${sizes[size]}`}>
      <Crown className="w-3 h-3" />
      PREMIUM
    </span>
  );
}