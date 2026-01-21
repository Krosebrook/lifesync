import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PointsAnimation({ points, show, onComplete }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            y: [-50, -100, -120, -140]
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-2xl font-bold">+{points} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}