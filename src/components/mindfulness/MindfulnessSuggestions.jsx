import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function MindfulnessSuggestions({ suggestions, insights, onAccept, onClose }) {
  const getMoodEmoji = (mood) => {
    if (mood < 2) return '😔';
    if (mood < 3) return '😐';
    if (mood < 4) return '🙂';
    return '😊';
  };

  const getStressColor = (level) => {
    switch(level) {
      case 'high': return '#E74C3C';
      case 'moderate': return '#F39C12';
      default: return '#27AE60';
    }
  };

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
              <Sparkles className="w-6 h-6 text-[#4DD0E1]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Personalized Mindfulness Recommendations
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#666666] hover:text-[#1A1A1A] transition-colors"
            >
              ✕
            </button>
          </div>

          {insights && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[#F0E5D8] rounded-[12px] text-center">
                <p className="text-3xl mb-2">{getMoodEmoji(insights.avgMood)}</p>
                <p className="text-sm text-[#666666]">Avg Mood</p>
                <p className="text-xl font-bold text-[#1A1A1A]">{insights.avgMood}/5</p>
              </div>
              <div 
                className="p-4 rounded-[12px] text-center"
                style={{ backgroundColor: `${getStressColor(insights.stressLevel)}20` }}
              >
                <AlertCircle 
                  className="w-8 h-8 mx-auto mb-2" 
                  style={{ color: getStressColor(insights.stressLevel) }}
                />
                <p className="text-sm text-[#666666]">Stress Level</p>
                <p className="text-lg font-bold capitalize" style={{ color: getStressColor(insights.stressLevel) }}>
                  {insights.stressLevel}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-[12px] text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-[#666666]">Habits Needing Support</p>
                <p className="text-xl font-bold text-blue-600">{insights.strugglingHabitsCount}</p>
              </div>
            </div>
          )}

          <p className="text-[#666666] mb-6">
            Based on your mood patterns and stress levels, here are mindfulness practices tailored for you:
          </p>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#FAFAFA]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4DD0E1]/10 text-[#4DD0E1] capitalize">
                          {suggestion.type}
                        </span>
                        <span className="px-2 py-1 bg-[#1ABC9C]/10 text-[#1ABC9C] text-xs rounded-full">
                          {suggestion.duration} min
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        {suggestion.name}
                      </h3>

                      <p className="text-sm text-[#666666] mb-3">
                        {suggestion.description}
                      </p>

                      <div className="mb-3">
                        <p className="text-xs text-[#999999] mb-1">Benefits:</p>
                        <p className="text-sm text-[#1ABC9C]">{suggestion.benefits}</p>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-[#999999] mb-1">When to use:</p>
                        <p className="text-sm text-[#666666]">{suggestion.when_to_use}</p>
                      </div>

                      <div className="p-3 bg-[#4DD0E1]/5 rounded-[8px] mb-3">
                        <p className="text-xs text-[#4DD0E1] font-medium mb-1">Why recommended for you:</p>
                        <p className="text-xs text-[#666666]">{suggestion.why_recommended}</p>
                      </div>

                      {suggestion.instructions && (
                        <details className="text-xs text-[#666666]">
                          <summary className="cursor-pointer text-[#1ABC9C] font-medium mb-1">
                            View Instructions
                          </summary>
                          <p className="mt-2 p-2 bg-white rounded-[8px]">{suggestion.instructions}</p>
                        </details>
                      )}
                    </div>
                    <Button
                      onClick={() => onAccept(suggestion)}
                      size="sm"
                      variant="primary"
                    >
                      Try Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
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