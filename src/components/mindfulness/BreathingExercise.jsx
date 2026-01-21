import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function BreathingExercise({ exercise, onStart, onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  const breathingPatterns = {
    'Box Breathing': { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    '4-7-8 Breathing': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    'Calm Breathing': { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
    'Energizing Breath': { inhale: 2, hold1: 1, exhale: 2, hold2: 0 }
  };

  const pattern = breathingPatterns[exercise.name] || breathingPatterns['Box Breathing'];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            return pattern.hold1 || moveToNextPhase('hold1');
          } else if (phase === 'hold1') {
            return pattern.exhale || moveToNextPhase('exhale');
          } else if (phase === 'exhale') {
            return pattern.hold2 || moveToNextPhase('hold2');
          } else {
            setCycles(c => c + 1);
            return pattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const moveToNextPhase = (nextPhase) => {
    const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
    const currentIndex = phases.indexOf(phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setPhase(phases[nextIndex]);
    return pattern[phases[nextIndex]];
  };

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(pattern.inhale);
    setCycles(0);
    onStart(exercise);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (cycles > 0) {
      onComplete({ ...exercise, cycles });
    }
  };

  const getPhaseText = () => {
    switch(phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 180;
    if (phase === 'exhale') return 120;
    return 150;
  };

  return (
    <Card hover className="h-full">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">{exercise.name}</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            Breathing
          </span>
        </div>
        <p className="text-sm text-[#666666] mb-2">{exercise.description}</p>
        <p className="text-xs text-[#999999] mb-3">{exercise.benefits}</p>
      </div>

      {isActive ? (
        <div className="flex flex-col items-center py-8">
          <motion.div
            animate={{ 
              scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: count,
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center mb-4"
          >
            <Wind className="w-12 h-12 text-white" />
          </motion.div>
          
          <p className="text-2xl font-semibold text-[#1A1A1A] mb-2">{getPhaseText()}</p>
          <p className="text-4xl font-bold text-[#4DD0E1] mb-4">{count}</p>
          <p className="text-sm text-[#666666] mb-4">Cycle {cycles + 1}</p>
          
          <Button onClick={stopExercise} variant="outline">
            Complete
          </Button>
        </div>
      ) : (
        <Button onClick={startExercise} icon={Wind} variant="primary" className="w-full">
          Start Exercise
        </Button>
      )}
    </Card>
  );
}