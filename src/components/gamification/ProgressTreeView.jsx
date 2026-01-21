import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Crown, Brain, Target, BookOpen, Heart, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const categoryIcons = {
  mindfulness: Brain,
  habits: Target,
  goals: Target,
  journaling: BookOpen,
  wellbeing: Heart
};

const categoryColors = {
  mindfulness: 'from-purple-400 to-purple-600',
  habits: 'from-green-400 to-green-600',
  goals: 'from-blue-400 to-blue-600',
  journaling: 'from-amber-400 to-amber-600',
  wellbeing: 'from-pink-400 to-pink-600'
};

export default function ProgressTreeView({ nodes, userNodes, isPremium, onUpgrade }) {
  if (!isPremium) {
    return (
      <Card className="text-center py-12 bg-gradient-to-br from-amber-50 to-yellow-50">
        <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Premium Feature</h3>
        <p className="text-[#666] mb-6 max-w-md mx-auto">
          Unlock the Progress Tree to visualize your wellbeing journey and earn exclusive rewards
        </p>
        <Button onClick={onUpgrade} variant="primary" className="bg-gradient-to-r from-amber-400 to-yellow-500">
          <Crown className="w-5 h-5 mr-2" />
          Upgrade to Premium
        </Button>
      </Card>
    );
  }

  const groupedByLevel = nodes.reduce((acc, node) => {
    if (!acc[node.level]) acc[node.level] = [];
    acc[node.level].push(node);
    return acc;
  }, {});

  const isNodeUnlocked = (nodeId) => {
    return userNodes?.some(un => un.node_id === nodeId && un.is_unlocked);
  };

  const canUnlock = (node) => {
    if (!node.dependencies || node.dependencies.length === 0) return true;
    return node.dependencies.every(depId => isNodeUnlocked(depId));
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedByLevel)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([level, levelNodes]) => (
          <div key={level}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                {level}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Tier {level}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelNodes.map((node) => {
                const unlocked = isNodeUnlocked(node.node_id);
                const available = canUnlock(node);
                const Icon = categoryIcons[node.category] || Sparkles;

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card
                      className={`relative border-2 ${
                        unlocked
                          ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                          : available
                          ? 'border-[#E5D9CC] hover:border-[#1ABC9C]'
                          : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            unlocked
                              ? 'bg-gradient-to-br from-green-400 to-green-600'
                              : available
                              ? `bg-gradient-to-br ${categoryColors[node.category]}`
                              : 'bg-gray-200'
                          }`}
                        >
                          {unlocked ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : available ? (
                            <Icon className="w-6 h-6 text-white" />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1A1A1A] mb-1">{node.name}</h4>
                          <p className="text-xs text-[#666] mb-2">
                            {node.requirements?.description || 'Complete to unlock'}
                          </p>

                          {node.rewards && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {node.rewards.points && (
                                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                                  +{node.rewards.points} pts
                                </span>
                              )}
                              {node.rewards.badge && (
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                  {node.rewards.badge}
                                </span>
                              )}
                            </div>
                          )}

                          {unlocked && node.unlocked_date && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Unlocked {new Date(node.unlocked_date).toLocaleDateString()}
                            </p>
                          )}

                          {!unlocked && !available && (
                            <p className="text-xs text-[#999]">
                              Unlock previous nodes first
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}