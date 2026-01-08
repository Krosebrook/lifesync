import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Check, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HabitCard({ habit, isCompleted, onToggle, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative p-5 rounded-[22px] transition-all duration-300 ${
        isCompleted 
          ? 'bg-[#1ABC9C] text-white shadow-lg shadow-[#1ABC9C]/20' 
          : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Actions Menu */}
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger className={`p-2 rounded-full transition-colors ${
            isCompleted ? 'hover:bg-white/20' : 'hover:bg-[#F0E5D8]'
          }`}>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500 focus:text-red-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl ${
            isCompleted ? 'bg-white/20' : 'bg-[#F0E5D8]'
          }`}>
            {habit.icon || '✨'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg mb-1 ${isCompleted ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-white/80' : 'text-[#666666]'}`}>
                {habit.description}
              </p>
            )}
            
            {/* Streak */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 ${isCompleted ? 'text-white/90' : 'text-[#E67E22]'}`}>
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{habit.current_streak || 0} day streak</span>
              </div>
              {habit.longest_streak > 0 && (
                <span className={`text-xs ${isCompleted ? 'text-white/70' : 'text-[#666666]'}`}>
                  Best: {habit.longest_streak} days
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Completion indicator */}
        <div className={`absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isCompleted ? 'bg-white' : 'border-2 border-[#E5D9CC]'
        }`}>
          {isCompleted && <Check className="w-5 h-5 text-[#1ABC9C]" />}
        </div>
      </button>
    </motion.div>
  );
}