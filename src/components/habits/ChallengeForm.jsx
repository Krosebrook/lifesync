import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Target } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../shared/Card';
import Button from '../shared/Button';

const presetGoals = [7, 14, 21, 30, 60, 90, 100];

export default function ChallengeForm({ habit, onSave, onCancel }) {
  const [goalDays, setGoalDays] = useState(30);
  const [customGoal, setCustomGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = customGoal ? parseInt(customGoal) : goalDays;
    
    onSave({
      habit_id: habit.id,
      goal_days: days,
      start_date: format(new Date(), 'yyyy-MM-dd'),
      status: 'active',
      current_progress: habit.current_streak || 0
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#1ABC9C]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Set Challenge Goal
              </h2>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors"
            >
              <X className="w-5 h-5 text-[#666666]" />
            </button>
          </div>

          {/* Habit Info */}
          <div className="p-4 bg-[#F0E5D8] rounded-[16px] mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{habit.icon || '✨'}</span>
              <div>
                <h3 className="font-semibold text-[#1A1A1A]">{habit.name}</h3>
                <p className="text-sm text-[#666666]">
                  Current streak: {habit.current_streak || 0} days
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preset Goals */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-3 block">
                Choose your goal
              </label>
              <div className="grid grid-cols-4 gap-2">
                {presetGoals.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setGoalDays(days);
                      setCustomGoal('');
                    }}
                    className={`p-3 rounded-[12px] text-center transition-all ${
                      goalDays === days && !customGoal
                        ? 'bg-[#1ABC9C] text-white ring-2 ring-[#1ABC9C] ring-offset-2'
                        : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                    }`}
                  >
                    <div className="font-bold text-lg">{days}</div>
                    <div className="text-xs">days</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Goal */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Or set custom goal
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Enter number of days..."
                  className="w-full px-4 py-3 pr-16 rounded-[12px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] text-sm">
                  days
                </span>
              </div>
            </div>

            {/* Challenge Preview */}
            <div className="p-4 bg-[#1ABC9C]/10 rounded-[16px]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#1ABC9C]" />
                <span className="font-medium text-[#1ABC9C]">Your Challenge</span>
              </div>
              <p className="text-[#1A1A1A]">
                Complete <strong>{habit.name}</strong> every day for{' '}
                <strong className="text-[#1ABC9C]">
                  {customGoal || goalDays} days straight
                </strong>
              </p>
              {(habit.current_streak || 0) > 0 && (
                <p className="text-sm text-[#666666] mt-2">
                  You'll start with your current {habit.current_streak}-day streak! 🔥
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onCancel} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!customGoal && !goalDays}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Start Challenge
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}