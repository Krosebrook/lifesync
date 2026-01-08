import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';
import Card from '../shared/Card';

export default function HabitChart({ logs, habits }) {
  // Generate last 30 days of data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter(log => log.date === dateStr && log.completed);
    const completionRate = habits.length > 0 ? (dayLogs.length / habits.length) * 100 : 0;
    
    return {
      date: format(date, 'MMM d'),
      shortDate: format(date, 'd'),
      rate: Math.round(completionRate),
      completed: dayLogs.length
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-[12px] shadow-lg border border-[#F0E5D8]">
          <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
          <p className="text-sm text-[#1ABC9C]">{payload[0].value}% completion</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="font-semibold text-[#1A1A1A] mb-4">Habit Completion Rate</h3>
      <p className="text-sm text-[#666666] mb-6">Last 30 days</p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1ABC9C" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1ABC9C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="shortDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666666' }}
              interval={6}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666666' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="#1ABC9C" 
              strokeWidth={2}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}