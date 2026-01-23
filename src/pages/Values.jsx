import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import ValueAlignment from '../components/values/ValueAlignment';
import Button from '../components/shared/Button';

export default function ValuesPage() {
  const { data: values = [] } = useQuery({
    queryKey: ['values'],
    queryFn: () => base44.entities.Value.list(),
  });

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list(),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 50),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] p-6 md:p-8 grain">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-px bg-[#FF6B35] mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Newsreader, serif' }}>
            Your Values
          </h1>
          <p className="text-[#9A9A9A] text-lg">
            What actually matters to you—beyond what you think should matter
          </p>
        </div>

        {/* Value Alignment Visualization */}
        <ValueAlignment
          values={values}
          habits={habits}
          goals={goals}
          journalEntries={journalEntries}
        />
      </div>
    </div>
  );
}