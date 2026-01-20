import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Brain, TrendingUp, Heart, Target, Sparkles, Calendar } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { motion } from 'framer-motion';

export default function JournalAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entriesCount, setEntriesCount] = useState(30);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('analyzeJournalEntries', { limit: entriesCount });
      if (response.data.success) {
        setAnalysis(response.data);
      } else {
        alert(response.data.error || 'Failed to analyze entries');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze journal entries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-2">
            Journal Insights
          </h1>
          <p className="text-[#666666]">AI-powered analysis of your journaling patterns and themes</p>
        </div>

        {!analysis ? (
          <Card className="text-center py-12">
            <Brain className="w-16 h-16 text-[#1ABC9C] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">
              Discover Patterns in Your Journey
            </h2>
            <p className="text-[#666666] mb-6 max-w-md mx-auto">
              Analyze your journal entries to identify themes, sentiment, and growth opportunities
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <label className="text-sm text-[#666666]">Analyze last</label>
              <select
                value={entriesCount}
                onChange={(e) => setEntriesCount(Number(e.target.value))}
                className="px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none"
              >
                <option value={10}>10 entries</option>
                <option value={30}>30 entries</option>
                <option value={50}>50 entries</option>
                <option value={100}>100 entries</option>
              </select>
            </div>
            <Button onClick={runAnalysis} loading={loading} icon={Sparkles}>
              Analyze My Journal
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header Info */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#666666]">Analysis of {analysis.entries_analyzed} entries</p>
                  <p className="text-xs text-[#999999]">
                    {analysis.date_range?.from} to {analysis.date_range?.to}
                  </p>
                </div>
                <Button onClick={runAnalysis} loading={loading} variant="outline" size="sm">
                  Refresh Analysis
                </Button>
              </div>
            </Card>

            {/* Sentiment Analysis */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-[#E74C3C]" />
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Sentiment Analysis</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#666666] mb-1">Overall Tone</p>
                  <p className="text-sm text-[#1A1A1A]">{analysis.analysis.sentiment_analysis.overall_tone}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">Mood Trend</p>
                  <p className="text-sm text-[#1A1A1A]">{analysis.analysis.sentiment_analysis.mood_trend}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">Emotional Patterns</p>
                  <p className="text-sm text-[#1A1A1A]">{analysis.analysis.sentiment_analysis.emotional_patterns}</p>
                </div>
              </div>
            </Card>

            {/* Key Themes */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-[#9B59B6]" />
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Key Themes</h2>
              </div>
              <div className="grid gap-3">
                {analysis.analysis.key_themes.map((theme, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 bg-[#F0E5D8] rounded-[12px]"
                  >
                    <h3 className="font-medium text-[#1A1A1A] mb-1">{theme.theme}</h3>
                    <p className="text-sm text-[#666666]">{theme.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Growth Areas */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#1ABC9C]" />
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Growth Opportunities</h2>
              </div>
              <div className="space-y-4">
                {analysis.analysis.growth_areas.map((area, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-l-4 border-[#1ABC9C] pl-4"
                  >
                    <h3 className="font-medium text-[#1A1A1A] mb-1">{area.area}</h3>
                    <p className="text-sm text-[#666666] mb-2">{area.insight}</p>
                    <p className="text-xs text-[#1ABC9C]">💡 {area.suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Positive Patterns */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#27AE60]" />
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">What's Going Well</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.analysis.positive_patterns.map((pattern, idx) => (
                    <li key={idx} className="text-sm text-[#666666] flex items-start gap-2">
                      <span className="text-[#27AE60] mt-0.5">✓</span>
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Areas of Concern */}
              {analysis.analysis.areas_of_concern.length > 0 && (
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#E67E22]" />
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Areas to Watch</h2>
                  </div>
                  <ul className="space-y-2">
                    {analysis.analysis.areas_of_concern.map((concern, idx) => (
                      <li key={idx} className="text-sm text-[#666666] flex items-start gap-2">
                        <span className="text-[#E67E22] mt-0.5">⚠</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Recurring Topics */}
            <Card>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Recurring Topics</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.analysis.recurring_topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#3498DB]/10 text-[#3498DB] rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}