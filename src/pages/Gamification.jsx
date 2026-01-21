import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Award, Crown, TrendingUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import BadgeGrid from '../components/gamification/BadgeGrid';
import Leaderboard from '../components/gamification/Leaderboard';
import ProgressTreeView from '../components/gamification/ProgressTreeView';
import UpgradeModal from '../components/premium/UpgradeModal';

export default function Gamification() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('badges');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.list();
      return subs[0];
    },
  });

  const isPremium = subscription && ['premium', 'pro'].includes(subscription.tier) && subscription.status === 'active';

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => base44.entities.Badge.list(),
  });

  const { data: userBadges = [] } = useQuery({
    queryKey: ['userBadges'],
    queryFn: () => base44.entities.UserBadge.list(),
  });

  const { data: leaderboardEntries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => base44.entities.LeaderboardEntry.list(),
  });

  const { data: progressNodes = [] } = useQuery({
    queryKey: ['progressTree'],
    queryFn: () => base44.entities.ProgressTree.list(),
    enabled: isPremium,
  });

  const { data: gamProfile } = useQuery({
    queryKey: ['gamificationProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.GamificationProfile.list();
      return profiles[0];
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async () => {
      const entry = leaderboardEntries.find(e => e.user_email === user?.email);
      if (entry) {
        return base44.entities.LeaderboardEntry.update(entry.id, {
          is_visible: !entry.is_visible
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leaderboard']);
    },
  });

  // Check badge progress on mount
  useEffect(() => {
    const checkBadges = async () => {
      try {
        await base44.functions.invoke('checkBadgeProgress', {});
        queryClient.invalidateQueries(['userBadges']);
      } catch (error) {
        console.error('Error checking badges:', error);
      }
    };
    if (user) checkBadges();
  }, [user]);

  const tabs = [
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'progress-tree', label: 'Progress Tree', icon: TrendingUp }
  ];

  const earnedBadges = userBadges.filter(ub => ub.progress >= 100).length;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Achievements</h1>
          <p className="text-[#666666] mt-1">Track your progress and compete</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-[12px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{gamProfile?.level || 1}</p>
              <p className="text-sm text-[#666666]">Level</p>
            </div>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-[12px] flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{earnedBadges}</p>
              <p className="text-sm text-[#666666]">Badges</p>
            </div>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-[12px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1A1A1A]">{gamProfile?.total_points || 0}</p>
              <p className="text-sm text-[#666666]">Points</p>
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
            {tab.id === 'progress-tree' && !isPremium && (
              <Crown className="w-4 h-4 text-amber-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'badges' && (
        <BadgeGrid badges={badges} userBadges={userBadges} isPremium={isPremium} />
      )}

      {selectedTab === 'leaderboard' && (
        <Leaderboard
          entries={leaderboardEntries}
          currentUser={user}
          onToggleVisibility={() => toggleVisibilityMutation.mutate()}
        />
      )}

      {selectedTab === 'progress-tree' && (
        <ProgressTreeView
          nodes={progressNodes}
          userNodes={progressNodes}
          isPremium={isPremium}
          onUpgrade={() => setShowUpgrade(true)}
        />
      )}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgrade && (
          <UpgradeModal
            onClose={() => setShowUpgrade(false)}
            feature="Unlock the Progress Tree and advanced challenges"
          />
        )}
      </AnimatePresence>
    </div>
  );
}