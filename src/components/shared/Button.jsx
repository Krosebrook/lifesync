import React from 'react';
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
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 uppercase tracking-wider text-sm';
  
  const variants = {
    primary: 'bg-[#FF6B35] text-white hover:bg-[#E85A2A]',
    secondary: 'bg-[#2A2A2A] text-[#F5F5F5] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,53,0.3)]',
    outline: 'border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10',
    ghost: 'text-[#9A9A9A] hover:text-[#F5F5F5]',
    danger: 'bg-[#D9534F] text-white hover:bg-[#C9302C]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    icon: 'p-3'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
          {children}
        </>
      )}
    </button>
  );
}