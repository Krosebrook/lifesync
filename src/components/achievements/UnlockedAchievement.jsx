import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../shared/Card';

/**
 * Card component for displaying an unlocked achievement
 * Features shimmer animation and achievement metadata
 */
export default function UnlockedAchievement({ achievement, unlockedDate, Icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all">
        {/* Shimmer effect for visual appeal */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        
        {/* Background decoration */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: achievement.color }}
        />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div 
              className="w-14 h-14 rounded-[12px] flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${achievement.color}20` }}
            >
              {achievement.icon}
            </div>
            <Icon className="w-5 h-5" style={{ color: achievement.color }} />
          </div>
          
          <h4 className="font-semibold text-[#1A1A1A] mb-1">
            {achievement.name}
          </h4>
          <p className="text-sm text-[#666666] mb-3">
            {achievement.description}
          </p>
          
          {unlockedDate && (
            <div className="flex items-center gap-2 text-xs text-[#999999]">
              <Calendar className="w-3 h-3" />
              Unlocked {format(new Date(unlockedDate), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}