import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  onClick,
  hover = false,
  padding = 'p-5 md:p-7',
  variant = 'default'
}) {
  const baseClasses = variant === 'ghost' 
    ? `bg-transparent border border-[rgba(255,255,255,0.08)] ${padding}`
    : `bg-[#2A2A2A] border border-[rgba(255,255,255,0.08)] ${padding}`;
  const hoverClasses = hover ? 'cursor-pointer hover:border-[rgba(255,107,53,0.3)] transition-all duration-200' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} relative grain ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}