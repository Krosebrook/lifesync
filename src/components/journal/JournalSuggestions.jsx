import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Brain } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function JournalSuggestions({ suggestions, insights, onAcceptHabit, onAcceptMindfulness, onClose }) {
  const habits = suggestions.filter(s => s.type === 'habit');
  const mindfulness = suggestions.filter(s => s.type === 'mindfulness');

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
        className="w-full max-w-3xl my-8"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#9B59B6]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Personalized Suggestions from Your Journal
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
            Based on your journal patterns and emotional themes, here are tailored recommendations:
          </p>

          {habits.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#1ABC9C]" />
                <h3 className="font-semibold text-[#1A1A1A]">Suggested Habits</h3>
              </div>
              <div className="space-y-3">
                {habits.map((habit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-[#FAFAFA]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1A1A1A] mb-2">{habit.name}</h4>
                          <p className="text-sm text-[#666666] mb-3">{habit.description}</p>
                          <div className="p-3 bg-[#1ABC9C]/5 rounded-[8px] mb-2">
                            <p className="text-xs text-[#1ABC9C] font-medium mb-1">Why suggested:</p>
                            <p className="text-xs text-[#666666]">{habit.why_suggested}</p>
                          </div>
                          <p className="text-xs text-[#999999]">
                            Expected: {habit.expected_benefit}
                          </p>
                        </div>
                        <Button
                          onClick={() => onAcceptHabit(habit)}
                          size="sm"
                          variant="primary"
                        >
                          Add
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {mindfulness.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-[#4DD0E1]" />
                <h3 className="font-semibold text-[#1A1A1A]">Suggested Mindfulness Practices</h3>
              </div>
              <div className="space-y-3">
                {mindfulness.map((practice, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-[#FAFAFA]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-[#1A1A1A]">{practice.name}</h4>
                            <span className="px-2 py-1 bg-[#4DD0E1]/10 text-[#4DD0E1] text-xs rounded-full">
                              {practice.duration} min
                            </span>
                          </div>
                          <p className="text-sm text-[#666666] mb-3">{practice.description}</p>
                          <div className="p-3 bg-[#4DD0E1]/5 rounded-[8px] mb-2">
                            <p className="text-xs text-[#4DD0E1] font-medium mb-1">Why suggested:</p>
                            <p className="text-xs text-[#666666]">{practice.why_suggested}</p>
                          </div>
                          <p className="text-xs text-[#999999]">
                            Expected: {practice.expected_benefit}
                          </p>
                        </div>
                        <Button
                          onClick={() => onAcceptMindfulness(practice)}
                          size="sm"
                          variant="primary"
                        >
                          Try
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}