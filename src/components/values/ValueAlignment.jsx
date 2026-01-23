import React from 'react';
import { Heart, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';
import { motion } from 'framer-motion';

export default function ValueAlignment({ values, habits, goals, journalEntries }) {
  // Calculate alignment score for each value
  const valueStats = values.map(value => {
    const linkedHabits = habits.filter(h => h.value_ids?.includes(value.id));
    const linkedGoals = goals.filter(g => g.value_id === value.id);
    const linkedEntries = journalEntries.filter(e => e.value_ids?.includes(value.id));
    
    const totalActivities = linkedHabits.length + linkedGoals.length + linkedEntries.length;
    
    return {
      value,
      linkedHabits,
      linkedGoals,
      linkedEntries,
      totalActivities,
      alignmentScore: totalActivities
    };
  });

  // Sort by alignment score
  const sortedValues = [...valueStats].sort((a, b) => b.alignmentScore - a.alignmentScore);
  
  const maxScore = Math.max(...valueStats.map(v => v.alignmentScore), 1);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="w-12 h-px bg-[#FF6B35] mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Newsreader, serif' }}>
          Value Alignment
        </h2>
        <p className="text-[#9A9A9A]">How your actions connect to what matters</p>
      </div>

      {sortedValues.length === 0 ? (
        <Card className="text-center py-12">
          <Heart className="w-12 h-12 text-[#666666] mx-auto mb-4" />
          <p className="text-[#9A9A9A]">Define your core values to see alignment</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedValues.map((stat, index) => (
            <motion.div
              key={stat.value.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl">
                    {stat.value.icon || '⭐'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{stat.value.name}</h3>
                      <span className="text-[#FF6B35] font-bold">{stat.totalActivities}</span>
                    </div>
                    
                    {stat.value.description && (
                      <p className="text-sm text-[#9A9A9A] mb-4">{stat.value.description}</p>
                    )}

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.alignmentScore / maxScore) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFB088]"
                        />
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {stat.linkedGoals.length > 0 && (
                        <div className="flex items-center gap-2 text-[#9A9A9A]">
                          <TrendingUp className="w-4 h-4" />
                          <span>{stat.linkedGoals.length} goal{stat.linkedGoals.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {stat.linkedHabits.length > 0 && (
                        <div className="flex items-center gap-2 text-[#9A9A9A]">
                          <span>🔁</span>
                          <span>{stat.linkedHabits.length} habit{stat.linkedHabits.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {stat.linkedEntries.length > 0 && (
                        <div className="flex items-center gap-2 text-[#9A9A9A]">
                          <span>📝</span>
                          <span>{stat.linkedEntries.length} entr{stat.linkedEntries.length > 1 ? 'ies' : 'y'}</span>
                        </div>
                      )}
                    </div>

                    {stat.totalActivities === 0 && (
                      <p className="text-xs text-[#666666] italic mt-2">
                        No activities linked yet. This value might need more attention.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}