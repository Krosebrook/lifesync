import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Target, 
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X
} from 'lucide-react';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';

const suggestedValues = [
  { name: 'Health', icon: '💪', color: '#1ABC9C' },
  { name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#3498DB' },
  { name: 'Growth', icon: '🌱', color: '#27AE60' },
  { name: 'Creativity', icon: '🎨', color: '#9B59B6' },
  { name: 'Career', icon: '💼', color: '#E67E22' },
  { name: 'Relationships', icon: '❤️', color: '#E74C3C' },
  { name: 'Spirituality', icon: '✨', color: '#F39C12' },
  { name: 'Adventure', icon: '🌍', color: '#1ABC9C' },
  { name: 'Learning', icon: '📚', color: '#3498DB' },
  { name: 'Balance', icon: '☯️', color: '#2C3E50' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedValues, setSelectedValues] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [goals, setGoals] = useState([{ title: '', valueIndex: 0 }]);

  const createValueMutation = useMutation({
    mutationFn: (data) => base44.entities.Value.create(data),
  });

  const createGoalMutation = useMutation({
    mutationFn: (data) => base44.entities.Goal.create(data),
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.create(data),
  });

  const toggleValue = (value) => {
    if (selectedValues.find(v => v.name === value.name)) {
      setSelectedValues(selectedValues.filter(v => v.name !== value.name));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && selectedValues.length < 5) {
      setSelectedValues([...selectedValues, { 
        name: customValue.trim(), 
        icon: '⭐', 
        color: '#1ABC9C' 
      }]);
      setCustomValue('');
    }
  };

  const updateGoal = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setGoals(newGoals);
  };

  const addGoal = () => {
    if (goals.length < 3) {
      setGoals([...goals, { title: '', valueIndex: 0 }]);
    }
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    // Create values
    const createdValues = [];
    for (const value of selectedValues) {
      const created = await createValueMutation.mutateAsync({
        name: value.name,
        icon: value.icon,
        color: value.color
      });
      createdValues.push(created);
    }

    // Create goals
    for (const goal of goals) {
      if (goal.title.trim()) {
        await createGoalMutation.mutateAsync({
          title: goal.title,
          value_id: createdValues[goal.valueIndex]?.id,
          status: 'active',
          progress: 0
        });
      }
    }

    // Create user profile
    await createProfileMutation.mutateAsync({
      onboarding_completed: true,
      streak_days: 0,
      total_reflections: 0
    });

    queryClient.invalidateQueries(['userProfile']);
    navigate(createPageUrl('Dashboard'));
  };

  const steps = [
    {
      title: "What matters most to you?",
      subtitle: "Select up to 5 core values that guide your life"
    },
    {
      title: "Set your intentions",
      subtitle: "What goals do you want to achieve?"
    },
    {
      title: "You're all set!",
      subtitle: "Ready to start your intentional living journey"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0E5D8] flex flex-col">
      {/* Progress Bar */}
      <div className="p-6">
        <div className="flex gap-2 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-[#1ABC9C]' : 'bg-[#E5D9CC]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {step === 1 && <Heart className="w-8 h-8 text-[#1ABC9C]" />}
                {step === 2 && <Target className="w-8 h-8 text-[#1ABC9C]" />}
                {step === 3 && <Star className="w-8 h-8 text-[#1ABC9C]" />}
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-2">
                {steps[step - 1].title}
              </h1>
              <p className="text-[#666666]">{steps[step - 1].subtitle}</p>
            </div>

            {/* Step 1: Values Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {suggestedValues.map((value) => (
                    <motion.button
                      key={value.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleValue(value)}
                      className={`p-4 rounded-[16px] text-left transition-all duration-300 ${
                        selectedValues.find(v => v.name === value.name)
                          ? 'bg-[#1ABC9C] text-white shadow-lg'
                          : 'bg-white text-[#1A1A1A] hover:shadow-md'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{value.icon}</span>
                      <span className="font-medium">{value.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Value Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Add your own value..."
                    className="flex-1 px-4 py-3 rounded-[12px] border-2 border-transparent bg-white focus:border-[#1ABC9C] focus:outline-none transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomValue()}
                  />
                  <Button onClick={addCustomValue} icon={Plus} size="icon" />
                </div>

                <p className="text-center text-sm text-[#666666]">
                  {selectedValues.length}/5 values selected
                </p>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <Card key={index} className="relative">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#666666]">Goal {index + 1}</span>
                        {goals.length > 1 && (
                          <button 
                            onClick={() => removeGoal(index)}
                            className="text-[#666666] hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => updateGoal(index, 'title', e.target.value)}
                        placeholder="What do you want to achieve?"
                        className="w-full px-4 py-3 rounded-[8px] border-2 border-[#F0E5D8] focus:border-[#1ABC9C] focus:outline-none transition-all"
                      />
                      <div>
                        <label className="text-sm text-[#666666] mb-2 block">Related to:</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedValues.map((value, vIndex) => (
                            <button
                              key={vIndex}
                              onClick={() => updateGoal(index, 'valueIndex', vIndex)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                goal.valueIndex === vIndex
                                  ? 'bg-[#1ABC9C] text-white'
                                  : 'bg-[#F0E5D8] text-[#666666]'
                              }`}
                            >
                              {value.icon} {value.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {goals.length < 3 && (
                  <button
                    onClick={addGoal}
                    className="w-full py-4 border-2 border-dashed border-[#E5D9CC] rounded-[22px] text-[#666666] hover:border-[#1ABC9C] hover:text-[#1ABC9C] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add another goal
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Complete */}
            {step === 3 && (
              <Card className="text-center">
                <div className="py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-[#1ABC9C]" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Your Journey Begins</h3>
                  <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center gap-3 p-3 bg-[#F0E5D8] rounded-[12px]">
                      <Heart className="w-5 h-5 text-[#1ABC9C]" />
                      <span className="text-[#1A1A1A]">{selectedValues.length} core values defined</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F0E5D8] rounded-[12px]">
                      <Target className="w-5 h-5 text-[#1ABC9C]" />
                      <span className="text-[#1A1A1A]">{goals.filter(g => g.title.trim()).length} goals set</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F0E5D8] rounded-[12px]">
                      <Sparkles className="w-5 h-5 text-[#1ABC9C]" />
                      <span className="text-[#1A1A1A]">Daily reflections ready</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 bg-white shadow-[0_-2px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-lg mx-auto flex gap-4">
          {step > 1 && (
            <Button
              variant="secondary"
              onClick={() => setStep(step - 1)}
              icon={ArrowLeft}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (step === 3) {
                handleComplete();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={step === 1 && selectedValues.length === 0}
            loading={createValueMutation.isPending || createGoalMutation.isPending || createProfileMutation.isPending}
            className="flex-1"
          >
            {step === 3 ? 'Start My Journey' : 'Continue'}
            {step < 3 && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}