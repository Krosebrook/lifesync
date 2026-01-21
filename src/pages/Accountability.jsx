import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Plus, 
  Send, 
  Heart, 
  Trophy, 
  MessageCircle,
  Award,
  Flame,
  Target,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const circles = [
  { name: 'Fitness', icon: '💪', color: 'from-cyan-400 to-blue-400' },
  { name: 'Mindfulness', icon: '🧘', color: 'from-purple-400 to-pink-400' },
  { name: 'Early Risers', icon: '🌅', color: 'from-orange-400 to-yellow-400' },
  { name: 'Readers', icon: '📚', color: 'from-green-400 to-emerald-600' },
  { name: 'Wellness', icon: '🌱', color: 'from-teal-400 to-cyan-600' }
];

export default function Accountability() {
  const queryClient = useQueryClient();
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: () => base44.entities.AccountabilityPartner.list()
  });

  const { data: encouragements = [] } = useQuery({
    queryKey: ['encouragements'],
    queryFn: () => base44.entities.Encouragement.filter({ to_email: user?.email })
  });

  const { data: leaderboardEntries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => base44.entities.LeaderboardEntry.list()
  });

  const { data: communityPosts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => base44.entities.CommunityPost.list('-created_date', 20)
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['communityChallenges'],
    queryFn: () => base44.entities.CommunityChallenge.filter({ is_active: true })
  });

  const addPartnerMutation = useMutation({
    mutationFn: (data) => base44.entities.AccountabilityPartner.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['partners']);
      setShowAddPartner(false);
      setPartnerEmail('');
      setPartnerName('');
    }
  });

  const sendEncouragementMutation = useMutation({
    mutationFn: (data) => base44.entities.Encouragement.create(data),
    onSuccess: () => queryClient.invalidateQueries(['encouragements'])
  });

  const reactToPostMutation = useMutation({
    mutationFn: async ({ postId, reactionType }) => {
      // Check if already reacted
      const existing = await base44.entities.PostReaction.filter({ 
        post_id: postId, 
        user_email: user.email,
        reaction_type: reactionType 
      });
      
      if (existing.length > 0) {
        await base44.entities.PostReaction.delete(existing[0].id);
        return { action: 'removed' };
      } else {
        await base44.entities.PostReaction.create({ 
          post_id: postId, 
          user_email: user.email,
          reaction_type: reactionType 
        });
        return { action: 'added' };
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['communityPosts'])
  });

  const handleAddPartner = () => {
    if (!partnerEmail || !partnerName) return;
    addPartnerMutation.mutate({
      partner_email: partnerEmail,
      partner_name: partnerName,
      status: 'accepted',
      shared_items: []
    });
  };

  const handleCheer = (post) => {
    sendEncouragementMutation.mutate({
      from_email: user.email,
      from_name: user.full_name,
      to_email: post.user_email,
      message: `Cheered on your ${post.achievement_title}! 🎉`,
      related_type: 'general'
    });
    reactToPostMutation.mutate({ postId: post.id, reactionType: 'cheer' });
  };

  const unreadCount = encouragements.filter(e => !e.read).length;

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <style>{`
        .ghost-card {
          background: linear-gradient(135deg, rgba(77, 208, 225, 0.05) 0%, rgba(77, 208, 225, 0.01) 100%);
          border: 1px solid rgba(77, 208, 225, 0.15);
          backdrop-filter: blur(8px);
        }
        .circle-gradient {
          background: linear-gradient(135deg, var(--from) 0%, var(--to) 100%);
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0E27]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <p className="text-[#B0B8D4] text-sm">Connect, compete, celebrate together</p>
          </div>
          <Button onClick={() => setShowAddPartner(true)} icon={Plus} size="sm">
            Add Friend
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Circles Carousel */}
        <div className="ghost-card p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#4DD0E1] text-xs font-bold tracking-widest uppercase">Your Circles</p>
            <button className="text-[#B0B8D4] text-xs hover:text-[#4DD0E1]">View All →</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {circles.map((circle, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${circle.color} border-2 border-[#4DD0E1]/30 flex items-center justify-center group-hover:scale-110 transition-all`}>
                  <span className="text-3xl">{circle.icon}</span>
                </div>
                <p className="text-white/80 text-xs text-center font-medium group-hover:text-[#4DD0E1] transition-colors">
                  {circle.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Challenge */}
        {challenges[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="ghost-card p-6 rounded-xl border-[#4DD0E1]/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#4DD0E1] text-xs font-bold tracking-widest uppercase mb-1">Active Challenge</p>
                  <h3 className="text-white text-xl font-bold">{challenges[0].name}</h3>
                </div>
                <div className="w-12 h-12 bg-[#4DD0E1]/20 rounded-xl flex items-center justify-center border border-[#4DD0E1]/30">
                  <Trophy className="w-6 h-6 text-[#4DD0E1]" />
                </div>
              </div>
              <p className="text-white/70 text-sm mb-4">{challenges[0].description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Community Progress</span>
                  <span className="text-[#4DD0E1]">{Math.round(challenges[0].completion_rate)}%</span>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4DD0E1] h-full rounded-full transition-all"
                    style={{ width: `${challenges[0].completion_rate}%` }}
                  />
                </div>
                <p className="text-white/50 text-xs">{challenges[0].participants_count} participants</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link to={createPageUrl('Gamification')}>
              <button className="text-[#4DD0E1] text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Leaderboard
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {communityPosts.slice(0, 5).map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="ghost-card rounded-xl overflow-hidden">
                  {/* User Header */}
                  <div className="flex items-center p-4 gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center text-white font-bold">
                      {post.user_name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{post.user_name}</p>
                      <p className="text-white/50 text-xs">
                        {new Date(post.created_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Achievement Card */}
                  <div className={`mx-4 mb-4 p-6 rounded-xl bg-gradient-to-br ${post.achievement_color || 'from-cyan-500 to-blue-500'} text-center`}>
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-4xl">{post.achievement_icon || '🎯'}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-1">{post.achievement_title}</h3>
                    <p className="text-white/80 text-sm">{post.achievement_description}</p>
                  </div>

                  {/* Post Content */}
                  {post.content && (
                    <p className="px-4 pb-4 text-white/80 text-sm">{post.content}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 px-4 pb-4 border-t border-white/5 pt-3">
                    <button 
                      onClick={() => reactToPostMutation.mutate({ postId: post.id, reactionType: 'like' })}
                      className="flex items-center gap-2 text-white/60 hover:text-[#4DD0E1] transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/60 hover:text-[#4DD0E1] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments_count || 0}</span>
                    </button>
                    <button 
                      onClick={() => handleCheer(post)}
                      className="ml-auto px-4 py-2 bg-[#4DD0E1]/20 text-[#4DD0E1] rounded-lg text-sm font-bold hover:bg-[#4DD0E1]/30 transition-all"
                    >
                      Cheer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        {partners.length > 0 && (
          <div className="ghost-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#4DD0E1]" />
              <h2 className="text-xl font-semibold text-white">Your Accountability Partners</h2>
            </div>
            <div className="space-y-3">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center text-white font-bold">
                      {partner.partner_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{partner.partner_name}</p>
                      <p className="text-xs text-white/50">{partner.partner_email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Send}
                    className="border-[#4DD0E1]/30 text-[#4DD0E1]"
                  >
                    Encourage
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragements */}
        {encouragements.length > 0 && (
          <div className="ghost-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-semibold text-white">Messages for You</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-pink-500 text-white text-xs rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {encouragements.slice(0, 5).map((enc) => (
                <motion.div
                  key={enc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-white">{enc.from_name}</p>
                    <p className="text-xs text-white/40">
                      {new Date(enc.created_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-white/70">{enc.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      <AnimatePresence>
        {showAddPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddPartner(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="ghost-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">Add Accountability Partner</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Partner's name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#4DD0E1] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Partner's email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#4DD0E1] focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowAddPartner(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddPartner} loading={addPartnerMutation.isPending} className="flex-1">
                      Add Partner
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}