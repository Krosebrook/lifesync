import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import ProgressRing from '../shared/ProgressRing';

export default function ChallengeCard({ challenge, habit, onView }) {
  const progress = Math.round((challenge.current_progress / challenge.goal_days) * 100);
  const isCompleted = challenge.status === 'completed';
  const isFailed = challenge.status === 'failed';

  const statusConfig = {
    active: { bg: 'bg-white', border: 'border-[#1ABC9C]', text: 'text-[#1ABC9C]' },
    completed: { bg: 'bg-[#27AE60]/10', border: 'border-[#27AE60]', text: 'text-[#27AE60]' },
    failed: { bg: 'bg-[#E74C3C]/10', border: 'border-[#E74C3C]', text: 'text-[#E74C3C]' }
  };

  const config = statusConfig[challenge.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onView}
      className={`${config.bg} rounded-[22px] p-5 border-2 ${config.border} cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${config.bg} rounded-[12px] flex items-center justify-center border-2 ${config.border}`}>
            {isCompleted ? (
              <CheckCircle className={`w-5 h-5 ${config.text}`} />
            ) : (
              <Trophy className={`w-5 h-5 ${config.text}`} />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[#1A1A1A]">
              {challenge.goal_days}-Day Challenge
            </h4>
            <p className="text-sm text-[#666666]">{habit?.name}</p>
          </div>
        </div>
        <ProgressRing 
          progress={progress} 
          size={60} 
          strokeWidth={6}
          color={isCompleted ? '#27AE60' : isFailed ? '#E74C3C' : '#1ABC9C'}
        >
          <span className={`text-xs font-bold ${config.text}`}>
            {challenge.current_progress}
          </span>
        </ProgressRing>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666666]">Progress</span>
          <span className={`font-medium ${config.text}`}>
            {challenge.current_progress} / {challenge.goal_days} days
          </span>
        </div>

        {challenge.start_date && (
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Calendar className="w-4 h-4" />
            Started {format(new Date(challenge.start_date), 'MMM d, yyyy')}
          </div>
        )}

        {isCompleted && challenge.completion_date && (
          <div className={`flex items-center gap-2 text-sm ${config.text} font-medium`}>
            <CheckCircle className="w-4 h-4" />
            Completed {format(new Date(challenge.completion_date), 'MMM d, yyyy')}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-[#F0E5D8] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ 
                backgroundColor: isCompleted ? '#27AE60' : isFailed ? '#E74C3C' : '#1ABC9C' 
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}