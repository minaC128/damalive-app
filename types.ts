
export type Page = 'home' | 'growth' | 'ai' | 'knowledge' | 'profile';

export type NoteCategory = 'task' | 'meeting' | 'note';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  date: string; // Creation date
  targetDate?: string; // Scheduled date
  timestamp: number;
  completed?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
  lmpDate?: string;
  dueDate?: string;
  birthDate?: string;
  babyName?: string;
  isPostpartum: boolean;
  email?: string;
  fontSize?: 'small' | 'medium' | 'large';
  preferredLanguage?: 'zh' | 'en' | 'ja';
  savedKnowledgeIds?: string[];
  hasSeenTour?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface MoodRecord {
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'calm' | 'tired' | 'sad';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  fullContent: string;
  tips: string[];
  source: string;
  icon: string;
  color: string;
  // Stage filtering (optional)
  minWeek?: number;  // For pregnancy (1-40)
  maxWeek?: number;
  minMonth?: number; // For postpartum (1-12)
  maxMonth?: number;
}
