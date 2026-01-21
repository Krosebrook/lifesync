import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Target } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const benefitColors = {
  'stress-reduction': 'bg-red-100 text-red-700',
  'focus': 'bg-blue-100 text-blue-700',
  'sleep': 'bg-purple-100 text-purple-700',
  'energy': 'bg-yellow-100 text-yellow-700',
  'anxiety': 'bg-orange-100 text-orange-700',
  'emotional-balance': 'bg-pink-100 text-pink-700',
  'clarity': 'bg-cyan-100 text-cyan-700'
};

export default function MeditationLibraryBrowser({ 
  practices, 
  onStart, 
  favorites, 
  onToggleFavorite 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const allBenefits = Array.from(
    new Set(practices.flatMap(p => p.benefits || []))
  ).sort();

  const durations = [5, 10, 15, 20, 30];

  const filtered = practices.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBenefit = !selectedBenefit || 
      (p.benefits && p.benefits.includes(selectedBenefit));
    
    const matchesDuration = !selectedDuration || p.duration === selectedDuration;
    
    return matchesSearch && matchesBenefit && matchesDuration;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search practices..."
            className="w-full pl-12 pr-4 py-3 rounded-[12px] border-2 border-[#E5D9CC] bg-white focus:border-[#1ABC9C] focus:outline-none transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-[12px] border-2 border-[#E5D9CC] hover:bg-[#F0E5D8] transition-all text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-2">By Benefit</p>
                <div className="flex flex-wrap gap-2">
                  {allBenefits.map((benefit) => (
                    <button
                      key={benefit}
                      onClick={() => setSelectedBenefit(
                        selectedBenefit === benefit ? null : benefit
                      )}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedBenefit === benefit
                          ? benefitColors[benefit] + ' ring-2 ring-offset-2'
                          : benefitColors[benefit] + ' opacity-50 hover:opacity-100'
                      }`}
                    >
                      {benefit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-2">By Duration</p>
                <div className="flex flex-wrap gap-2">
                  {durations.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedDuration(
                        selectedDuration === dur ? null : dur
                      )}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                        selectedDuration === dur
                          ? 'bg-[#1ABC9C] text-white'
                          : 'bg-[#F0E5D8] text-[#666666] hover:bg-[#E5D9CC]'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <p className="text-sm text-[#999] px-2">
        {filtered.length} practice{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Practice Grid */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((practice) => {
              const isFavorite = favorites?.includes(practice.id);
              return (
                <motion.div
                  key={practice.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card hover className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1A1A1A] mb-1">
                          {practice.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#999]">
                          <Clock className="w-3 h-3" />
                          {practice.duration} min
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleFavorite?.(practice.id)}
                        className="p-2 hover:bg-[#F0E5D8] rounded-full transition-all"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            isFavorite
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-[#999]'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-[#666666] mb-3 flex-1">
                      {practice.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {practice.benefits?.map((benefit) => (
                        <span
                          key={benefit}
                          className={`text-xs px-2 py-1 rounded-full ${benefitColors[benefit]}`}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#999] mb-3">
                      <strong>When:</strong> {practice.when_to_use}
                    </p>

                    <Button
                      onClick={() => onStart?.(practice)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      Start Practice
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="text-center py-12">
          <Search className="w-12 h-12 text-[#999] mx-auto mb-4 opacity-50" />
          <p className="text-[#666666]">No practices match your filters</p>
        </Card>
      )}
    </div>
  );
}