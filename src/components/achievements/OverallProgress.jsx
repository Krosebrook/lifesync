import React from 'react';
import { Flame, Target, Award } from 'lucide-react';
import Card from '../shared/Card';
import ProgressRing from '../shared/ProgressRing';

/**
 * Displays overall achievement progress with category breakdown
 * Shows completion percentage and counts by type
 */
export default function OverallProgress({ 
  completionRate, 
  unlockedCount, 
  totalCount, 
  achievementsByType 
}) {
  const categories = [
    { type: 'streak', icon: Flame, color: '#E67E22', label: 'Streaks' },
    { type: 'milestone', icon: Target, color: '#3498DB', label: 'Milestones' },
    { type: 'badge', icon: Award, color: '#9B59B6', label: 'Badges' }
  ];

  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Progress Ring */}
        <ProgressRing progress={completionRate} size={150} strokeWidth={12}>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#1ABC9C]">{completionRate}%</p>
            <p className="text-xs text-[#666666]">Complete</p>
          </div>
        </ProgressRing>
        
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-3">
            {unlockedCount} / {totalCount} Unlocked
          </h3>
          <p className="text-[#666666] mb-4">
            Keep building your habits and reflecting on your journey to unlock more achievements!
          </p>
          
          {/* Category breakdown */}
          <div className="grid grid-cols-3 gap-4">
            {categories.map(({ type, icon: Icon, color, label }) => (
              <div 
                key={type}
                className="text-center p-3 rounded-[12px]"
                style={{ backgroundColor: `${color}10` }}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" style={{ color }} />
                <p className="text-lg font-bold text-[#1A1A1A]">
                  {achievementsByType[type]?.length || 0}
                </p>
                <p className="text-xs text-[#666666]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}