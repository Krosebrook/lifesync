import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Sunrise, Sunset, Award, ArrowRight, Target, BookOpen, TrendingUp, Flame, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import HabitQuickView from '../components/dashboard/HabitQuickView';
import QuickStats from '../components/dashboard/QuickStats';

const timeOfDayGreetings = {
  morning: {
    icon: Sunrise,
    title: "Morning Clarity",
    subtitle: "A new day begins with intention",
    bgImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
    theme: "from-amber-900/40 to-orange-800/60"
  },
  afternoon: {
    icon: Sun,
    title: "Midday Flow",
    subtitle: "Momentum carries you forward",
    bgImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    theme: "from-blue-900/40 to-cyan-800/60"
  },
  evening: {
    icon: Moon,
    title: "Evening Reflection",
    subtitle: "The day is done. Look back and grow.",
    bgImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    theme: "from-indigo-900/40 to-purple-800/60"
  }
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentHour = new Date().getHours();

  // Determine time of day
  const getTimeOfDay = () => {
    if (currentHour >= 5 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 22) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  const timeOfDayConfig = {
    morning: {
      title: 'Morning Momentum',
      subtitle: 'Enter your flow state before the world wakes up.',
      icon: Sun,
      gradient: 'from-orange-400/20 via-yellow-400/20 to-pink-400/20',
      action: 'Start Your Day',
      image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80'
    },
    afternoon: {
      title: 'Midday Check-In',
      subtitle: 'Pause, breathe, and realign with your intentions.',
      icon: Sun,
      gradient: 'from-blue-400/20 via-cyan-400/20 to-teal-400/20',
      action: 'Review Progress',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'
    },
    evening: {
      title: 'Evening Reflection',
      subtitle: 'The day winds down. What did you learn?',
      icon: Sunset,
      gradient: 'from-purple-400/20 via-pink-400/20 to-orange-400/20',
      action: 'Reflect on Today',
      image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&q=80'
    },
    night: {
      title: 'Silent Night',
      subtitle: 'The day is done. Take a breath and look back at your growth.',
      icon: Moon,
      gradient: 'from-indigo-900/40 via-blue-900/40 to-purple-900/40',
      action: 'Evening Journal',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80'
    }
  };

  const config = timeOfDayConfig[timeOfDay];

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.filter({ is_active: true }),
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habitLogs', today],
    queryFn: () => base44.entities.HabitLog.filter({ date: today }),
  });

  const { data: allLogs = [] } = useQuery({
    queryKey: ['allHabitLogs'],
    queryFn: () => base44.entities.HabitLog.list('-date', 100),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 10),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: gamificationProfiles = [] } = useQuery({
    queryKey: ['gamificationProfile'],
    queryFn: () => base44.entities.GamificationProfile.list(),
  });

  const createHabitLogMutation = useMutation({
    mutationFn: (data) => base44.entities.HabitLog.create(data),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const deleteHabitLogMutation = useMutation({
    mutationFn: (id) => base44.entities.HabitLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['habitLogs']),
  });

  const handleToggleHabit = async (habitId) => {
    const existingLog = todayLogs.find(log => log.habit_id === habitId);
    if (existingLog) {
      await deleteHabitLogMutation.mutateAsync(existingLog.id);
    } else {
      await createHabitLogMutation.mutateAsync({ habit_id: habitId, date: today, completed: true });
    }
  };

  const gamProfile = gamificationProfiles[0];

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <style>{`
        .vignette {
          background: radial-gradient(circle at center, transparent 30%, rgba(10, 14, 39, 0.8) 100%);
        }
        .ghost-card {
          background: linear-gradient(135deg, rgba(77, 208, 225, 0.05) 0%, rgba(77, 208, 225, 0.01) 100%);
          border: 1px solid rgba(77, 208, 225, 0.15);
          backdrop-filter: blur(8px);
        }
        .glow-text {
          text-shadow: 0 0 20px rgba(77, 208, 225, 0.3);
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-50"
          style={{ backgroundImage: `url(${config.image})` }}
        />
        <div className="absolute inset-0 vignette" />
        <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient}`} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-[#4DD0E1]/30">
              <config.icon className="w-10 h-10 text-[#4DD0E1]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 glow-text tracking-tight">
              {config.title}
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-12 font-light">
              {config.subtitle}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
              <div className="ghost-card p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-white mb-1">{todayLogs.length}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">Today</p>
              </div>
              <div className="ghost-card p-4 rounded-xl text-center border-[#4DD0E1]/30">
                <p className="text-3xl font-bold text-[#4DD0E1] mb-1">{gamProfile?.level || 1}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">Level</p>
              </div>
              <div className="ghost-card p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-white mb-1">{achievements.length}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">Badges</p>
              </div>
            </div>
            <Link to={createPageUrl(timeOfDay === 'night' ? 'Journal' : 'Habits')}>
              <Button size="lg" className="text-lg px-8 py-4">
                {config.action}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <p className="text-[10px] text-white uppercase tracking-widest">Scroll to continue</p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 animate-bounce">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-32 px-6 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Today's Habits - Narrative Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <p className="text-[#4DD0E1] text-xs font-bold tracking-widest uppercase mb-2">Your Daily Anchors</p>
              <h2 className="text-2xl font-bold text-white">Today's Focus</h2>
            </div>

            <div className="space-y-3">
              {habits.slice(0, 5).map((habit, index) => {
                const isCompleted = todayLogs.some(log => log.habit_id === habit.id);
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`ghost-card p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                      isCompleted ? 'border-[#4DD0E1] bg-[#4DD0E1]/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
                        isCompleted 
                          ? 'bg-[#4DD0E1]/20 border-[#4DD0E1]' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-7 h-7 text-[#4DD0E1]" />
                        ) : (
                          <span className="text-3xl">{habit.icon || '📌'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs uppercase tracking-widest mb-1 ${
                          isCompleted ? 'text-[#4DD0E1]' : 'text-white/50'
                        }`}>
                          {isCompleted ? 'Completed' : 'Pending'}
                        </p>
                        <p className="text-white text-lg font-bold">{habit.name}</p>
                        {habit.current_streak > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <p className="text-orange-400 text-sm">{habit.current_streak} day streak</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {habits.length > 5 && (
              <Link to={createPageUrl('Habits')}>
                <button className="w-full mt-4 py-3 ghost-card rounded-xl text-[#4DD0E1] font-medium text-sm hover:bg-[#4DD0E1]/10 transition-all">
                  View All Habits →
                </button>
              </Link>
            )}
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-[#4DD0E1] text-xs font-bold tracking-widest uppercase mb-4">Quick Access</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl('Journal')}>
                <div className="ghost-card p-6 rounded-xl hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/30 group-hover:border-purple-500/60 transition-all">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-white font-bold mb-1">Journal</p>
                  <p className="text-white/50 text-sm">{journalEntries.length} entries</p>
                </div>
              </Link>

              <Link to={createPageUrl('Goals')}>
                <div className="ghost-card p-6 rounded-xl hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30 group-hover:border-blue-500/60 transition-all">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white font-bold mb-1">Goals</p>
                  <p className="text-white/50 text-sm">Track progress</p>
                </div>
              </Link>

              <Link to={createPageUrl('Coach')}>
                <div className="ghost-card p-6 rounded-xl hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-white font-bold mb-1">AI Coach</p>
                  <p className="text-white/50 text-sm">Get guidance</p>
                </div>
              </Link>

              <Link to={createPageUrl('Gamification')}>
                <div className="ghost-card p-6 rounded-xl hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30 group-hover:border-amber-500/60 transition-all">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-white font-bold mb-1">Rewards</p>
                  <p className="text-white/50 text-sm">{achievements.length} badges</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Closing Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-white/40 text-sm italic max-w-md mx-auto">
              "Structure isn't rigid. It's the invisible framework that gives you freedom to grow."
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#4DD0E1]/40 to-transparent mx-auto mt-6" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}