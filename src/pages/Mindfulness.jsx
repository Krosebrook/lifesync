import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Volume2, Brain, TrendingUp, Star } from 'lucide-react';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import MeditationCard from '../components/mindfulness/MeditationCard';
import BreathingExercise from '../components/mindfulness/BreathingExercise';
import SoundscapeCard from '../components/mindfulness/SoundscapeCard';
import MindfulnessSuggestions from '../components/mindfulness/MindfulnessSuggestions';
import PointsAnimation from '../components/gamification/PointsAnimation';
import LevelUpModal from '../components/gamification/LevelUpModal';
import MeditationLibraryBrowser from '../components/mindfulness/MeditationLibraryBrowser';
import FavoritePractices from '../components/mindfulness/FavoritePractices';
import PracticeHistory from '../components/mindfulness/PracticeHistory';

// Predefined practices
const meditations = [
  {
    name: 'Body Scan Meditation',
    duration: 15,
    type: 'meditation',
    description: 'Progressive relaxation through body awareness',
    benefits: 'Reduces tension, improves sleep',
    when_to_use: 'Evening or before bed',
    instructions: '1. Lie down comfortably\n2. Focus on each body part from toes to head\n3. Notice sensations without judgment\n4. Breathe deeply as you scan'
  },
  {
    name: 'Loving-Kindness Meditation',
    duration: 10,
    type: 'meditation',
    description: 'Cultivate compassion for self and others',
    benefits: 'Increases empathy, reduces negative emotions',
    when_to_use: 'Morning or when feeling disconnected',
    instructions: '1. Sit comfortably\n2. Send good wishes to yourself\n3. Extend to loved ones\n4. Include all beings'
  },
  {
    name: 'Mindful Breathing',
    duration: 5,
    type: 'meditation',
    description: 'Simple breath awareness practice',
    benefits: 'Quick stress relief, improves focus',
    when_to_use: 'Anytime, especially during stress',
    instructions: '1. Find a comfortable position\n2. Focus on your natural breath\n3. Notice the sensation of breathing\n4. Gently return when mind wanders'
  }
];

const breathingExercises = [
  {
    name: 'Box Breathing',
    duration: 5,
    type: 'breathing',
    description: 'Inhale 4, hold 4, exhale 4, hold 4',
    benefits: 'Calms nervous system, improves focus',
    when_to_use: 'Before important meetings or stressful moments'
  },
  {
    name: '4-7-8 Breathing',
    duration: 5,
    type: 'breathing',
    description: 'Inhale 4, hold 7, exhale 8',
    benefits: 'Promotes sleep, reduces anxiety',
    when_to_use: 'Before bed or when anxious'
  },
  {
    name: 'Calm Breathing',
    duration: 5,
    type: 'breathing',
    description: 'Slow, deep breathing at your own pace',
    benefits: 'General relaxation and stress relief',
    when_to_use: 'Anytime you need to relax'
  },
  {
    name: 'Energizing Breath',
    duration: 3,
    type: 'breathing',
    description: 'Quick, rhythmic breathing',
    benefits: 'Boosts energy and alertness',
    when_to_use: 'Morning or midday energy slump'
  }
];

const soundscapes = [
  {
    name: 'Rain',
    type: 'soundscape',
    description: 'Gentle rainfall for deep relaxation',
    benefits: 'Sleep aid, stress relief',
    when_to_use: 'Sleep or deep focus'
  },
  {
    name: 'Ocean Waves',
    type: 'soundscape',
    description: 'Rhythmic waves for calming',
    benefits: 'Anxiety reduction, meditation aid',
    when_to_use: 'Meditation or relaxation'
  },
  {
    name: 'Forest',
    type: 'soundscape',
    description: 'Birds and nature sounds',
    benefits: 'Mental clarity, connection with nature',
    when_to_use: 'Work or creative tasks'
  },
  {
    name: 'Cafe Ambience',
    type: 'soundscape',
    description: 'Cozy coffee shop atmosphere',
    benefits: 'Productivity boost, creativity',
    when_to_use: 'Work or study sessions'
  }
];

