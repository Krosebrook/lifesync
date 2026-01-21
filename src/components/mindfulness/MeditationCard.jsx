import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Check } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function MeditationCard({ practice, onStart, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(practice.duration * 60);
  const [timer, setTimer] = useState(null);

  const startPractice = () => {
    setIsPlaying(true);
    onStart(practice);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          onComplete(practice);
          return practice.duration * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  const pausePractice = () => {
    setIsPlaying(false);
    if (timer) clearInterval(timer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="h-full">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">{practice.name}</h3>
            <span className="px-2 py-1 bg-[#1ABC9C]/10 text-[#1ABC9C] text-xs rounded-full">
              {practice.duration} min
            </span>
          </div>
          <p className="text-sm text-[#666666] mb-3">{practice.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[#999999]">Benefits:</span>
            <span className="text-xs text-[#1ABC9C]">{practice.benefits}</span>
          </div>

          <div className="p-3 bg-[#F0E5D8] rounded-[8px] mb-3">
            <p className="text-xs text-[#666666]">{practice.when_to_use}</p>
          </div>
        </div>

        {isPlaying && (
          <div className="mb-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-[#1ABC9C]">{formatTime(timeLeft)}</span>
            </div>
            <div className="w-full bg-[#E5D9CC] rounded-full h-2">
              <div 
                className="bg-[#1ABC9C] h-2 rounded-full transition-all"
                style={{ width: `${((practice.duration * 60 - timeLeft) / (practice.duration * 60)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={isPlaying ? pausePractice : startPractice}
          icon={isPlaying ? Pause : Play}
          variant="primary"
          className="w-full"
        >
          {isPlaying ? 'Pause' : 'Start Practice'}
        </Button>
      </Card>
    </motion.div>
  );
}