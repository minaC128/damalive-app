
import { supabase } from './supabaseClient';
import { UserProfile, ChatSession, ChatMessage, MoodRecord, Note } from '../types';

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
      fontSize: profileRes.data.font_size,
      preferredLanguage: profileRes.data.preferred_language || 'zh',
      savedKnowledgeIds: profileRes.data.saved_knowledge_ids || [],
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
    font_size: profile.fontSize || 'medium',
    preferred_language: profile.preferredLanguage || 'zh',
    saved_knowledge_ids: profile.savedKnowledgeIds || [],
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

export const saveChatMessage = async (uid: string, chatId: string, messages: any[], onSync?: any) => {
  onSync?.('syncing');
  const { error } = await supabase.from('chat_sessions').upsert({
    id: chatId,
    user_id: uid,
    title: messages[0]?.content?.slice(0, 30) || 'New Chat',
    messages: messages,
    timestamp: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving chat message:', error);
  }
  onSync?.('synced');
};

export const deleteChatSession = async (uid: string, chatId: string, onSync?: any) => {
  onSync?.('syncing');
  await supabase.from('chat_sessions').delete().eq('id', chatId).eq('user_id', uid);
  onSync?.('synced');
};

// Fetch all chat history for a specific user uid
export const getChatHistory = async (uid: string) => {
  const { data } = await supabase.from('chat_sessions').select('*').eq('user_id', uid).order('updated_at', { ascending: false });
  const history: Record<string, ChatMessage[]> = {};
  (data || []).forEach((h: any) => {
    history[h.id] = h.messages || [];
  });
  return history;
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
  daysDiff: number,
  preferredType?: 'week' | 'month',
  lang: string = 'zh'
): Promise<any[]> => {
  const category = isPostpartum ? 'postpartum' : 'pregnancy';
  let periodType: 'week' | 'month' = preferredType || 'week';
  let periodValue = 1;

  if (periodType === 'week') {
    periodValue = Math.ceil(daysDiff / 7);
    if (!isPostpartum && periodValue > 40) periodValue = 40;
    if (isPostpartum && periodValue > 4 && !preferredType) {
      periodType = 'month';
      periodValue = Math.ceil(daysDiff / 30);
    }
  } else {
    // 月份計算優化
    if (!isPostpartum) {
      // 孕期：每 4 週 (28天) 為一個月
      periodValue = Math.ceil(daysDiff / 28);
      if (periodValue > 10) periodValue = 10;
    } else {
      // 產後：每 30 天為一個月
      periodValue = Math.ceil(daysDiff / 30);
    }
  }

  if (periodValue < 1) periodValue = 1;
  if (periodType === 'month' && periodValue > 12) periodValue = 12;

  console.log(`Fetching knowledge for: ${category}, ${periodType} ${periodValue}`);

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('category', category)
    .eq('period_type', periodType)
    .eq('period_value', periodValue)
    .eq('lang', lang);

  if (error || !data || data.length === 0) {
    if (lang !== 'zh') {
      console.log(`Knowledge not found for ${lang}, falling back to zh`);
      const { data: zhData } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('category', category)
        .eq('period_type', periodType)
        .eq('period_value', periodValue)
        .eq('lang', 'zh');
      if (zhData && zhData.length > 0) return zhData;
    }
  }

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
      .eq('lang', lang)
      .limit(1);
    return fallbackData || [];
  }

  return data || [];
};
