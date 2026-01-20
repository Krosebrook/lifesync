import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function GoalForm({ goal, values, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    value_id: goal?.value_id || '',
    target_date: goal?.target_date || '',
    status: goal?.status || 'active',
    progress: goal?.progress || 0
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
              {goal ? 'Edit Goal' : 'New Goal'}
            </h2>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors"
            >
              <X className="w-5 h-5 text-[#666666]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What do you want to achieve?"
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Linked Core Value *
              </label>
              <select
                value={formData.value_id}
                onChange={(e) => setFormData({ ...formData, value_id: e.target.value })}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                required
              >
                <option value="">Select a core value...</option>
                {values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.icon} {value.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">
                Target Date
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#666666] mb-2 block">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-2 block">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer mt-3"
                  style={{
                    background: `linear-gradient(to right, #1ABC9C ${formData.progress}%, #E5D9CC ${formData.progress}%)`
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {goal ? 'Save Changes' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}