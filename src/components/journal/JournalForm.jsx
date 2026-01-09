import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { X, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Card from '../shared/Card';
import Button from '../shared/Button';
import MoodSelector from '../shared/MoodSelector';

const entryTypes = [
  { value: 'reflection', label: 'Daily Reflection', emoji: '🪞' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { value: 'free_write', label: 'Free Write', emoji: '✍️' },
  { value: 'weekly_review', label: 'Weekly Review', emoji: '📊' }
];

const promptsByType = {
  reflection: [
    "What was the highlight of your day?",
    "What challenged you today and how did you handle it?",
    "What did you learn about yourself today?"
  ],
  gratitude: [
    "What are 3 things you're grateful for today?",
    "Who made a positive impact on your day?",
    "What simple pleasure brought you joy?"
  ],
  free_write: [
    "What's on your mind right now?",
    "If you could change one thing about today...",
    "What are you looking forward to?"
  ],
  weekly_review: [
    "What were your biggest wins this week?",
    "What could you have done better?",
    "What are your intentions for next week?"
  ]
};

export default function JournalForm({ entry, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: entry?.date || format(new Date(), 'yyyy-MM-dd'),
    title: entry?.title || '',
    content: entry?.content || '',
    mood: entry?.mood || 3,
    gratitude: entry?.gratitude || [],
    tags: entry?.tags || [],
    type: entry?.type || 'reflection'
  });

  const [newGratitude, setNewGratitude] = useState('');
  const [newTag, setNewTag] = useState('');
  const [aiPrompts, setAiPrompts] = useState(null);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  const loadAIPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const response = await base44.functions.invoke('generateJournalPrompts', {
        entry_type: formData.type
      });
      if (response.data.success) {
        setAiPrompts(response.data.prompts);
      }
    } catch (error) {
      console.error('Error loading AI prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const addGratitude = () => {
    if (newGratitude.trim() && formData.gratitude.length < 5) {
      setFormData({ ...formData, gratitude: [...formData.gratitude, newGratitude.trim()] });
      setNewGratitude('');
    }
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim().toLowerCase()] });
      setNewTag('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const currentPrompts = aiPrompts || promptsByType[formData.type];

  useEffect(() => {
    // Load AI prompts when entry type changes
    if (!entry) {
      loadAIPrompts();
    }
  }, [formData.type]);

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
              {entry ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors"
            >
              <X className="w-5 h-5 text-[#666666]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entry Type */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-3 block">Entry type</label>
              <div className="flex flex-wrap gap-2">
                {entryTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      formData.type === type.value
                        ? 'bg-[#1ABC9C] text-white'
                        : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                    }`}
                  >
                    <span>{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-3 block">How are you feeling?</label>
              <MoodSelector value={formData.mood} onChange={(mood) => setFormData({ ...formData, mood })} />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your entry a title..."
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
              />
            </div>

            {/* Writing Prompts */}
            <div className="p-4 bg-[#1ABC9C]/5 rounded-[12px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1ABC9C]" />
                  <span className="text-sm font-medium text-[#1ABC9C]">
                    {aiPrompts ? 'Personalized prompts for you' : 'Writing prompts'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={loadAIPrompts}
                  disabled={loadingPrompts}
                  className="text-[#1ABC9C] hover:text-[#16A085] transition-colors disabled:opacity-50"
                  title="Generate new prompts"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPrompts ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {loadingPrompts ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="w-5 h-5 text-[#1ABC9C] animate-spin" />
                </div>
              ) : (
                <ul className="space-y-1">
                  {currentPrompts.map((prompt, index) => (
                    <li key={index} className="text-sm text-[#666666]">• {prompt}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Your thoughts</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write freely..."
                rows={6}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all resize-none"
                required
              />
            </div>

            {/* Gratitude */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Gratitude (optional)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.gratitude.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-[#1ABC9C]/10 text-[#1ABC9C] rounded-full text-sm flex items-center gap-2">
                    🙏 {item}
                    <button 
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        gratitude: formData.gratitude.filter((_, i) => i !== index) 
                      })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGratitude}
                  onChange={(e) => setNewGratitude(e.target.value)}
                  placeholder="Something you're grateful for..."
                  className="flex-1 px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGratitude())}
                />
                <Button type="button" onClick={addGratitude} icon={Plus} size="icon" variant="secondary" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-[#666666] mb-2 block">Tags (optional)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-[#F0E5D8] text-[#666666] rounded-full text-sm flex items-center gap-2">
                    #{tag}
                    <button 
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        tags: formData.tags.filter((_, i) => i !== index) 
                      })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} icon={Plus} size="icon" variant="secondary" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!formData.content.trim()}>
                {entry ? 'Save Changes' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}