import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Sparkles, Target, TrendingUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import GoalSuggestions from '../components/goals/GoalSuggestions';
import PointsAnimation from '../components/gamification/PointsAnimation';
import LevelUpModal from '../components/gamification/LevelUpModal';

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [levelUp, setLevelUp] = useState(null);

  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date'),
  });

  const { data: values = [] } = useQuery({
    queryKey: ['values'],
    queryFn: () => base44.entities.Value.list(),
  });

  const awardPoints = async (action) => {
    try {
      const response = await base44.functions.invoke('awardPoints', { action });
      if (response.data.success) {
        setPointsEarned(response.data.pointsEarned);
        setShowPoints(true);
        if (response.data.leveledUp) {
          setLevelUp(response.data.level);
        }
        queryClient.invalidateQueries(['gamificationProfile']);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const createGoalMutation = useMutation({
    mutationFn: (goalData) => base44.entities.Goal.create(goalData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
      await awardPoints('goal_create');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, goalData }) => base44.entities.Goal.update(id, goalData),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
      if (variables.goalData.status === 'completed') {
        await awardPoints('goal_complete');
      }
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const handleSave = (goalData) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoalMutation.mutate(id);
    }
  };

  const handleUpdateProgress = (id, progress) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const newStatus = progress === 100 ? 'completed' : goal.status === 'completed' ? 'active' : goal.status;
      updateGoalMutation.mutate({ 
        id, 
        goalData: { ...goal, progress, status: newStatus } 
      });
    }
  };

  const loadAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.functions.invoke('generateGoalSuggestions', {});
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } else {
        alert(response.data.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      alert('Failed to generate suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = (suggestion) => {
    setEditingGoal(null);
    setShowSuggestions(false);
    setShowForm(true);
    // Pre-fill form with suggestion data
    setTimeout(() => {
      setEditingGoal({
        title: suggestion.title,
        description: suggestion.description,
        value_id: suggestion.value_id,
        target_date: suggestion.suggested_target_date,
        status: 'active',
        progress: 0
      });
    }, 100);
  };

  const getValueById = (valueId) => values.find(v => v.id === valueId);

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] p-4 md:p-8 grain">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-8 h-px bg-[#FF6B35] mb-3" />
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Newsreader, serif' }}>Goals</h1>
          <p className="text-[#9A9A9A]">What matters most</p>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1ABC9C]/10 rounded-[12px] flex items-center justify-center">
              <Target className="w-6 h-6 text-[#1ABC9C]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Active Goals</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{activeGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#27AE60]/10 rounded-[12px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Completed</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{completedGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#9B59B6]/10 rounded-[12px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#9B59B6]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Avg Progress</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{totalProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button 
          onClick={() => { setEditingGoal(null); setShowForm(true); }}
          icon={Plus}
        >
          New Goal
        </Button>
        <Button 
          onClick={loadAISuggestions}
          variant="outline"
          icon={Sparkles}
          loading={loadingSuggestions}
        >
          Get AI Suggestions
        </Button>
      </div>

      {/* Goals List */}
      {isLoading ? (
        <div className="text-center py-12 text-[#666666]">Loading goals...</div>
      ) : goals.length === 0 ? (
        <Card className="text-center py-12">
          <Target className="w-16 h-16 text-[#E5D9CC] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No goals yet</h3>
          <p className="text-[#666666] mb-4">Start by creating your first goal or get AI suggestions</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Create Goal
            </Button>
            <Button onClick={loadAISuggestions} variant="outline" icon={Sparkles}>
              Get Suggestions
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Active Goals</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    value={getValueById(goal.value_id)}
                    onEdit={() => handleEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Completed Goals</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    value={getValueById(goal.value_id)}
                    onEdit={() => handleEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            </div>
          )}

          {goals.filter(g => g.status === 'paused').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Paused Goals</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {goals.filter(g => g.status === 'paused').map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    value={getValueById(goal.value_id)}
                    onEdit={() => handleEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forms */}
      <AnimatePresence>
        {showForm && (
          <GoalForm
            goal={editingGoal}
            values={values}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingGoal(null);
            }}
          />
        )}

        {showSuggestions && suggestions.length > 0 && (
          <GoalSuggestions
            suggestions={suggestions}
            values={values}
            onAccept={handleAcceptSuggestion}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </AnimatePresence>

      {/* Points Animation */}
      <PointsAnimation 
        points={pointsEarned}
        show={showPoints}
        onComplete={() => setShowPoints(false)}
      />

      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUp && (
          <LevelUpModal
            level={levelUp}
            onClose={() => setLevelUp(null)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}