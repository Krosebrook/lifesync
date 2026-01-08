import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { Target, Flame, ArrowRight, Check } from 'lucide-react';
import Card from '../shared/Card';

export default function HabitQuickView({ habits, todayLogs, onToggleHabit }) {
  const completedToday = habits.filter(h => 
    todayLogs.some(log => log.habit_id === h.id && log.completed)
  ).length;
  const progress = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
            <Target className="w-5 h-5 text-[#1ABC9C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1A1A1A]">Today's Habits</h3>
            <p className="text-sm text-[#666666]">{completedToday}/{habits.length} completed</p>
          </div>
        </div>
        <Link 
          to={createPageUrl('Habits')} 
          className="text-[#1ABC9C] text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-[#F0E5D8] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#1ABC9C] rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Habits Grid */}
      {habits.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {habits.slice(0, 6).map((habit) => {
            const isCompleted = todayLogs.some(log => log.habit_id === habit.id && log.completed);
            return (
              <motion.button
                key={habit.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleHabit(habit.id, !isCompleted)}
                className={`p-4 rounded-[16px] text-left transition-all ${
                  isCompleted 
                    ? 'bg-[#1ABC9C] text-white' 
                    : 'bg-[#FAFAFA] hover:bg-[#F0E5D8]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{habit.icon || '✨'}</span>
                  {isCompleted && <Check className="w-5 h-5" />}
                </div>
                <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {habit.name}
                </p>
                {habit.current_streak > 0 && (
                  <div className={`flex items-center gap-1 mt-2 text-xs ${
                    isCompleted ? 'text-white/80' : 'text-[#666666]'
                  }`}>
                    <Flame className="w-3 h-3" />
                    {habit.current_streak} day streak
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[#666666] mb-3">No habits tracked yet</p>
          <Link 
            to={createPageUrl('Habits')} 
            className="inline-flex items-center gap-2 text-[#1ABC9C] font-medium hover:underline"
          >
            Add your first habit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </Card>
  );
}