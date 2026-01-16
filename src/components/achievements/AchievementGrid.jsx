import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable grid layout for displaying achievements
 * Supports both unlocked and locked states
 */
export default function AchievementGrid({ children, columns = "md:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-4`}>
      {children}
    </div>
  );
}