import React, { useState } from 'react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ValueSelector from '../shared/ValueSelector';

const emojiOptions = ['💪', '📚', '🧘', '💧', '🏃', '💤', '🥗', '✍️', '🎯', '🌱', '🧠', '❤️', '🎨', '💼', '⭐'];

const categoryOptions = [
  { value: 'health', label: 'Health & Fitness', icon: '💪' },
  { value: 'productivity', label: 'Productivity', icon: '⚡' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'relationships', label: 'Relationships', icon: '❤️' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'other', label: 'Other', icon: '✨' }
];

const dayOptions = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' }
];

export default function HabitForm({ habit, goals = [], onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'daily',
    times_per_week: habit?.times_per_week || 3,
    specific_days: habit?.specific_days || [],
    category: habit?.category || 'other',
    done_criteria: habit?.done_criteria || '',
    reminder_time: habit?.reminder_time || '',
    goal_id: habit?.goal_id || '',
    icon: habit?.icon || '✨',
    color: habit?.color || '#1ABC9C',
    value_ids: habit?.value_ids || []
  });

  const { data: values = [] } = useQuery({
    queryKey: ['values'],
    queryFn: () => base44.entities.Value.list(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleDay = (day) => {
    const days = formData.specific_days || [];
    if (days.includes(day)) {
      setFormData({ ...formData, specific_days: days.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, specific_days: [...days, day].sort() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onCancel}
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
              <label className="text-sm font-medium text-[#666666] mb-2 block">Habit name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning meditation"
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Done Criteria */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Completion criteria (optional)
              </label>
              <input
                type="text"
                value={formData.done_criteria}
                onChange={(e) => setFormData({ ...formData, done_criteria: e.target.value })}
                placeholder="e.g., 15 minutes, 2 liters, 30 pages"
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
              />
              <p className="text-xs text-[#999999] mt-1">Define what "done" means for this habit</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`py-2 px-3 rounded-[8px] text-sm font-medium transition-all flex items-center gap-2 ${
                      formData.category === cat.value
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
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
              <div className="flex gap-2 mb-3">
                {['daily', 'weekly', 'custom'].map((freq) => (
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

              {/* Weekly: Specific Days */}
              {formData.frequency === 'weekly' && (
                <div>
                  <label className="text-xs text-[#666666] mb-2 block">Select specific days</label>
                  <div className="flex gap-2">
                    {dayOptions.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`flex-1 py-2 px-2 rounded-[8px] text-sm font-medium transition-all ${
                          (formData.specific_days || []).includes(day.value)
                            ? 'bg-[#1ABC9C] text-white'
                            : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom: Times per week */}
              {formData.frequency === 'custom' && (
                <div>
                  <label className="text-xs text-[#666666] mb-2 block">
                    Times per week: {formData.times_per_week}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={formData.times_per_week}
                    onChange={(e) => setFormData({ ...formData, times_per_week: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1ABC9C ${(formData.times_per_week / 7) * 100}%, #E5D9CC ${(formData.times_per_week / 7) * 100}%)`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Reminder Time */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Reminder time (optional)
              </label>
              <input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
              />
              <p className="text-xs text-[#999999] mt-1">Get reminded to complete this habit</p>
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

            {/* Value Selector */}
            <ValueSelector
              values={values}
              selectedIds={formData.value_ids}
              onChange={(ids) => setFormData({...formData, value_ids: ids})}
              label="Why does this habit matter?"
            />

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