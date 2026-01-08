import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Plus, Check, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import MoodSelector from '../shared/MoodSelector';

export default function DailyIntentionCard({ intention, onSave, onUpdate }) {
  const [isEditing, setIsEditing] = useState(!intention);
  const [mainFocus, setMainFocus] = useState(intention?.main_focus || '');
  const [intentions, setIntentions] = useState(intention?.intentions || []);
  const [newIntention, setNewIntention] = useState('');
  const [mood, setMood] = useState(intention?.mood_morning || 3);

  const addIntention = () => {
    if (newIntention.trim() && intentions.length < 5) {
      setIntentions([...intentions, { text: newIntention.trim(), completed: false }]);
      setNewIntention('');
    }
  };

  const toggleIntention = (index) => {
    const updated = [...intentions];
    updated[index].completed = !updated[index].completed;
    setIntentions(updated);
    if (intention) {
      onUpdate({ intentions: updated });
    }
  };

  const handleSave = () => {
    onSave({
      main_focus: mainFocus,
      intentions,
      mood_morning: mood
    });
    setIsEditing(false);
  };

  const completedCount = intentions.filter(i => i.completed).length;
  const progress = intentions.length > 0 ? (completedCount / intentions.length) * 100 : 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#1ABC9C]/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
            <Sun className="w-6 h-6 text-[#1ABC9C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1A1A1A]">Daily Intention</h3>
            <p className="text-sm text-[#666666]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Mood */}
              <div>
                <label className="text-sm font-medium text-[#666666] mb-3 block">How are you feeling?</label>
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              {/* Main Focus */}
              <div>
                <label className="text-sm font-medium text-[#666666] mb-2 block">What's your main focus today?</label>
                <input
                  type="text"
                  value={mainFocus}
                  onChange={(e) => setMainFocus(e.target.value)}
                  placeholder="e.g., Complete project presentation"
                  className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                />
              </div>

              {/* Intentions */}
              <div>
                <label className="text-sm font-medium text-[#666666] mb-2 block">Today's intentions</label>
                <div className="space-y-2 mb-3">
                  {intentions.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-[8px]">
                      <span className="text-[#1A1A1A] flex-1">{item.text}</span>
                      <button
                        onClick={() => setIntentions(intentions.filter((_, i) => i !== index))}
                        className="text-[#666666] hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIntention}
                    onChange={(e) => setNewIntention(e.target.value)}
                    placeholder="Add an intention..."
                    className="flex-1 px-4 py-2 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addIntention()}
                  />
                  <Button onClick={addIntention} icon={Plus} size="icon" variant="secondary" />
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={!mainFocus.trim()}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Set Today's Intention
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Main Focus Display */}
              <div className="p-4 bg-gradient-to-r from-[#1ABC9C]/10 to-[#1ABC9C]/5 rounded-[16px]">
                <p className="text-sm text-[#1ABC9C] font-medium mb-1">Today's Focus</p>
                <p className="text-lg font-semibold text-[#1A1A1A]">{mainFocus}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#666666]">Progress</span>
                  <span className="font-medium text-[#1ABC9C]">{completedCount}/{intentions.length}</span>
                </div>
                <div className="h-2 bg-[#F0E5D8] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#1ABC9C] rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Intentions List */}
              <div className="space-y-2">
                {intentions.map((item, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleIntention(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-[12px] text-left transition-all ${
                      item.completed ? 'bg-[#1ABC9C]/10' : 'bg-[#FAFAFA] hover:bg-[#F0E5D8]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.completed ? 'bg-[#1ABC9C] border-[#1ABC9C]' : 'border-[#E5D9CC]'
                    }`}>
                      {item.completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 ${item.completed ? 'text-[#666666] line-through' : 'text-[#1A1A1A]'}`}>
                      {item.text}
                    </span>
                  </motion.button>
                ))}
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(true)} 
                className="w-full"
              >
                Edit Intentions
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}