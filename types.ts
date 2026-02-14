
export enum Mood {
  HAPPY = 'Happy',
  SAD = 'Sad',
  STRESSED = 'Stressed',
  ANXIOUS = 'Anxious',
  NEUTRAL = 'Neutral'
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar?: string;
  currentMood: Mood;
  interests: string[];
}

export interface Post {
  id: string;
  authorId: string;
  authorNickname: string;
  content: string;
  mood: Mood;
  timestamp: number;
  likes: number;
}

export interface MoodEntry {
  timestamp: number;
  mood: Mood;
}

export interface Peer {
  id: string;
  nickname: string;
  mood: Mood;
  avatar: string;
  bio: string;
  interests: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
