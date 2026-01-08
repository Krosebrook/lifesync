import React from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import Card from '../shared/Card';

export default function WeeklyCalendar({ logs, habits }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayCompletion = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter(log => log.date === dateStr && log.completed);
    return habits.length > 0 ? (dayLogs.length / habits.length) * 100 : 0;
  };

  return (
    <Card>
      <h3 className="font-semibold text-[#1A1A1A] mb-4">This Week</h3>
      <div className="flex justify-between gap-2">
        {weekDays.map((day, index) => {
          const completion = getDayCompletion(day);
          const isTodayDate = isToday(day);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-1 text-center"
            >
              <p className={`text-xs mb-2 ${isTodayDate ? 'text-[#1ABC9C] font-semibold' : 'text-[#666666]'}`}>
                {format(day, 'EEE')}
              </p>
              <div className="relative">
                <div 
                  className={`w-full aspect-square rounded-[12px] flex items-center justify-center text-sm font-medium transition-all ${
                    isTodayDate 
                      ? 'ring-2 ring-[#1ABC9C] ring-offset-2' 
                      : ''
                  } ${
                    completion === 100 
                      ? 'bg-[#1ABC9C] text-white' 
                      : completion > 0 
                        ? 'bg-[#1ABC9C]/30 text-[#1A1A1A]' 
                        : 'bg-[#F0E5D8] text-[#666666]'
                  }`}
                >
                  {format(day, 'd')}
                </div>
                {completion > 0 && completion < 100 && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#1ABC9C] rounded-b-[12px]"
                    style={{ width: `${completion}%` }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}