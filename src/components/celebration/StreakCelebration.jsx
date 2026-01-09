import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Trophy, Star, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const milestones = {
  7: { icon: Flame, color: '#E67E22', title: '7-Day Streak!', message: 'You\'re building momentum!', emoji: '🔥' },
  14: { icon: Star, color: '#F39C12', title: '2-Week Streak!', message: 'You\'re on fire!', emoji: '⭐' },
  30: { icon: Trophy, color: '#9B59B6', title: '30-Day Streak!', message: 'Incredible dedication!', emoji: '🏆' },
  60: { icon: Sparkles, color: '#1ABC9C', title: '60-Day Streak!', message: 'You\'re unstoppable!', emoji: '✨' },
  100: { icon: Trophy, color: '#E74C3C', title: '100-Day Streak!', message: 'Legendary achievement!', emoji: '💎' }
};

export default function StreakCelebration({ streak, habitName, onClose }) {
  const milestone = milestones[streak] || milestones[7];
  const Icon = milestone.icon;

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: [milestone.color, '#FFD700', '#FF6B6B', '#4ECDC4']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: [milestone.color, '#FFD700', '#FF6B6B', '#4ECDC4']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            rotate: [0, -5, 5, -5, 0]
          }}
          transition={{
            type: "spring",
            duration: 0.8,
            bounce: 0.5
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="text-center relative overflow-hidden">
            {/* Animated background circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
              style={{ backgroundColor: milestone.color, opacity: 0.1 }}
            />

            {/* Main content */}
            <div className="relative z-10 py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  delay: 0.2,
                  duration: 0.6,
                  type: "spring"
                }}
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${milestone.color}20` }}
              >
                <span className="text-5xl">{milestone.emoji}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold mb-2"
                style={{ color: milestone.color }}
              >
                {milestone.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-[#1A1A1A] mb-2"
              >
                {milestone.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-[#666666] mb-6"
              >
                {habitName}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <Flame className="w-6 h-6" style={{ color: milestone.color }} />
                <span className="text-4xl font-bold" style={{ color: milestone.color }}>
                  {streak}
                </span>
                <span className="text-xl text-[#666666]">days</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button onClick={onClose} style={{ backgroundColor: milestone.color }}>
                  Keep Going! 💪
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}