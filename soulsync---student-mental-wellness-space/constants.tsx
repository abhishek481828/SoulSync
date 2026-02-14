
import React from 'react';
import { Smile, Frown, Zap, ShieldAlert, Meh } from 'lucide-react';
import { Mood, Peer } from './types';

export const MOOD_CONFIG: Record<Mood, { color: string; icon: React.ReactNode; bg: string; text: string }> = {
  [Mood.HAPPY]: {
    color: '#fbbf24',
    icon: <Smile className="w-6 h-6" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700'
  },
  [Mood.SAD]: {
    color: '#60a5fa',
    icon: <Frown className="w-6 h-6" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700'
  },
  [Mood.STRESSED]: {
    color: '#f87171',
    icon: <Zap className="w-6 h-6" />,
    bg: 'bg-red-50',
    text: 'text-red-700'
  },
  [Mood.ANXIOUS]: {
    color: '#a78bfa',
    icon: <ShieldAlert className="w-6 h-6" />,
    bg: 'bg-purple-50',
    text: 'text-purple-700'
  },
  [Mood.NEUTRAL]: {
    color: '#94a3b8',
    icon: <Meh className="w-6 h-6" />,
    bg: 'bg-slate-100',
    text: 'text-slate-600'
  },
};

export const MOCK_PEERS: Peer[] = [
  { 
    id: '1', 
    nickname: 'Brave Panda', 
    mood: Mood.STRESSED, 
    avatar: 'https://picsum.photos/seed/panda/200', 
    bio: 'Finals week is hitting hard. Looking for a study buddy.',
    interests: ['Coding', 'Coffee', 'Math']
  },
  { 
    id: '2', 
    nickname: 'Quiet Willow', 
    mood: Mood.SAD, 
    avatar: 'https://picsum.photos/seed/willow/200', 
    bio: 'Just feeling a bit lonely today. Anyone want to talk about books?',
    interests: ['Reading', 'Art', 'Poetry']
  },
  { 
    id: '3', 
    nickname: 'Solar Fox', 
    mood: Mood.HAPPY, 
    avatar: 'https://picsum.photos/seed/fox/200', 
    bio: 'Finished my last project! Life is good.',
    interests: ['Gaming', 'Music', 'Fitness']
  },
  { 
    id: '4', 
    nickname: 'Stormy Owl', 
    mood: Mood.ANXIOUS, 
    avatar: 'https://picsum.photos/seed/owl/200', 
    bio: 'Social anxiety is peak today, but I am trying to stay grounded.',
    interests: ['Yoga', 'Meditation', 'Cooking']
  },
  { 
    id: '5', 
    nickname: 'Ocean Turtle', 
    mood: Mood.STRESSED, 
    avatar: 'https://picsum.photos/seed/turtle/200', 
    bio: 'Lab reports are piling up. Send tea.',
    interests: ['Chemistry', 'Tea', 'Coding']
  },
  { 
    id: '6', 
    nickname: 'Forest Deer', 
    mood: Mood.ANXIOUS, 
    avatar: 'https://picsum.photos/seed/deer/200', 
    bio: 'Coffee and calm music. That is the vibe.',
    interests: ['Music', 'Coffee', 'Hiking']
  },
];
