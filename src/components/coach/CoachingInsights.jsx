import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Heart, Zap, CheckCircle2 } from 'lucide-react';
import Card from '../shared/Card';

export default function CoachingInsights({ coaching, analytics }) {
  if (!coaching) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Status Assessment */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-r from-[#9B59B6]/5 to-[#4DD0E1]/5 border-2 border-[#9B59B6]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9B59B6]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#9B59B6]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Your Current State</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{coaching.status_assessment}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      {analytics && (
        <motion.div variants={item}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card padding="p-3">
              <p className="text-2xl font-bold text-[#9B59B6]">{analytics.avgMood}</p>
              <p className="text-xs text-[#666666]">Avg Mood</p>
            </Card>
            <Card padding="p-3">
              <p className="text-2xl font-bold text-[#1ABC9C]">{analytics.activeHabits}</p>
              <p className="text-xs text-[#666666]">Active Habits</p>
            </Card>
            <Card padding="p-3">
              <p className="text-2xl font-bold text-[#F39C12]">{analytics.userLevel}</p>
              <p className="text-xs text-[#666666]">Level</p>
            </Card>
            <Card padding="p-3">
              <p className="text-2xl font-bold text-[#1ABC9C]">{analytics.streakDays}</p>
              <p className="text-xs text-[#666666]">Days Active</p>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Strengths */}
      {coaching.strengths && coaching.strengths.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-[#1A1A1A]">Your Strengths</h3>
            </div>
            <ul className="space-y-2">
              {coaching.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-[#666666]">{strength}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Growth Opportunities */}
      {coaching.growth_opportunities && coaching.growth_opportunities.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#9B59B6]" />
              <h3 className="font-semibold text-[#1A1A1A]">Areas for Growth</h3>
            </div>
            <ul className="space-y-2">
              {coaching.growth_opportunities.map((opp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-[#9B59B6] mt-0.5">→</span>
                  <span className="text-[#666666]">{opp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Action Plan */}
      {coaching.action_plan && coaching.action_plan.length > 0 && (
        <motion.div variants={item}>
          <Card className="bg-[#1ABC9C]/5 border-2 border-[#1ABC9C]/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#1ABC9C]" />
              <h3 className="font-semibold text-[#1A1A1A]">Your Action Plan</h3>
            </div>
            <ol className="space-y-2">
              {coaching.action_plan.map((action, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1ABC9C] text-white text-xs font-semibold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[#666666] mt-0.5">{action}</span>
                </li>
              ))}
            </ol>
          </Card>
        </motion.div>
      )}

      {/* Motivation */}
      {coaching.motivation && (
        <motion.div variants={item}>
          <Card className="bg-gradient-to-r from-[#4DD0E1]/5 to-[#1ABC9C]/5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#4DD0E1] flex-shrink-0 mt-1" />
              <p className="text-sm text-[#666666] leading-relaxed italic">{coaching.motivation}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Immediate Action */}
      {coaching.immediate_action && (
        <motion.div variants={item}>
          <Card className="bg-gradient-to-r from-[#F39C12]/10 to-[#E67E22]/10 border-2 border-[#F39C12]/30">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-[#F39C12]" />
              <h3 className="font-semibold text-[#1A1A1A]">Do This Today</h3>
            </div>
            <p className="text-sm text-[#666666] ml-8">{coaching.immediate_action}</p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}