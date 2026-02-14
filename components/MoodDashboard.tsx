
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MoodEntry, Mood } from '../types';

interface MoodDashboardProps {
  history: MoodEntry[];
}

const moodToValue = (mood: Mood) => {
  switch (mood) {
    case Mood.HAPPY: return 5;
    case Mood.NEUTRAL: return 3;
    case Mood.SAD: return 2;
    case Mood.STRESSED: return 1;
    case Mood.ANXIOUS: return 1;
    default: return 3;
  }
};

const valueToMoodLabel = (val: number) => {
  if (val >= 5) return 'Happy';
  if (val >= 3) return 'Neutral';
  if (val <= 2) return 'Challenging';
  return 'Mixed';
};

const MoodDashboard: React.FC<MoodDashboardProps> = ({ history }) => {
  const data = useMemo(() => {
    return history.slice(-7).map(entry => ({
      time: new Date(entry.timestamp).toLocaleDateString([], { weekday: 'short' }),
      value: moodToValue(entry.mood),
      originalMood: entry.mood
    }));
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
        Start tracking your mood to see your history
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <YAxis 
            hide 
            domain={[0, 6]} 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{payload[0].payload.originalMood}</p>
                    <p className="text-xs text-slate-500">{payload[0].payload.time}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMood)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDashboard;
