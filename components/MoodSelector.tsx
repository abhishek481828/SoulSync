
import React from 'react';
import { Mood } from '../types';
import { MOOD_CONFIG } from '../constants';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {(Object.keys(Mood) as Array<keyof typeof Mood>).map((key) => {
        const moodValue = Mood[key];
        const config = MOOD_CONFIG[moodValue];
        const isSelected = selectedMood === moodValue;

        return (
          <button
            key={moodValue}
            onClick={() => onSelectMood(moodValue)}
            className={`
              flex flex-col items-center p-4 rounded-2xl transition-all duration-200 border-2
              ${isSelected 
                ? `${config.bg} border-slate-900 scale-105 shadow-md` 
                : 'bg-white border-transparent hover:border-slate-200'}
            `}
          >
            <div className={`p-3 rounded-full ${isSelected ? 'bg-white shadow-inner' : 'bg-slate-50'}`}>
              <div style={{ color: config.color }}>
                {config.icon}
              </div>
            </div>
            <span className={`mt-2 font-medium text-sm ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
              {moodValue}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
