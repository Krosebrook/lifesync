import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Lock } from 'lucide-react';

import { ALL_ACHIEVEMENTS, CATEGORY_ICONS } from '../components/achievements/achievementConstants.js';
import OverallProgress from '../components/achievements/OverallProgress';
import AchievementGrid from '../components/achievements/AchievementGrid';
import UnlockedAchievement from '../components/achievements/UnlockedAchievement';
import LockedAchievement from '../components/achievements/LockedAchievement';

export default function Achievements() {
  // Data fetching - only achievements needed for display
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
  });

  // Memoized achievement categorization logic
  const { unlockedAchievements, lockedAchievements, achievementsByType, completionRate } = useMemo(() => {
    const unlockedNames = new Set(achievements.map(a => a.name));
    const unlocked = ALL_ACHIEVEMENTS.filter(a => unlockedNames.has(a.name));
    const locked = ALL_ACHIEVEMENTS.filter(a => !unlockedNames.has(a.name));

    // Group unlocked achievements by type
    const byType = {
      streak: unlocked.filter(a => a.type === 'streak'),
      milestone: unlocked.filter(a => a.type === 'milestone'),
      badge: unlocked.filter(a => a.type === 'badge')
    };

    const rate = Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100);

    return {
      unlockedAchievements: unlocked,
      lockedAchievements: locked,
      achievementsByType: byType,
      completionRate: rate
    };
  }, [achievements]);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Achievements</h1>
        <p className="text-[#666666] mt-1">Your journey of personal growth</p>
      </header>

      {/* Overall Progress - Extracted to component */}
      <OverallProgress 
        completionRate={completionRate}
        unlockedCount={unlockedAchievements.length}
        totalCount={ALL_ACHIEVEMENTS.length}
        achievementsByType={achievementsByType}
      />

      {/* Unlocked Achievements Section */}
      {unlockedAchievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F39C12]" />
            Earned Achievements
          </h2>
          
          <AchievementGrid>
            {unlockedAchievements.map((achievement, index) => {
              const unlockedData = achievements.find(a => a.name === achievement.name);
              const Icon = CATEGORY_ICONS[achievement.type];
              
              return (
                <UnlockedAchievement
                  key={achievement.name}
                  achievement={achievement}
                  unlockedDate={unlockedData?.unlocked_date}
                  Icon={Icon}
                  index={index}
                />
              );
            })}
          </AchievementGrid>
        </section>
      )}

      {/* Locked Achievements Section */}
      <section>
        <h2 className="text-xl font-semibold text-[#666666] mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Locked ({lockedAchievements.length})
        </h2>
        
        <AchievementGrid columns="md:grid-cols-2 lg:grid-cols-4">
          {lockedAchievements.map((achievement, index) => {
            const Icon = CATEGORY_ICONS[achievement.type];
            
            return (
              <LockedAchievement
                key={achievement.name}
                achievement={achievement}
                Icon={Icon}
                index={index}
              />
            );
          })}
        </AchievementGrid>
      </section>
    </div>
  );
}