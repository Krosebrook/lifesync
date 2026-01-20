import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  onClick,
  hover = false,
  padding = 'p-4 md:p-6',
  variant = 'default'
}) {
  const baseClasses = variant === 'glass' 
    ? `bg-white/5 backdrop-blur-xl border border-white/10 rounded-[16px] ${padding}`
    : `bg-[#1A1F3A] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${padding}`;
  const hoverClasses = hover ? 'cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300' : '';

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