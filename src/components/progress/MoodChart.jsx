import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import Card from '../shared/Card';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

export default function MoodChart({ entries }) {
  // Generate last 14 days of mood data
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntry = entries.find(e => e.date === dateStr);
    
    return {
      date: format(date, 'MMM d'),
      shortDate: format(date, 'd'),
      mood: dayEntry?.mood || null,
      moodEmoji: dayEntry?.mood ? moodEmojis[dayEntry.mood - 1] : null
    };
  }).filter(d => d.mood !== null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;
      return (
        <div className="bg-white p-3 rounded-[12px] shadow-lg border border-[#F0E5D8]">
          <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
          <p className="text-xl">{moodEmojis[mood - 1]}</p>
        </div>
      );
    }
    return null;
  };

  const avgMood = chartData.length > 0 
    ? chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length 
    : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#1A1A1A]">Mood Tracking</h3>
          <p className="text-sm text-[#666666]">Last 2 weeks</p>
        </div>
        {avgMood > 0 && (
          <div className="text-center">
            <span className="text-3xl">{moodEmojis[Math.round(avgMood) - 1]}</span>
            <p className="text-xs text-[#666666]">Average</p>
          </div>
        )}
      </div>
      
      {chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="shortDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666666' }}
              />
              <YAxis 
                domain={[1, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666666' }}
                tickFormatter={(value) => moodEmojis[value - 1]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#3498DB" 
                strokeWidth={3}
                dot={{ fill: '#3498DB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3498DB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-[#666666]">
          <p>No mood data yet. Start journaling to track your mood!</p>
        </div>
      )}
    </Card>
  );
}