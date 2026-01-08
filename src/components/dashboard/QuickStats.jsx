import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, BookOpen, Award } from 'lucide-react';
import Card from '../shared/Card';

export default function QuickStats({ stats }) {
  const statItems = [
    {
      label: 'Streak Days',
      value: stats.streakDays || 0,
      icon: Flame,
      color: '#E67E22',
      bgColor: 'rgba(230, 126, 34, 0.1)'
    },
    {
      label: 'Habit Rate',
      value: `${Math.round(stats.habitRate || 0)}%`,
      icon: Target,
      color: '#1ABC9C',
      bgColor: 'rgba(26, 188, 156, 0.1)'
    },
    {
      label: 'Reflections',
      value: stats.totalReflections || 0,
      icon: BookOpen,
      color: '#3498DB',
      bgColor: 'rgba(52, 152, 219, 0.1)'
    },
    {
      label: 'Achievements',
      value: stats.achievements || 0,
      icon: Award,
      color: '#9B59B6',
      bgColor: 'rgba(155, 89, 182, 0.1)'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card padding="p-4">
            <div 
              className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-3"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-semibold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-sm text-[#666666]">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}