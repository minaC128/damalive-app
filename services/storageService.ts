
import { supabase } from './supabaseClient';
import { UserProfile, ChatSession, MoodRecord, Note } from '../types';

export const getAllData = async (uid: string) => {
  const [profileRes, moodsRes, historyRes, notesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('uid', uid).single(),
    supabase.from('moods').select('*').eq('user_id', uid).order('date', { ascending: false }),
    supabase.from('chat_sessions').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    supabase.from('notes').select('*').eq('user_id', uid).order('timestamp', { ascending: false }),
  ]);

  const profile = profileRes.data
    ? {
      uid: profileRes.data.uid,
      name: profileRes.data.name,
      avatar: profileRes.data.avatar,
      lmpDate: profileRes.data.lmp_date,
      dueDate: profileRes.data.due_date,
      birthDate: profileRes.data.birth_date,
      babyName: profileRes.data.baby_name,
      isPostpartum: profileRes.data.is_postpartum,
      email: profileRes.data.email,
    } as UserProfile
    : null;

  const moods: MoodRecord[] = (moodsRes.data || []).map((m: any) => ({
    date: m.date,
    mood: m.mood,
  }));

  const history: ChatSession[] = (historyRes.data || []).map((h: any) => ({
    id: h.id,
    title: h.title,
    timestamp: h.timestamp,
    messages: h.messages || [],
  }));

  const notes: Note[] = (notesRes.data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    category: n.category,
    date: n.date,
    targetDate: n.target_date,
    timestamp: n.timestamp,
    completed: n.completed,
  }));

  return { profile, moods, history, notes };
};

export const saveProfile = async (uid: string, profile: UserProfile, onSync?: any) => {
  console.log('Attemping to save profile:', uid, profile);
  onSync?.('syncing');
  const { error } = await supabase.from('profiles').upsert({
    uid,
    name: profile.name,
    avatar: profile.avatar,
    lmp_date: profile.lmpDate || null,
    due_date: profile.dueDate || null,
    birth_date: profile.birthDate || null,
    baby_name: profile.babyName || null,
    is_postpartum: profile.isPostpartum,
    email: profile.email || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving profile:', error);
  } else {
    console.log('Profile saved successfully');
  }
  onSync?.('synced');
};

export const saveMood = async (uid: string, mood: 'happy' | 'calm' | 'tired' | 'sad', onSync?: any) => {
  onSync?.('syncing');
  // 使用本地日期而非 UTC 日期，解決時區造成日期跳號問題
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  await supabase.from('moods').upsert(
    { user_id: uid, date, mood },
    { onConflict: 'user_id,date' }
  );
  onSync?.('synced');
};

export const saveChat = async (uid: string, session: ChatSession, onSync?: any) => {
  onSync?.('syncing');
  await supabase.from('chat_sessions').upsert({
    id: session.id,
    user_id: uid,
    title: session.title,
    timestamp: session.timestamp,
    messages: session.messages,
    updated_at: new Date().toISOString(),
  });
  onSync?.('synced');
};

export const saveNote = async (uid: string, note: Note, onSync?: any) => {
  onSync?.('syncing');
  await supabase.from('notes').upsert({
    id: note.id,
    user_id: uid,
    title: note.title,
    content: note.content,
    category: note.category,
    date: note.date,
    target_date: note.targetDate,
    timestamp: note.timestamp,
    completed: note.completed,
  });
  onSync?.('synced');
};

export const deleteNote = async (uid: string, noteId: string, onSync?: any) => {
  onSync?.('syncing');
  await supabase.from('notes').delete().eq('id', noteId).eq('user_id', uid);
  onSync?.('synced');
};

export const getDailyKnowledge = async (
  isPostpartum: boolean,
  daysDiff: number
): Promise<any[]> => {
  const category = isPostpartum ? 'postpartum' : 'pregnancy';
  let periodType = 'week';
  let periodValue = Math.ceil(daysDiff / 7);

  if (isPostpartum && periodValue > 4) {
    periodType = 'month';
    periodValue = Math.ceil(daysDiff / 30);
  }

  if (!isPostpartum) {
    periodType = 'month';
    // 假設 daysDiff 為懷孕天數，換算成懷孕第幾個月
    periodValue = Math.ceil(daysDiff / 30);
    // 簡單處理：如果超過 10 個月就顯示第 9 個月（產前）
    if (periodValue > 9) periodValue = 9;
  }

  // 校正：如果算出來是 0，設為 1
  if (periodValue < 1) periodValue = 1;

  console.log(`Fetching knowledge for: ${category}, ${periodType} ${periodValue}`);

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('category', category)
    .eq('period_type', periodType)
    .eq('period_value', periodValue);

  if (error) {
    console.error('Error fetching knowledge:', error);
    return [];
  }

  if (!data || data.length === 0) {
    // 找不到對應週數時，找通用資料 (例如 month 0)
    const { data: fallbackData } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('category', category)
      .eq('period_type', 'month')
      .eq('period_value', 0)
      .limit(1);
    return fallbackData || [];
  }

  return data || [];
};
