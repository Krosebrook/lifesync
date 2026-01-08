import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { value: 1, emoji: '😔', label: 'Struggling' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' }
];

export default function MoodSelector({ value, onChange, size = 'md' }) {
  const sizes = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-3xl'
  };

  return (
    <div className="flex gap-2 justify-center">
      {moods.map((mood) => (
        <motion.button
          key={mood.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(mood.value)}
          className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
            value === mood.value 
              ? 'bg-[#1ABC9C]/20 ring-2 ring-[#1ABC9C]' 
              : 'bg-[#F0E5D8] hover:bg-[#E5D9CC]'
          }`}
          title={mood.label}
        >
          {mood.emoji}
        </motion.button>
      ))}
    </div>
  );
}