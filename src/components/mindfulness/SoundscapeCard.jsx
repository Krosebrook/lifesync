import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Timer } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const soundscapes = {
  'Rain': { emoji: '🌧️', color: '#3498DB' },
  'Ocean Waves': { emoji: '🌊', color: '#26C6DA' },
  'Forest': { emoji: '🌲', color: '#27AE60' },
  'Fireplace': { emoji: '🔥', color: '#E67E22' },
  'Cafe Ambience': { emoji: '☕', color: '#8B4513' },
  'White Noise': { emoji: '⚪', color: '#95A5A6' },
  'Thunderstorm': { emoji: '⛈️', color: '#34495E' },
  'Night Sounds': { emoji: '🌙', color: '#2C3E50' }
};

export default function SoundscapeCard({ soundscape, onStart, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(10);

  const config = soundscapes[soundscape.name] || soundscapes['Rain'];

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      onStart({ ...soundscape, duration });
      
      setTimeout(() => {
        setIsPlaying(false);
        onComplete({ ...soundscape, duration });
      }, duration * 60 * 1000);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
    >
      <Card hover className="h-full">
        <div className="text-center mb-4">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${config.color}20` }}
          >
            {config.emoji}
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{soundscape.name}</h3>
          <p className="text-sm text-[#666666] mb-3">{soundscape.description}</p>
          
          {!isPlaying && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-[#999999]" />
              <input
                type="range"
                min="5"
                max="60"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-[#666666]">{duration}m</span>
            </div>
          )}

          {isPlaying && (
            <div className="mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center"
              >
                <Volume2 className="w-8 h-8 text-[#1ABC9C]" />
              </motion.div>
              <p className="text-sm text-[#1ABC9C] mt-2">Playing...</p>
            </div>
          )}
        </div>

        <Button
          onClick={togglePlay}
          icon={isPlaying ? VolumeX : Volume2}
          variant={isPlaying ? 'outline' : 'primary'}
          className="w-full"
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
      </Card>
    </motion.div>
  );
}