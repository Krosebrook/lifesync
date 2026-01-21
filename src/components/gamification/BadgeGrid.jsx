import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown } from 'lucide-react';
import Card from '../shared/Card';

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-yellow-500'
};

const rarityBorders = {
  common: 'border-gray-300',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-amber-400'
};

export default function BadgeGrid({ badges, userBadges, isPremium }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  const getBadgeProgress = (badgeId) => {
    const userBadge = userBadges?.find(ub => ub.badge_id === badgeId);
    return userBadge?.progress || 0;
  };

  const isBadgeEarned = (badgeId) => {
    return getBadgeProgress(badgeId) >= 100;
  };

  const categories = ['streak', 'goal', 'milestone', 'community', 'premium'];

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const categoryBadges = badges.filter(b => b.category === category);
        if (categoryBadges.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 capitalize">
              {category} Badges
            </h3>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {categoryBadges.map((badge) => {
                const earned = isBadgeEarned(badge.id);
                const progress = getBadgeProgress(badge.id);
                const locked = badge.is_premium && !isPremium;

                return (
                  <motion.div key={badge.id} variants={item}>
                    <Card 
                      padding="p-4"
                      className={`text-center relative border-2 ${
                        earned ? rarityBorders[badge.rarity] : 'border-[#E5D9CC]'
                      } ${locked ? 'opacity-50' : ''}`}
                    >
                      {locked && (
                        <div className="absolute top-2 right-2">
                          <Crown className="w-4 h-4 text-amber-500" />
                        </div>
                      )}

                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        earned 
                          ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
                          : 'bg-gray-200'
                      }`}>
                        {earned || progress > 0 ? (
                          <span className="text-3xl">{badge.icon}</span>
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <h4 className="font-semibold text-sm text-[#1A1A1A] mb-1">
                        {badge.name}
                      </h4>
                      <p className="text-xs text-[#666] mb-2">{badge.description}</p>

                      {!earned && progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#1ABC9C] h-1.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-[#999] mt-1">{Math.round(progress)}%</p>
                        </div>
                      )}

                      {earned && (
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 bg-gradient-to-r ${rarityColors[badge.rarity]} text-white font-semibold`}>
                          {badge.rarity.toUpperCase()}
                        </span>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}