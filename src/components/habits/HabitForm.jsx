import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const emojiOptions = ['💪', '📚', '🧘', '💧', '🏃', '💤', '🥗', '✍️', '🎯', '🌱', '🧠', '❤️', '🎨', '💼', '⭐'];

export default function HabitForm({ habit, goals = [], onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'daily',
    goal_id: habit?.goal_id || '',
    icon: habit?.icon || '✨',
    color: habit?.color || '#1ABC9C'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">
              {habit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors"
            >
              <X className="w-5 h-5 text-[#666666]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Icon Selection */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-3 block">Choose an icon</label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-10 h-10 rounded-[8px] text-xl flex items-center justify-center transition-all ${
                      formData.icon === emoji 
                        ? 'bg-[#1ABC9C] ring-2 ring-[#1ABC9C] ring-offset-2' 
                        : 'bg-[#F0E5D8] hover:bg-[#E5D9CC]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Habit name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning meditation"
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Why is this habit important to you?"
                rows={3}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Frequency</label>
              <div className="flex gap-2">
                {['daily', 'weekly'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: freq })}
                    className={`flex-1 py-2 px-4 rounded-[8px] font-medium capitalize transition-all ${
                      formData.frequency === freq
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Related Goal */}
            {goals.length > 0 && (
              <div>
                <label className="text-sm font-medium text-[#666666] mb-2 block">Related goal (optional)</label>
                <select
                  value={formData.goal_id}
                  onChange={(e) => setFormData({ ...formData, goal_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all bg-white"
                >
                  <option value="">No specific goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!formData.name.trim()}>
                {habit ? 'Save Changes' : 'Create Habit'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}