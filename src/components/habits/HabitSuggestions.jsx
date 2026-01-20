import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const categoryIcons = {
  health: '💪',
  productivity: '⚡',
  mindfulness: '🧘',
  learning: '📚',
  relationships: '❤️',
  finance: '💰',
  other: '✨'
};

export default function HabitSuggestions({ suggestions, values, onAccept, onClose }) {
  const getValueById = (valueId) => values.find(v => v.id === valueId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl my-8"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#1ABC9C]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                AI-Suggested Habits
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#666666] hover:text-[#1A1A1A] transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-[#666666] mb-6">
            Based on your core values, active goals, and current habits, here are personalized recommendations:
          </p>

          <div className="space-y-4">
            {suggestions.map((suggestion, index) => {
              const value = getValueById(suggestion.value_id);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-[#FAFAFA]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{suggestion.icon}</span>
                          <h3 className="text-lg font-semibold text-[#1A1A1A]">
                            {suggestion.name}
                          </h3>
                          {suggestion.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0E5D8] text-[#666666] capitalize">
                              {categoryIcons[suggestion.category]} {suggestion.category}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[#666666] mb-2">
                          {suggestion.description}
                        </p>

                        {suggestion.done_criteria && (
                          <p className="text-xs text-[#999999] mb-3">
                            ✓ {suggestion.done_criteria}
                          </p>
                        )}

                        {value && (
                          <div className="flex items-center gap-2 mb-3">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${value.color}20`,
                                color: value.color 
                              }}
                            >
                              {value.icon} {value.name}
                            </span>
                            {suggestion.frequency && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1ABC9C]/10 text-[#1ABC9C] capitalize">
                                {suggestion.frequency === 'custom' 
                                  ? `${suggestion.times_per_week}x per week`
                                  : suggestion.frequency
                                }
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-3 bg-[#1ABC9C]/5 rounded-[8px]">
                          <p className="text-xs text-[#1ABC9C] font-medium mb-1">Why this habit?</p>
                          <p className="text-xs text-[#666666]">{suggestion.why}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => onAccept(suggestion)}
                        size="sm"
                        icon={Plus}
                        variant="primary"
                      >
                        Add
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}