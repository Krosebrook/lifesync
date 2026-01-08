import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Bell, Heart, Target, LogOut, ChevronRight, Trash2 } from 'lucide-react';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

export default function Settings() {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Queries
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: values = [] } = useQuery({
    queryKey: ['values'],
    queryFn: () => base44.entities.Value.list(),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list(),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => base44.entities.UserProfile.list(),
  });

  const profile = profiles[0] || {};

  const updateProfileMutation = useMutation({
    mutationFn: (data) => {
      if (profile.id) {
        return base44.entities.UserProfile.update(profile.id, data);
      }
      return base44.entities.UserProfile.create(data);
    },
    onSuccess: () => queryClient.invalidateQueries(['userProfile']),
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const sections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Name', value: user?.full_name || 'Not set' },
        { label: 'Email', value: user?.email || 'Not set' }
      ]
    },
    {
      title: 'Your Values',
      icon: Heart,
      items: values.map(v => ({ label: v.name, value: v.icon || '⭐' }))
    },
    {
      title: 'Your Goals',
      icon: Target,
      items: goals.map(g => ({ 
        label: g.title, 
        value: g.status === 'completed' ? '✓' : `${g.progress || 0}%` 
      }))
    }
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Settings</h1>
        <p className="text-[#666666] mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1ABC9C] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">{user?.full_name || 'User'}</h2>
            <p className="text-[#666666]">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Sections */}
      {sections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="w-5 h-5 text-[#1ABC9C]" />
            <h3 className="font-semibold text-[#1A1A1A]">{section.title}</h3>
          </div>
          <Card padding="p-0">
            {section.items.length > 0 ? (
              section.items.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-4 ${
                    i < section.items.length - 1 ? 'border-b border-[#F0E5D8]' : ''
                  }`}
                >
                  <span className="text-[#1A1A1A]">{item.label}</span>
                  <span className="text-[#666666]">{item.value}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[#666666]">
                No {section.title.toLowerCase()} set yet
              </div>
            )}
          </Card>
        </motion.div>
      ))}

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-[#1ABC9C]" />
          <h3 className="font-semibold text-[#1A1A1A]">Preferences</h3>
        </div>
        <Card padding="p-0">
          <div className="flex items-center justify-between p-4 border-b border-[#F0E5D8]">
            <span className="text-[#1A1A1A]">Weekly Review Day</span>
            <select
              value={profile.weekly_review_day || 'sunday'}
              onChange={(e) => updateProfileMutation.mutate({ weekly_review_day: e.target.value })}
              className="px-3 py-2 rounded-[8px] border border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none bg-white"
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="saturday">Saturday</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="font-semibold text-[#1A1A1A] mb-4">Your Journey</h3>
        <Card>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-[#1ABC9C]">{profile.streak_days || 0}</p>
              <p className="text-sm text-[#666666]">Day Streak</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3498DB]">{profile.total_reflections || 0}</p>
              <p className="text-sm text-[#666666]">Reflections</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full justify-center"
          icon={LogOut}
        >
          Sign Out
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full justify-center text-red-500 hover:bg-red-50 hover:text-red-600"
          icon={Trash2}
        >
          Delete Account Data
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="max-w-md">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Delete All Data?</h3>
              <p className="text-[#666666] mb-6">
                This will permanently delete all your habits, journal entries, and progress. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1">
                  Delete Everything
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}