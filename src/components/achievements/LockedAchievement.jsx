import React from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';

/**
 * Compact card for locked achievements
 * Shows grayed out preview of what can be unlocked
 */
export default function LockedAchievement({ achievement, Icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card padding="p-4" className="bg-[#FAFAFA] border-2 border-dashed border-[#E5D9CC]">
        <div className="flex items-center gap-3 mb-2 opacity-50">
          <span className="text-2xl">{achievement.icon}</span>
          <Icon className="w-4 h-4 text-[#999999]" />
        </div>
        <h4 className="font-medium text-[#999999] text-sm mb-1">
          {achievement.name}
        </h4>
        <p className="text-xs text-[#AAAAAA]">
          {achievement.description}
        </p>
      </Card>
    </motion.div>
  );
}