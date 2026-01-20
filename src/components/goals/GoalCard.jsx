import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../shared/Card';
import ProgressRing from '../shared/ProgressRing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GoalCard({ goal, value, onEdit, onDelete, onUpdateProgress }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27AE60';
      case 'paused': return '#95A5A6';
      default: return '#1ABC9C';
    }
  };

  const statusColor = getStatusColor(goal.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card hover className="relative">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full hover:bg-[#F0E5D8] transition-colors">
              <MoreVertical className="w-4 h-4 text-[#666666]" />
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

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <ProgressRing 
              progress={goal.progress || 0} 
              size={100} 
              strokeWidth={8}
              color={statusColor}
            >
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: statusColor }}>
                  {goal.progress || 0}%
                </p>
              </div>
            </ProgressRing>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              {value && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${value.color}20`,
                    color: value.color 
                  }}
                >
                  {value.icon} {value.name}
                </span>
              )}
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                style={{ 
                  backgroundColor: `${statusColor}20`,
                  color: statusColor
                }}
              >
                {goal.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              {goal.title}
            </h3>
            
            {goal.description && (
              <p className="text-sm text-[#666666] mb-3 line-clamp-2">
                {goal.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-[#999999]">
              {goal.target_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>

            {/* Progress slider */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#666666] mb-2">
                <span>Update Progress</span>
                <span>{goal.progress || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress || 0}
                onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${statusColor} ${goal.progress || 0}%, #E5D9CC ${goal.progress || 0}%)`
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}