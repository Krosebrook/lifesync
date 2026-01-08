import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Tag, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
const typeColors = {
  reflection: 'bg-blue-100 text-blue-700',
  gratitude: 'bg-green-100 text-green-700',
  free_write: 'bg-purple-100 text-purple-700',
  weekly_review: 'bg-orange-100 text-orange-700'
};

export default function JournalEntryCard({ entry, onClick, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Calendar className="w-4 h-4" />
            {format(new Date(entry.date), 'MMM d, yyyy')}
          </div>
          {entry.mood && (
            <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[entry.type] || typeColors.reflection}`}>
            {(entry.type || 'reflection').replace('_', ' ')}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger 
              className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4 text-[#666666]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="cursor-pointer text-red-500 focus:text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title */}
      {entry.title && (
        <h3 className="font-semibold text-[#1A1A1A] mb-2">{entry.title}</h3>
      )}

      {/* Content Preview */}
      <p className="text-[#666666] text-sm line-clamp-3 mb-3">
        {entry.content}
      </p>

      {/* Gratitude */}
      {entry.gratitude && entry.gratitude.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {entry.gratitude.slice(0, 3).map((item, index) => (
            <span key={index} className="px-2 py-1 bg-[#1ABC9C]/10 text-[#1ABC9C] rounded-full text-xs">
              🙏 {item}
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex items-center gap-2">
          <Tag className="w-3 h-3 text-[#666666]" />
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag, index) => (
              <span key={index} className="text-xs text-[#666666]">
                #{tag}{index < entry.tags.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}