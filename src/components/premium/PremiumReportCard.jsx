import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Target, Zap, BarChart3, X } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function PremiumReportCard({ report, analytics, onClose }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 overflow-y-auto p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl mx-auto my-8"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Premium Coaching Report</h2>
                <p className="text-sm text-[#999]">{analytics.period} • {analytics.daysAnalyzed} days analyzed</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#999] hover:text-[#1A1A1A]">
              <X className="w-6 h-6" />
            </button>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            {/* Analytics Summary */}
            <motion.div variants={item}>
              <div className="grid grid-cols-4 gap-3 mb-6">
                <Card padding="p-3" className="border-2 border-amber-200">
                  <p className="text-2xl font-bold text-amber-600">{analytics.totalDataPoints}</p>
                  <p className="text-xs text-[#999]">Data Points</p>
                </Card>
                <Card padding="p-3">
                  <p className="text-2xl font-bold text-[#1ABC9C]">{analytics.goalVelocity}</p>
                  <p className="text-xs text-[#999]">Goals/Month</p>
                </Card>
                <Card padding="p-3">
                  <p className="text-2xl font-bold text-purple-600">+{analytics.mindfulnessImpact}</p>
                  <p className="text-xs text-[#999]">Mood Lift</p>
                </Card>
                <Card padding="p-3">
                  <p className="text-2xl font-bold text-blue-600">{analytics.habitStats.length}</p>
                  <p className="text-xs text-[#999]">Habits Tracked</p>
                </Card>
              </div>
            </motion.div>

            {/* Executive Summary */}
            {report.executive_summary && (
              <motion.div variants={item}>
                <Card className="bg-gradient-to-r from-amber-100/50 to-yellow-100/50 border-2 border-amber-200">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-2">Executive Summary</h3>
                      <p className="text-sm text-[#666] leading-relaxed">{report.executive_summary}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Trend Analysis */}
            {report.trend_analysis && (
              <motion.div variants={item}>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-[#1A1A1A]">Trend Analysis</h3>
                  </div>
                  <ul className="space-y-2">
                    {report.trend_analysis.map((trend, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 mt-0.5">📈</span>
                        <span className="text-[#666]">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Performance Insights */}
            {report.performance_insights && (
              <motion.div variants={item}>
                <Card className="bg-green-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-[#1A1A1A]">Performance Insights</h3>
                  </div>
                  <ul className="space-y-2">
                    {report.performance_insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="text-[#666]">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Growth Gaps */}
            {report.growth_gaps && (
              <motion.div variants={item}>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-[#1A1A1A]">Growth Opportunities</h3>
                  </div>
                  <ul className="space-y-2">
                    {report.growth_gaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600 mt-0.5">→</span>
                        <span className="text-[#666]">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Strategic Recommendations */}
            {report.strategic_recommendations && (
              <motion.div variants={item}>
                <Card className="bg-[#1ABC9C]/5 border-2 border-[#1ABC9C]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-[#1ABC9C]" />
                    <h3 className="font-semibold text-[#1A1A1A]">Strategic Action Plan</h3>
                  </div>
                  <ol className="space-y-2">
                    {report.strategic_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1ABC9C] text-white text-xs font-semibold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[#666] mt-0.5">{rec}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            )}

            {/* Predictive Outlook */}
            {report.predictive_outlook && (
              <motion.div variants={item}>
                <Card className="bg-gradient-to-r from-purple-100/50 to-pink-100/50">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-2">Predictive Outlook</h3>
                      <p className="text-sm text-[#666] leading-relaxed">{report.predictive_outlook}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Personalized Challenge */}
            {report.personalized_challenge && (
              <motion.div variants={item}>
                <Card className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-2">Your Next Challenge</h3>
                      <p className="text-sm text-[#666] leading-relaxed">{report.personalized_challenge}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <Button onClick={onClose} variant="primary" className="w-full mt-6">
            Close Report
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}