import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Award, Flame, Star, Target } from 'lucide-react';

const achievementIcons = {
  streak: Flame,
  milestone: Target,
  badge: Award,
  default: Star
};

const achievementColors = {
  streak: { bg: 'bg-orange-100', text: 'text-orange-600', accent: '#E67E22' },
  milestone: { bg: 'bg-green-100', text: 'text-green-600', accent: '#27AE60' },
  badge: { bg: 'bg-purple-100', text: 'text-purple-600', accent: '#9B59B6' }
};

export default function AchievementCard({ achievement, index = 0 }) {
  const Icon = achievementIcons[achievement.type] || achievementIcons.default;
  const colors = achievementColors[achievement.type] || achievementColors.badge;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-[16px] ${colors.bg} relative overflow-hidden`}
    >
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ backgroundColor: colors.accent }} />
      
      <div className={`w-10 h-10 rounded-[10px] ${colors.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      
      <h4 className={`font-semibold ${colors.text} mb-1`}>{achievement.name}</h4>
      <p className="text-sm text-[#666666] mb-2">{achievement.description}</p>
      
      {achievement.unlocked_date && (
        <p className="text-xs text-[#999999]">
          Unlocked {format(new Date(achievement.unlocked_date), 'MMM d, yyyy')}
        </p>
      )}
    </motion.div>
  );
}