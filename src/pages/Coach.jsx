import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Send, Sparkles, Loader2, Brain, Crown } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import CoachingInsights from '../components/coach/CoachingInsights';
import PremiumReportCard from '../components/premium/PremiumReportCard';
import UpgradeModal from '../components/premium/UpgradeModal';
import PremiumBadge from '../components/premium/PremiumBadge';

export default function Coach() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [coaching, setCoaching] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showPremiumReport, setShowPremiumReport] = useState(false);
  const [premiumReport, setPremiumReport] = useState(null);
  const [premiumAnalytics, setPremiumAnalytics] = useState(null);
  const [loadingPremiumReport, setLoadingPremiumReport] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.list();
      return subs[0];
    },
  });

  const isPremium = subscription && ['premium', 'pro'].includes(subscription.tier) && subscription.status === 'active';

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.agents.listConversations({ agent_name: 'personal_coach' }),
  });

  // Initialize conversation
  useEffect(() => {
    const initConversation = async () => {
      if (conversations.length > 0) {
        const latest = conversations[0];
        setConversationId(latest.id);
        setMessages(latest.messages || []);
      } else {
        const newConv = await base44.agents.createConversation({
          agent_name: 'personal_coach',
          metadata: { name: 'Coaching Session' }
        });
        setConversationId(newConv.id);
        setMessages(newConv.messages || []);
      }
    };
    initConversation();
  }, [conversations.length]);

  // Subscribe to updates
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || sending) return;

    setSending(true);
    setInput('');

    try {
      const conv = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conv, {
        role: 'user',
        content: input
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const loadCoachingInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await base44.functions.invoke('generatePersonalizedCoaching', {});
      if (response.data.success) {
        setCoaching(response.data.coaching);
        setAnalytics(response.data.analytics);
        setShowInsights(true);
      }
    } catch (error) {
      console.error('Error loading coaching insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const loadPremiumReport = async (period = 'month') => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    
    setLoadingPremiumReport(true);
    try {
      const response = await base44.functions.invoke('generatePremiumCoachingReport', { period });
      if (response.data.success) {
        setPremiumReport(response.data.report);
        setPremiumAnalytics(response.data.analytics);
        setShowPremiumReport(true);
      }
    } catch (error) {
      console.error('Error loading premium report:', error);
      if (error.response?.status === 403) {
        setShowUpgrade(true);
      }
    } finally {
      setLoadingPremiumReport(false);
    }
  };

  const suggestedPrompts = [
    "How am I doing with my goals?",
    "What habit should I focus on next?",
    "Help me reflect on this week",
    "I'm feeling stuck with my progress"
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F0E5D8]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-[#E5D9CC]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">Personal Coach</h1>
                <p className="text-sm text-[#666666]">Your AI-powered development guide</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={loadCoachingInsights}
                loading={loadingInsights}
                variant="outline"
                icon={Brain}
                size="sm"
              >
                Get Insights
              </Button>
              <Button
                onClick={() => loadPremiumReport('month')}
                loading={loadingPremiumReport}
                variant="primary"
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                size="sm"
              >
                <Crown className="w-4 h-4 mr-1" />
                Premium Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Report */}
      <AnimatePresence>
        {showPremiumReport && premiumReport && (
          <PremiumReportCard
            report={premiumReport}
            analytics={premiumAnalytics}
            onClose={() => setShowPremiumReport(false)}
          />
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgrade && (
          <UpgradeModal
            onClose={() => setShowUpgrade(false)}
            feature="Access premium coaching reports with advanced trend analysis"
          />
        )}
      </AnimatePresence>

      {/* Coaching Insights Modal */}
      <AnimatePresence>
        {showInsights && coaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 overflow-y-auto p-4"
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl mx-auto my-8"
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">Your Personalized Coaching Report</h2>
                  <button
                    onClick={() => setShowInsights(false)}
                    className="text-[#666666] hover:text-[#1A1A1A] text-2xl"
                  >
                    ×
                  </button>
                </div>
                <CoachingInsights coaching={coaching} analytics={analytics} />
                <Button onClick={() => setShowInsights(false)} variant="primary" className="w-full mt-4">
                  Close
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-3">
                Welcome to Your Personal Coach
              </h2>
              <p className="text-[#666666] mb-6 max-w-md mx-auto">
                I'm here to support your personal development journey. I have access to your values, goals, habits, and journal entries to provide personalized guidance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left bg-white rounded-[12px] hover:bg-[#F0E5D8] transition-colors border-2 border-[#E5D9CC] hover:border-[#1ABC9C]"
                  >
                    <p className="text-sm text-[#1A1A1A]">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-[16px] px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-white shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-[#1ABC9C]">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                    
                    {msg.tool_calls?.map((call, i) => (
                      <div key={i} className="mt-2 text-xs text-[#999999] italic">
                        {call.status === 'running' && '🔄 Analyzing your data...'}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-[16px] px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 text-[#1ABC9C] animate-spin" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-[#E5D9CC]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your personal development..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-[12px] border-2 border-[#E5D9CC] focus:border-[#1ABC9C] focus:outline-none resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              icon={sending ? Loader2 : Send}
              className={sending ? 'animate-spin' : ''}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}