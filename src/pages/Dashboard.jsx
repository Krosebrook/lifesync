import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Sunset, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import HabitQuickView from '../components/dashboard/HabitQuickView';
import QuickStats from '../components/dashboard/QuickStats';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.image})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} backdrop-blur-[2px]`} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27]/60 via-[#0A0E27]/40 to-[#0A0E27]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <config.icon className="w-16 h-16 mx-auto mb-6 text-[#4DD0E1]" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {config.title}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {config.subtitle}
            </p>
            <Link to={createPageUrl(timeOfDay === 'night' ? 'Journal' : 'Habits')}>
              <Button size="lg" className="text-lg px-8 py-4">
                {config.action}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-20 px-6 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Gamification Banner */}
          {gamProfile && (
            <Card variant="glass" className="border-2 border-[#4DD0E1]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#B0B8D4] text-sm mb-1">Your Level</p>
                  <p className="text-5xl font-bold text-white">{gamProfile.level}</p>
                  <p className="text-[#B0B8D4] text-sm mt-2">
                    {gamProfile.total_points} XP • {Math.floor((gamProfile.total_points % 100))} / 100 to next level
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <Award className="w-10 h-10 mx-auto mb-2 text-[#4DD0E1]" />
                    <p className="text-3xl font-bold text-white">{achievements.length}</p>
                    <p className="text-xs text-[#B0B8D4]">Badges</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Habits */}
          <HabitQuickView 
            habits={habits}
            todayLogs={todayLogs}
            onToggleHabit={handleToggleHabit}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={createPageUrl('Coach')}>
              <Card hover className="h-full">
                <Sparkles className="w-8 h-8 text-[#4DD0E1] mb-3" />
                <h3 className="text-white font-semibold mb-1">Talk to Coach</h3>
                <p className="text-[#B0B8D4] text-sm">Get personalized guidance</p>
              </Card>
            </Link>
            <Link to={createPageUrl('Journal')}>
              <Card hover className="h-full">
                <Moon className="w-8 h-8 text-[#4DD0E1] mb-3" />
                <h3 className="text-white font-semibold mb-1">Journal</h3>
                <p className="text-[#B0B8D4] text-sm">Reflect on your day</p>
              </Card>
            </Link>
            <Link to={createPageUrl('Progress')}>
              <Card hover className="h-full">
                <Award className="w-8 h-8 text-[#4DD0E1] mb-3" />
                <h3 className="text-white font-semibold mb-1">Progress</h3>
                <p className="text-[#B0B8D4] text-sm">View your achievements</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}