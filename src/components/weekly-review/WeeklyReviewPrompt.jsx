import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar, Sparkles, TrendingUp, Target, ArrowRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function WeeklyReviewPrompt({ onComplete, onDismiss }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('generateWeeklySummary', {
        week_start: weekStart,
        week_end: weekEnd
      });
      
      if (response.data.success) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-[#1ABC9C]/10 via-[#3498DB]/10 to-[#9B59B6]/10 border-2 border-[#1ABC9C]/20">
        {!summary ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1ABC9C] rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
                  Weekly Review Available 🎯
                </h3>
                <p className="text-[#666666] text-sm">
                  Take a moment to reflect on your progress from last week and set intentions for the week ahead.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={onDismiss}
                size="sm"
              >
                Later
              </Button>
              <Button 
                onClick={handleGenerateSummary}
                loading={loading}
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Review
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* AI Summary */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#1ABC9C]" />
                <h3 className="font-semibold text-[#1A1A1A]">Your Week in Review</h3>
              </div>
              <p className="text-[#1A1A1A] leading-relaxed mb-4">
                {summary.ai_summary}
              </p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-[12px]">
                  <p className="text-sm text-[#666666]">Habit Completion</p>
                  <p className="text-2xl font-bold text-[#1ABC9C]">
                    {summary.habit_completion_rate}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-[12px]">
                  <p className="text-sm text-[#666666]">Average Mood</p>
                  <p className="text-2xl">
                    {summary.average_mood ? ['😔', '😕', '😐', '🙂', '😊'][summary.average_mood - 1] : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[#27AE60]" />
                <h4 className="font-semibold text-[#1A1A1A]">Wins This Week</h4>
              </div>
              <div className="space-y-2">
                {summary.highlights?.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 p-3 bg-[#27AE60]/10 rounded-[12px]"
                  >
                    <span className="text-[#27AE60] mt-0.5">✓</span>
                    <p className="text-sm text-[#1A1A1A]">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Areas for Growth */}
            {summary.areas_for_growth && summary.areas_for_growth.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-[#3498DB]" />
                  <h4 className="font-semibold text-[#1A1A1A]">Focus Areas</h4>
                </div>
                <div className="space-y-2">
                  {summary.areas_for_growth.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-[#3498DB]/10 rounded-[12px]"
                    >
                      <span className="text-[#3498DB] mt-0.5">→</span>
                      <p className="text-sm text-[#1A1A1A]">{area}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Week Intentions */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#9B59B6]" />
                <h4 className="font-semibold text-[#1A1A1A]">This Week's Intentions</h4>
              </div>
              <div className="space-y-2">
                {summary.next_week_intentions?.map((intention, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-2 p-3 bg-[#9B59B6]/10 rounded-[12px]"
                  >
                    <span className="text-[#9B59B6] mt-0.5">★</span>
                    <p className="text-sm text-[#1A1A1A]">{intention}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={onComplete}
                className="flex-1"
              >
                Complete Review
              </Button>
              <Button 
                onClick={onComplete}
                className="flex-1"
              >
                Create Journal Entry
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}