import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import Card from '../shared/Card';

const typeIcons = {
  meditation: '🧘',
  breathing: '💨',
  soundscape: '🎵'
};

export default function PracticeHistory({ practices = [] }) {
  if (practices.length === 0) {
    return (
      <Card className="text-center py-12">
        <Calendar className="w-12 h-12 text-[#999] mx-auto mb-4 opacity-50" />
        <p className="text-[#666666]">No practice history yet</p>
      </Card>
    );
  }

  const groupedByDate = practices.reduce((groups, practice) => {
    const date = format(new Date(practice.date), 'MMM d, yyyy');
    if (!groups[date]) groups[date] = [];
    groups[date].push(practice);
    return groups;
  }, {});

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {Object.entries(groupedByDate).map(([date, dayPractices]) => (
        <motion.div key={date} variants={item}>
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-4 h-4 text-[#1ABC9C]" />
            <h3 className="font-semibold text-[#1A1A1A]">{date}</h3>
          </div>

          <div className="space-y-2 ml-7">
            {dayPractices.map((practice, idx) => {
              const moodChange = practice.mood_after - practice.mood_before;
              const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card padding="p-3" className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{typeIcons[practice.type]}</span>
                        <div>
                          <p className="font-medium text-[#1A1A1A] text-sm">
                            {practice.technique}
                          </p>
                          <p className="text-xs text-[#999]">
                            {practice.duration} min
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div className="text-xs">
                        <div className="flex items-center gap-1">
                          <span>{moodEmojis[practice.mood_before - 1]}</span>
                          <span className="text-[#999]">→</span>
                          <span>{moodEmojis[practice.mood_after - 1]}</span>
                        </div>
                        {moodChange > 0 && (
                          <div className="flex items-center gap-1 text-green-600 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            +{moodChange}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}