export default function Mindfulness() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedTab, setSelectedTab] = useState('library');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [moodBefore, setMoodBefore] = useState(3);
  const [moodAfter, setMoodAfter] = useState(null);
  const [currentPractice, setCurrentPractice] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [levelUp, setLevelUp] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Queries
  const { data: practices = [] } = useQuery({
    queryKey: ['mindfulnessPractices'],
    queryFn: () => base44.entities.MindfulnessPractice.list('-date', 50),
  });

  const { data: libraryPractices = [] } = useQuery({
    queryKey: ['meditationLibrary'],
    queryFn: () => base44.entities.MeditationLibrary.list(),
  });

  // Filter library: free users see only beginner, premium see all
  const availablePractices = isPremium 
    ? libraryPractices 
    : libraryPractices.filter(p => p.difficulty === 'beginner' || !p.difficulty);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.list();
      return profiles[0];
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.list();
      return subs[0];
    },
  });

  const isPremium = subscription && ['premium', 'pro'].includes(subscription.tier) && subscription.status === 'active';

  const createPracticeMutation = useMutation({
    mutationFn: (data) => base44.entities.MindfulnessPractice.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mindfulnessPractices']);
      setCurrentPractice(null);
      setMoodAfter(null);
    },
  });

  const awardPoints = async (action) => {
    try {
      const response = await base44.functions.invoke('awardPoints', { action });
      if (response.data.success) {
        setPointsEarned(response.data.pointsEarned);
        setShowPoints(true);
        if (response.data.leveledUp) {
          setLevelUp(response.data.level);
        }
        queryClient.invalidateQueries(['gamificationProfile']);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const handleStartPractice = (practice) => {
    setCurrentPractice(practice);
  };

  const handleCompletePractice = async (practice) => {
    // Award points
    await awardPoints('mindfulness_complete');
    
    // Show mood after prompt
    if (moodAfter !== null) {
      createPracticeMutation.mutate({
        date: today,
        type: practice.type,
        technique: practice.name,
        duration: practice.duration || practice.cycles || 5,
        mood_before: moodBefore,
        mood_after: moodAfter,
        notes: ''
      });
    } else {
      // Prompt for mood after
      const mood = prompt('How do you feel now? (1-5)');
      if (mood) {
        setMoodAfter(parseInt(mood));
        createPracticeMutation.mutate({
          date: today,
          type: practice.type,
          technique: practice.name,
          duration: practice.duration || practice.cycles || 5,
          mood_before: moodBefore,
          mood_after: parseInt(mood)
        });
      }
    }
  };

  const loadAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.functions.invoke('generateMindfulnessSuggestions', {});
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
        setInsights(response.data.insights);
        setShowSuggestions(true);
      } else {
        alert(response.data.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      alert('Failed to generate suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = (suggestion) => {
    setShowSuggestions(false);
    setSelectedTab('library');
  };

  const toggleFavorite = async (practiceId) => {
    const newFavorites = favorites.includes(practiceId)
      ? favorites.filter(id => id !== practiceId)
      : [...favorites, practiceId];
    
    setFavorites(newFavorites);
    
    // Update user profile with favorites
    if (userProfile) {
      await base44.entities.UserProfile.update(userProfile.id, {
        ...userProfile,
        favorite_practices: newFavorites
      });
      queryClient.invalidateQueries(['userProfile']);
    }
  };

  // Load favorites from profile
  React.useEffect(() => {
    if (userProfile?.favorite_practices) {
      setFavorites(userProfile.favorite_practices);
    }
  }, [userProfile]);

  // Stats
  const totalMinutes = practices.reduce((sum, p) => sum + (p.duration || 0), 0);
  const practiceCount = practices.length;
  const avgMoodImprovement = practices.length > 0
    ? (practices.reduce((sum, p) => sum + ((p.mood_after || 0) - (p.mood_before || 0)), 0) / practices.length).toFixed(1)
    : 0;

  const tabs = [
    { id: 'library', label: 'Library', icon: Brain },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'history', label: 'History', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] p-6 md:p-8 grain">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="w-8 h-px bg-[#FF6B35] mb-3" />
          <h1 className="text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'Newsreader, serif' }}>Practice</h1>
          <p className="text-[#9A9A9A] mt-1">Pause, breathe, notice</p>
        </div>
        <Button 
          onClick={loadAISuggestions}
          icon={Sparkles}
          variant="outline"
          loading={loadingSuggestions}
        >
          Get AI Suggestions
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4DD0E1]/10 rounded-[12px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#4DD0E1]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{practiceCount}</p>
              <p className="text-sm text-[#666666]">Sessions</p>
            </div>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#1ABC9C]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{totalMinutes}</p>
              <p className="text-sm text-[#666666]">Total Minutes</p>
            </div>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-[12px] flex items-center justify-center">
              <span className="text-xl">😊</span>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">+{avgMoodImprovement}</p>
              <p className="text-sm text-[#666666]">Avg Mood Lift</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#E5D9CC]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
              selectedTab === tab.id
                ? 'text-[#1ABC9C] border-b-2 border-[#1ABC9C]'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <MeditationLibraryBrowser
              practices={availablePractices}
              onStart={handleStartPractice}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {selectedTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FavoritePractices
              favorites={favorites}
              practices={libraryPractices}
              onStart={handleStartPractice}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        )}

        {selectedTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PracticeHistory practices={practices} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <MindfulnessSuggestions
            suggestions={suggestions}
            insights={insights}
            onAccept={handleAcceptSuggestion}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </AnimatePresence>

      {/* Points Animation */}
      <PointsAnimation 
        points={pointsEarned}
        show={showPoints}
        onComplete={() => setShowPoints(false)}
      />

      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUp && (
          <LevelUpModal
            level={levelUp}
            onClose={() => setLevelUp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}