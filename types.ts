
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
  savedKnowledgeIds?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface MoodRecord {
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'calm' | 'tired' | 'sad';
}

export interface KnowledgeItem {
  id: string;
  category: 'pregnancy' | 'postpartum';
  period_type: 'week' | 'month' | 'day';
  period_value: number;
  title: string;
  content: string;
  source_title?: string;
  source_url?: string;
}
