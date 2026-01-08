import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#1ABC9C] text-white hover:bg-[#16A085] focus:ring-[#1ABC9C]',
    secondary: 'bg-[#F0E5D8] text-[#1A1A1A] hover:bg-[#E5D9CC] focus:ring-[#1ABC9C]',
    outline: 'border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C]/10 focus:ring-[#1ABC9C]',
    ghost: 'text-[#666666] hover:bg-[#F0E5D8] hover:text-[#1A1A1A]',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    icon: 'p-3'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
          {children}
        </>
      )}
    </motion.button>
  );
}