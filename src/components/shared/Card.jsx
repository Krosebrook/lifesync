import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  onClick,
  hover = false,
  padding = 'p-4 md:p-6'
}) {
  const baseClasses = `bg-white rounded-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${padding}`;
  const hoverClasses = hover ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow duration-300' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}