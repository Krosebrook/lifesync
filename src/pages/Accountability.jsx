import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Send, Heart, Trophy } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Leaderboard from '../components/gamification/Leaderboard';

export default function Accountability() {
  const queryClient = useQueryClient();
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);

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

  const { data: leaderboardData = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // Get all gamification profiles
      const allProfiles = await base44.entities.GamificationProfile.list('-total_points');
      
      // Filter to include user and their partners
      const partnerEmails = partners.map(p => p.partner_email);
      const relevantProfiles = allProfiles.filter(profile => 
        profile.created_by === user?.email || partnerEmails.includes(profile.created_by)
      );

      // Get user details
      const users = await base44.entities.User.list();
      
      return relevantProfiles.map(profile => {
        const profileUser = users.find(u => u.email === profile.created_by);
        return {
          ...profile,
          name: profileUser?.full_name || 'Anonymous',
          email: profile.created_by
        };
      });
    },
    enabled: !!user && partners.length > 0
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
    onSuccess: () => {
      queryClient.invalidateQueries(['encouragements']);
      setMessage('');
      setSelectedPartner(null);
    }
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

  const handleSendEncouragement = () => {
    if (!message || !selectedPartner) return;
    sendEncouragementMutation.mutate({
      from_email: user.email,
      from_name: user.full_name,
      to_email: selectedPartner.partner_email,
      message: message,
      related_type: 'general'
    });
  };

  const acceptedPartners = partners.filter(p => p.status === 'accepted');
  const unreadCount = encouragements.filter(e => !e.read).length;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Accountability</h1>
            <p className="text-[#666666] mt-1">Connect with friends for support and encouragement</p>
          </div>
          <Button onClick={() => setShowAddPartner(!showAddPartner)} icon={Plus}>
            Add Partner
          </Button>
        </div>

        {/* Add Partner Form */}
        <AnimatePresence>
          {showAddPartner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="mb-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Add Accountability Partner</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Partner's name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Partner's email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none"
                  />
                  <Button onClick={handleAddPartner} loading={addPartnerMutation.isPending}>
                    Add Partner
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        {acceptedPartners.length > 0 && leaderboardData.length > 0 && (
          <div className="mb-6">
            <Leaderboard leaderboardData={leaderboardData} currentUser={user?.email} />
          </div>
        )}

        {/* Partners List */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#1ABC9C]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Your Partners</h2>
          </div>
          {acceptedPartners.length === 0 ? (
            <p className="text-[#666666] text-sm">No accountability partners yet. Add someone to get started!</p>
          ) : (
            <div className="space-y-3">
              {acceptedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-4 bg-[#F0E5D8] rounded-[12px] flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{partner.partner_name}</p>
                    <p className="text-xs text-[#666666]">{partner.partner_email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Send}
                    onClick={() => setSelectedPartner(partner)}
                  >
                    Send Encouragement
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Send Encouragement Modal */}
        <AnimatePresence>
          {selectedPartner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPartner(null)}
            >
              <Card onClick={(e) => e.stopPropagation()}>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">
                  Send encouragement to {selectedPartner.partner_name}
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none mb-4"
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setSelectedPartner(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendEncouragement} loading={sendEncouragementMutation.isPending}>
                    Send
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Received Encouragements */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#E74C3C]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Encouragements Received</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-[#E74C3C] text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {encouragements.length === 0 ? (
            <p className="text-[#666666] text-sm">No encouragements yet</p>
          ) : (
            <div className="space-y-3">
              {encouragements.map((enc) => (
                <motion.div
                  key={enc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#F0E5D8] rounded-[12px]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-[#1A1A1A]">{enc.from_name}</p>
                    <p className="text-xs text-[#666666]">{new Date(enc.created_date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-[#666666]">{enc.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}