import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, Heart, AlertCircle } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function MoodReportCard({ report, onClose }) {
  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'text-green-600 bg-green-50';
    if (trend === 'declining') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMoodEmoji = (mood) => {
    if (mood < 2) return '😔';
    if (mood < 3) return '😐';
    if (mood < 4) return '🙂';
    return '😊';
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
        className="w-full max-w-2xl my-8"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#9B59B6]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                {report.period === 'week' ? 'Weekly' : 'Monthly'} Mood Report
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#666666] hover:text-[#1A1A1A] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#F0E5D8] rounded-[12px] text-center">
              <p className="text-3xl mb-1">{getMoodEmoji(report.avg_mood)}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{report.avg_mood}</p>
              <p className="text-xs text-[#666666]">Avg Mood</p>
            </div>
            <div className="p-4 bg-[#F0E5D8] rounded-[12px] text-center">
              <p className="text-2xl font-bold text-[#1ABC9C]">{report.entry_count}</p>
              <p className="text-xs text-[#666666]">Journal Entries</p>
            </div>
            <div className="p-4 bg-[#F0E5D8] rounded-[12px] text-center">
              <p className="text-2xl font-bold text-[#F39C12]">{report.gratitude_moments}</p>
              <p className="text-xs text-[#666666]">Gratitude Moments</p>
            </div>
          </div>

          {/* Trend */}
          <div className={`p-4 rounded-[12px] mb-6 ${getTrendColor(report.overall_mood_trend)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getTrendIcon(report.overall_mood_trend)}
              <span className="font-semibold capitalize">{report.overall_mood_trend} Trend</span>
            </div>
            <p className="text-sm">{report.mood_description}</p>
          </div>

          {/* Positive Highlights */}
          {report.positive_highlights && report.positive_highlights.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-[#1A1A1A]">Positive Highlights</h3>
              </div>
              <ul className="space-y-2">
                {report.positive_highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-[#666666]">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas of Concern */}
          {report.areas_of_concern && report.areas_of_concern.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-[#1A1A1A]">Areas to Watch</h3>
              </div>
              <ul className="space-y-2">
                {report.areas_of_concern.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-sm text-[#666666]">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#9B59B6]" />
                <h3 className="font-semibold text-[#1A1A1A]">Recommendations</h3>
              </div>
              <div className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-[#9B59B6]/5 rounded-[8px]">
                    <p className="text-sm text-[#666666]">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Themes */}
          {report.top_themes && report.top_themes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-3">Recurring Themes</h3>
              <div className="flex flex-wrap gap-2">
                {report.top_themes.map((theme, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#F0E5D8] text-[#666666] text-sm rounded-full">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={onClose} variant="primary" className="w-full">
            Close Report
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}