import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Search, Filter, Calendar } from 'lucide-react';

import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import JournalForm from '../components/journal/JournalForm';
import MoodReportCard from '../components/journal/MoodReportCard';
import JournalSuggestions from '../components/journal/JournalSuggestions';

const filterTypes = [
  { value: 'all', label: 'All' },
  { value: 'reflection', label: 'Reflections' },
  { value: 'gratitude', label: 'Gratitude' },
  { value: 'free_write', label: 'Free Write' },
  { value: 'weekly_review', label: 'Weekly Review' }
];

export default function Journal() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [moodReport, setMoodReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [journalSuggestions, setJournalSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Queries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date'),
  });

  // Mutations
  const createEntryMutation = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setShowForm(false);
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JournalEntry.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setEditingEntry(null);
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['journalEntries']),
  });

  const generateMoodReport = async (period) => {
    setLoadingReport(true);
    try {
      const response = await base44.functions.invoke('generateMoodReport', { period });
      if (response.data.success) {
        setMoodReport(response.data);
        setShowReport(true);
      } else {
        alert(response.data.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate mood report');
    } finally {
      setLoadingReport(false);
    }
  };

  const loadJournalSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.functions.invoke('suggestFromJournal', {});
      if (response.data.success) {
        setJournalSuggestions(response.data.suggestions);
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

  const handleAcceptHabit = (habit) => {
    setShowSuggestions(false);
    window.location.href = '/Habits';
  };

  const handleAcceptMindfulness = (practice) => {
    setShowSuggestions(false);
    window.location.href = '/Mindfulness';
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    return matchesSearch && matchesType;
  });

  // Group entries by month
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const monthKey = format(new Date(entry.date), 'MMMM yyyy');
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(entry);
    return groups;
  }, {});

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Journal</h1>
          <p className="text-[#666666] mt-1">Reflect on your journey</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => generateMoodReport('week')} 
            variant="outline"
            loading={loadingReport}
            size="sm"
          >
            Weekly Report
          </Button>
          <Button 
            onClick={loadJournalSuggestions}
            variant="outline"
            loading={loadingSuggestions}
            size="sm"
          >
            Get Suggestions
          </Button>
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card padding="p-4">
          <p className="text-2xl font-semibold text-[#1A1A1A]">{entries.length}</p>
          <p className="text-sm text-[#666666]">Total Entries</p>
        </Card>
        <Card padding="p-4">
          <p className="text-2xl font-semibold text-[#1A1A1A]">
            {entries.filter(e => e.type === 'gratitude').length}
          </p>
          <p className="text-sm text-[#666666]">Gratitude</p>
        </Card>
        <Card padding="p-4">
          <p className="text-2xl font-semibold text-[#1A1A1A]">
            {entries.filter(e => 
              e.date === format(new Date(), 'yyyy-MM-dd')
            ).length > 0 ? '✓' : '○'}
          </p>
          <p className="text-sm text-[#666666]">Today</p>
        </Card>
        <Card padding="p-4">
          <p className="text-2xl font-semibold text-[#1A1A1A]">
            {entries.length > 0 
              ? moodEmojis[Math.round(entries.slice(0, 7).reduce((sum, e) => sum + (e.mood || 3), 0) / Math.min(entries.length, 7)) - 1]
              : '—'
            }
          </p>
          <p className="text-sm text-[#666666]">Avg Mood</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-12 pr-4 py-3 rounded-[12px] border-2 border-[#F0E5D8] bg-white focus:border-[#1ABC9C] focus:outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {filterTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium whitespace-nowrap transition-all ${
                filterType === type.value
                  ? 'bg-[#1ABC9C] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#F0E5D8]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      {Object.keys(groupedEntries).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([month, monthEntries]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-[#1ABC9C]" />
                <h2 className="text-lg font-semibold text-[#1A1A1A]">{month}</h2>
                <span className="text-sm text-[#666666]">({monthEntries.length} entries)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {monthEntries.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      entry={entry}
                      onClick={() => setSelectedEntry(entry)}
                      onEdit={() => setEditingEntry(entry)}
                      onDelete={() => deleteEntryMutation.mutate(entry.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-[#3498DB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#3498DB]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
            {searchQuery || filterType !== 'all' ? 'No matching entries' : 'Start your journal'}
          </h3>
          <p className="text-[#666666] mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Capture your thoughts and track your growth'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Write your first entry
            </Button>
          )}
        </Card>
      )}

      {/* Mood Report */}
      <AnimatePresence>
        {showReport && moodReport && (
          <MoodReportCard
            report={moodReport}
            onClose={() => setShowReport(false)}
          />
        )}
      </AnimatePresence>

      {/* Journal Suggestions */}
      <AnimatePresence>
        {showSuggestions && journalSuggestions.length > 0 && (
          <JournalSuggestions
            suggestions={journalSuggestions}
            onAcceptHabit={handleAcceptHabit}
            onAcceptMindfulness={handleAcceptMindfulness}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </AnimatePresence>

      {/* Entry View Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#666666]">
                      {format(new Date(selectedEntry.date), 'MMMM d, yyyy')}
                    </span>
                    {selectedEntry.mood && (
                      <span className="text-xl">{moodEmojis[selectedEntry.mood - 1]}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 rounded-full hover:bg-[#F0E5D8]"
                  >
                    ×
                  </button>
                </div>
                
                {selectedEntry.title && (
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">{selectedEntry.title}</h2>
                )}
                
                <div className="prose prose-sm max-w-none text-[#1A1A1A] whitespace-pre-wrap mb-6">
                  {selectedEntry.content}
                </div>

                {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#666666] mb-2">Gratitude</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.gratitude.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-[#1ABC9C]/10 text-[#1ABC9C] rounded-full text-sm">
                          🙏 {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[#F0E5D8]">
                  <Button variant="secondary" onClick={() => { setEditingEntry(selectedEntry); setSelectedEntry(null); }}>
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => { 
                      deleteEntryMutation.mutate(selectedEntry.id); 
                      setSelectedEntry(null); 
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {(showForm || editingEntry) && (
          <JournalForm
            entry={editingEntry}
            onSave={(data) => {
              if (editingEntry) {
                updateEntryMutation.mutate({ id: editingEntry.id, data });
              } else {
                createEntryMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}