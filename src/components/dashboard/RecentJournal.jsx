import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../shared/Card';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

export default function RecentJournal({ entries }) {
  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3498DB]/10 rounded-[12px] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#3498DB]" />
          </div>
          <h3 className="font-semibold text-[#1A1A1A]">Recent Journal</h3>
        </div>
        <Link 
          to={createPageUrl('Journal')} 
          className="text-[#1ABC9C] text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Entries */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={createPageUrl(`Journal?view=${entry.id}`)}
                className="block p-4 bg-[#FAFAFA] rounded-[16px] hover:bg-[#F0E5D8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(entry.date), 'MMM d')}
                  </div>
                  {entry.mood && (
                    <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
                  )}
                </div>
                {entry.title && (
                  <h4 className="font-medium text-[#1A1A1A] mb-1">{entry.title}</h4>
                )}
                <p className="text-sm text-[#666666] line-clamp-2">
                  {entry.content}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[#666666] mb-3">No journal entries yet</p>
          <Link 
            to={createPageUrl('Journal')} 
            className="inline-flex items-center gap-2 text-[#1ABC9C] font-medium hover:underline"
          >
            Write your first entry <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </Card>
  );
}