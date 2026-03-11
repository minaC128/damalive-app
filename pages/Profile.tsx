
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile, ChatSession, MoodRecord, Note, NoteCategory } from '../types';
import { getAllData, saveProfile, saveNote, deleteNote } from '../services/dbService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { pregnancyPool, postpartumPool } from '../data/knowledgePool';
import { translations, Language } from '../data/translations';

const Profile: React.FC<{
  user: UserProfile,
  onUpdateUser: (u: UserProfile) => void,
  onOpenChat: (id: string) => void,
  onSyncStatus: any,
  onLogout: () => void,
  onRestartTour?: () => void
}> = ({ user, onUpdateUser, onOpenChat, onSyncStatus, onLogout, onRestartTour }) => {
  const lang = user.preferredLanguage || 'zh';
  const t = translations[lang].profile;
  const tc = translations[lang].common;
  const tp = translations[lang].planner;

  const [dbData, setDbData] = useState<{ moods: MoodRecord[], history: ChatSession[], notes: Note[] }>({ moods: [], history: [], notes: [] });
  const [editing, setEditing] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showPlannerCalendar, setShowPlannerCalendar] = useState(false);
  const [expandedSavedIdx, setExpandedSavedIdx] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [plannerDate, setPlannerDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState(user);
  const [noteForm, setNoteForm] = useState<{ title: string, content: string, category: NoteCategory, targetDate: string }>({
    title: '', content: '', category: 'note', targetDate: ''
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteForm, setEditNoteForm] = useState<{ title: string, content: string, category: NoteCategory, targetDate: string }>({
    title: '', content: '', category: 'note', targetDate: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAllData(user.uid);
      setDbData({ moods: data.moods, history: data.history, notes: data.notes });
    };
    load();
  }, [user.uid, onSyncStatus]);

  const moodValueMap: Record<string, number> = { happy: 4, calm: 3, tired: 2, sad: 1 };
  const moodEmojis: Record<string, string> = { happy: '😄', calm: '😌', tired: '🥱', sad: '😔' };

  const calculateDueDate = (lmp: string) => {
    if (!lmp) return "";
    const date = new Date(lmp);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + 280);
    return date.toISOString().split('T')[0];
  };

  const calculateLMP = (due: string) => {
    if (!due) return "";
    const date = new Date(due);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() - 280);
    return date.toISOString().split('T')[0];
  };

  const handleSaveProfile = async () => {
    await saveProfile(user.uid, form, onSyncStatus);
    onUpdateUser(form);
    setEditing(false);
  };

  const handleLanguageChange = async (newLang: Language) => {
    const updatedUser = { ...user, preferredLanguage: newLang };
    onUpdateUser(updatedUser);
    await saveProfile(user.uid, updatedUser, onSyncStatus);
  };

  const handleAddNote = async () => {
    if (!noteForm.title.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteForm,
      date: new Date().toLocaleDateString(lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US'),
      timestamp: Date.now(),
      completed: false
    };
    await saveNote(user.uid, newNote, onSyncStatus);
    setNoteForm({ title: '', content: '', category: 'note', targetDate: '' });
    setShowNoteModal(false);
    const data = await getAllData(user.uid);
    setDbData(prev => ({ ...prev, notes: data.notes }));
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm(translations[lang].common.delete + '?')) {
      await deleteNote(user.uid, id, onSyncStatus);
      const data = await getAllData(user.uid);
      setDbData(prev => ({ ...prev, notes: data.notes }));
    }
  };

  const handleOpenEditNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNote(note);
    setEditNoteForm({ title: note.title, content: note.content, category: note.category, targetDate: note.targetDate || '' });
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editNoteForm.title.trim()) return;
    const updatedNote: Note = { ...editingNote, ...editNoteForm };
    await saveNote(user.uid, updatedNote, onSyncStatus);
    setEditingNote(null);
    const data = await getAllData(user.uid);
    setDbData(prev => ({ ...prev, notes: data.notes }));
  };

  const handleToggleNote = async (note: Note) => {
    const updatedNote = { ...note, completed: !note.completed };
    await saveNote(user.uid, updatedNote, onSyncStatus);
    const data = await getAllData(user.uid);
    setDbData(prev => ({ ...prev, notes: data.notes }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const weeklyTrendData = useMemo(() => {
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const record = dbData.moods.find(m => m.date === dateStr);
      chartData.push({
        name: d.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'short' }),
        value: record ? moodValueMap[record.mood] : null,
        displayMood: record ? moodEmojis[record.mood] : ''
      });
    }
    return chartData;
  }, [dbData.moods, lang]);

  const monthCalendarData = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarItems = [];
    for (let i = 0; i < firstDay; i++) {
      calendarItems.push({ isPadding: true, key: `pad-${i}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const record = dbData.moods.find(m => m.date === dateStr);
      calendarItems.push({
        day: i,
        dateStr,
        mood: record ? record.mood : null,
        isPadding: false,
        key: `day-${i}`
      });
    }
    return { calendarItems, monthName: calendarDate.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { month: 'long', year: 'numeric' }) };
  }, [dbData.moods, calendarDate, lang]);

  const plannerCalendarData = useMemo(() => {
    const year = plannerDate.getFullYear();
    const month = plannerDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarItems = [];
    for (let i = 0; i < firstDay; i++) {
      calendarItems.push({ isPadding: true, key: `pad-${i}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const hasNote = dbData.notes.some(n => n.targetDate === dateStr);
      calendarItems.push({
        day: i,
        dateStr,
        hasNote,
        isPadding: false,
        key: `day-${i}`
      });
    }
    return { calendarItems, monthName: plannerDate.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { month: 'long', year: 'numeric' }) };
  }, [dbData.notes, plannerDate, lang]);

  const displayedNotes = useMemo(() => {
    let filtered = dbData.notes;
    if (showPlannerCalendar && selectedDate) {
      filtered = filtered.filter(n => n.targetDate === selectedDate);
    }
    return showAllNotes ? filtered : filtered.slice(0, 3);
  }, [dbData.notes, showAllNotes, showPlannerCalendar, selectedDate]);

  const savedItems = useMemo(() => {
    if (!user.savedKnowledgeIds) return [];

    // 獲取目前語言或回退到中文
    const pKey = user.preferredLanguage || 'zh';
    const preg = pregnancyPool[pKey] || pregnancyPool['zh'];
    const post = postpartumPool[pKey] || postpartumPool['zh'];

    const all = [
      ...(preg.nutrition || []), ...(preg.exercise || []), ...(preg.wellness || []),
      ...(post.nutrition || []), ...(post.exercise || []), ...(post.wellness || [])
    ];
    return all.filter(item => user.savedKnowledgeIds?.includes(item.id));
  }, [user.savedKnowledgeIds, user.preferredLanguage]);

  return (
    <div className="p-6 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col items-center mb-8 mt-4">
        <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-display font-bold text-dama-sakura tracking-tight uppercase">DAMALIVE</h1>
        </a>
        <div className="h-0.5 w-12 bg-dama-sakura/30 rounded-full mt-1"></div>
      </div>

      <div className="bg-white rounded-[40px] p-8 shadow-xl border border-dama-sakura/20 mb-8 relative overflow-hidden group">
        <button onClick={() => { setForm(user); setEditing(true); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-dama-bg text-dama-sakura flex items-center justify-center hover:bg-dama-sakura hover:text-white transition-all shadow-sm z-10">
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-dama-cream shadow-md object-cover" alt="avatar" />
            {user.isPostpartum && (
              <div className="absolute -bottom-1 -right-1 bg-dama-matcha text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
                <span className="material-symbols-outlined text-[16px]">child_care</span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-dama-brown">{user.name}</h2>
          <span className={`mt-2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.isPostpartum ? 'bg-dama-matcha/20 text-dama-matcha' : 'bg-dama-sakura/20 text-dama-sakura'}`}>
            {user.isPostpartum ? tc.postpartum : tc.pregnant}
          </span>
        </div>

        <div className="mt-8 pt-6 border-t border-dama-sakura/10 w-full space-y-4">
          <div className="flex justify-between items-center px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-dama-sakura text-lg">translate</span>
              <span className="text-xs font-bold text-dama-brown">Language / 語言系統</span>
            </div>
            <div className="flex bg-dama-bg p-1 rounded-2xl border border-dama-sakura/10">
              {(['zh', 'en', 'ja'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${lang === l ? 'bg-white text-dama-sakura shadow-sm' : 'text-dama-brown/30'}`}
                >
                  {l === 'zh' ? '中文' : l === 'en' ? 'EN' : 'JP'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center px-2 pt-2 border-t border-dama-sakura/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-dama-sakura text-lg">format_size</span>
              <span className="text-xs font-bold text-dama-brown">{tc.fontSize}</span>
            </div>
            <div className="flex bg-dama-bg p-1 rounded-2xl">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedUser = { ...user, fontSize: size };
                    onUpdateUser(updatedUser);
                    saveProfile(user.uid, updatedUser, onSyncStatus);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${(user.fontSize || 'medium') === size
                    ? 'bg-white text-dama-sakura shadow-sm'
                    : 'text-dama-brown/30'
                    }`}
                >
                  {size === 'small' ? tc.small : size === 'medium' ? tc.medium : tc.large}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 媽咪計畫本 */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-bold text-dama-brown flex items-center gap-2">
            <span className="material-symbols-outlined text-dama-sakura text-lg">edit_calendar</span>
            {tp.title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlannerCalendar(!showPlannerCalendar)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showPlannerCalendar ? 'bg-dama-sakura text-white' : 'bg-white text-dama-sakura border border-dama-sakura/20'}`}
            >
              <span className="material-symbols-outlined text-sm">{showPlannerCalendar ? 'view_list' : 'calendar_month'}</span>
            </button>
            <button
              onClick={() => setShowNoteModal(true)}
              className="w-8 h-8 rounded-full bg-dama-sakura text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        {showPlannerCalendar && (
          <div className="bg-white p-6 rounded-[40px] shadow-sm border border-dama-sakura/5 mb-6 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  const newDate = new Date(plannerDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setPlannerDate(newDate);
                }}
                className="w-8 h-8 rounded-full bg-dama-bg text-dama-brown/40 flex items-center justify-center hover:bg-dama-sakura/10 hover:text-dama-sakura"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="text-[10px] font-bold text-dama-brown/60 uppercase tracking-widest">{plannerCalendarData.monthName}</span>
              <button
                onClick={() => {
                  const newDate = new Date(plannerDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setPlannerDate(newDate);
                }}
                className="w-8 h-8 rounded-full bg-dama-bg text-dama-brown/40 flex items-center justify-center hover:bg-dama-sakura/10 hover:text-dama-sakura"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(lang === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-dama-brown/30 pb-2">{d}</div>
              ))}
              {plannerCalendarData.calendarItems.map(item => (
                <div
                  key={item.key}
                  onClick={() => !item.isPadding && setSelectedDate(selectedDate === item.dateStr ? null : item.dateStr)}
                  className={`flex flex-col items-center py-2 rounded-2xl cursor-pointer transition-all ${item.isPadding ? 'opacity-0 pointer-events-none' : ''} ${selectedDate === item.dateStr ? 'bg-dama-sakura/10 border border-dama-sakura/20' : 'hover:bg-dama-bg'}`}
                >
                  <span className={`text-[10px] font-bold ${selectedDate === item.dateStr ? 'text-dama-sakura' : 'text-dama-brown/40'}`}>{item.day}</span>
                  {item.hasNote && <div className="w-1.5 h-1.5 rounded-full bg-dama-sakura mt-1"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dbData.notes.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/40 border border-dashed border-dama-sakura/30 p-8 rounded-[32px] text-center">
              <p className="text-xs text-dama-brown/40 font-bold italic whitespace-pre-wrap">{tp.noNotes}</p>
            </div>
          ) : (
            <>
              {displayedNotes.map(note => (
                <div key={note.id} className="bg-white rounded-[32px] shadow-sm border border-dama-sakura/5 overflow-hidden transition-all">
                  <div
                    onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                    className={`p-3 flex gap-3 items-center group relative cursor-pointer hover:bg-dama-bg/50 ${note.completed ? 'opacity-60' : ''}`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleNote(note); }}
                      className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${note.completed ? 'bg-dama-matcha border-dama-matcha text-white' : 'border-dama-sakura/20 text-transparent'
                        }`}
                    >
                      <span className="material-symbols-outlined text-xl font-bold">check</span>
                    </button>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${note.category === 'meeting' ? 'bg-blue-50 text-blue-400' :
                      note.category === 'task' ? 'bg-dama-matcha/10 text-dama-matcha' : 'bg-orange-50 text-orange-400'
                      }`}>
                      <span className="material-symbols-outlined text-xl">
                        {note.category === 'meeting' ? 'calendar_month' : note.category === 'task' ? 'task_alt' : 'sticky_note_2'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`font-bold text-dama-brown text-sm truncate ${note.completed ? 'line-through' : ''}`}>
                          {note.title}
                        </h4>
                        <div className="flex flex-col items-end whitespace-nowrap ml-2">
                          {note.targetDate && <span className="text-[9px] text-dama-sakura font-bold">{tp.expected}{note.targetDate}</span>}
                          <span className="text-[7px] text-dama-brown/20 font-bold">{note.date} {tp.created}</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-dama-bg rounded-full overflow-hidden mt-1 opacity-60">
                        <div className={`h-full transition-all duration-500 ${note.completed ? 'bg-dama-matcha' : (note.category === 'meeting' ? 'bg-blue-200' : note.category === 'task' ? 'bg-dama-matcha/40' : 'bg-orange-200')}`} style={{ width: note.completed ? '100%' : '30%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center border-l border-dama-sakura/5 pl-2 h-10 gap-1">
                      <span className={`material-symbols-outlined text-dama-brown/20 text-xs transition-transform duration-300 ${expandedNoteId === note.id ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                        className="w-10 h-10 rounded-2xl bg-dama-bg/50 flex items-center justify-center text-dama-brown/20 hover:text-red-400 hover:bg-red-50 transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${expandedNoteId === note.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 pt-2 border-t border-dama-sakura/5 mx-3 mb-1">
                      <div className="bg-dama-bg/30 p-4 rounded-2xl text-xs text-dama-brown/80 leading-relaxed font-medium whitespace-pre-wrap mb-3">
                        {note.content || tp.emptyContent}
                      </div>
                      <button
                        onClick={(e) => handleOpenEditNote(note, e)}
                        className="w-full py-2 rounded-2xl border border-dama-sakura/20 text-dama-sakura text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-dama-sakura/5 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        {tc.edit}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {dbData.notes.length > 3 && (
                <button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="w-full py-2 text-[10px] font-bold text-dama-brown/30 hover:text-dama-sakura transition-colors flex items-center justify-center gap-1"
                >
                  {showAllNotes ? tp.collapse : tp.viewAll.replace('{count}', String(dbData.notes.length - 3))}
                  <span className={`material-symbols-outlined text-xs transition-transform ${showAllNotes ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* 情緒趨勢 */}
      <section className="mb-10">
        <h3 className="font-bold text-dama-brown flex items-center gap-2 mb-5 px-1">
          <span className="material-symbols-outlined text-dama-sakura text-lg">trending_up</span>
          {t.moodTrend}
        </h3>
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-dama-sakura/5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EED6D6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8B6E60', fontSize: 10, fontWeight: 'bold' }}
                dy={10}
                padding={{ left: 15, right: 15 }}
                interval={0}
              />
              <YAxis hide domain={[0, 5]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-dama-sakura/20 text-[10px] font-bold text-dama-brown">
                        {payload[0].payload.displayMood}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#F2CECE"
                strokeWidth={4}
                dot={{ r: 6, fill: '#F2CECE', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#F2CECE', strokeWidth: 2, stroke: '#fff' }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 情緒月份紀錄 */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-bold text-dama-brown flex items-center gap-2">
            <span className="material-symbols-outlined text-dama-sakura text-lg">calendar_today</span>
            {t.moodMonthly}
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const d = new Date(calendarDate);
                d.setMonth(d.getMonth() - 1);
                setCalendarDate(d);
              }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-dama-brown/30 hover:text-dama-sakura transition-colors border border-dama-sakura/10"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="text-[10px] font-bold text-dama-brown/40 uppercase tracking-widest">{monthCalendarData.monthName}</span>
            <button
              onClick={() => {
                const d = new Date(calendarDate);
                d.setMonth(d.getMonth() + 1);
                setCalendarDate(d);
              }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-dama-brown/30 hover:text-dama-sakura transition-colors border border-dama-sakura/10"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-dama-sakura/5">
          <div className="grid grid-cols-7 gap-1">
            {(lang === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-dama-brown/30 pb-3">{d}</div>
            ))}
            {monthCalendarData.calendarItems.map(item => (
              <div key={item.key} className={`flex flex-col items-center py-2 relative ${item.isPadding ? 'opacity-0' : ''}`}>
                <span className="text-[9px] font-bold text-dama-brown/20 mb-1">{item.day}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-dama-bg/30">
                  {item.mood && (
                    <span className="text-xl animate-in zoom-in duration-300">
                      {moodEmojis[item.mood]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="font-bold text-dama-brown flex items-center gap-2 mb-5 px-1">
          <span className="material-symbols-outlined text-dama-sakura text-lg">favorite</span>
          {t.savedKnowledge}
        </h3>
        {savedItems.length === 0 ? (
          <div className="bg-white/40 border border-dashed border-dama-sakura/30 p-8 rounded-[32px] text-center">
            <p className="text-xs text-dama-brown/40 font-bold italic whitespace-pre-wrap">{t.noSaved}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map((item, idx) => {
              const handleToggleSave = async (e: React.MouseEvent) => {
                e.stopPropagation();
                const nextSaved = (user.savedKnowledgeIds || []).filter(id => id !== item.id);
                const updatedUser = { ...user, savedKnowledgeIds: nextSaved };
                await saveProfile(user.uid, updatedUser, onSyncStatus);
                onUpdateUser(updatedUser);
              };

              return (
                <div
                  key={item.id}
                  onClick={() => setExpandedSavedIdx(expandedSavedIdx === idx ? null : idx)}
                  className="bg-white rounded-[32px] shadow-sm border border-dama-sakura/5 overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className={`p-5 ${item.color} relative overflow-hidden transition-all duration-500 ${expandedSavedIdx === idx ? 'pb-6' : ''}`}>
                    <div className="absolute -top-2 -right-2 opacity-5 scale-125 rotate-12">
                      <span className="material-symbols-outlined text-7xl">{item.icon}</span>
                    </div>
                    <div className="flex items-start justify-between mb-2 relative z-10">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-dama-brown text-sm">{item.icon}</span>
                      </div>
                    </div>
                    <div className="relative z-10 pr-10">
                      <h4 className="text-sm font-bold text-dama-brown">{item.title}</h4>
                      <p className="text-[8px] font-bold text-dama-brown/40 uppercase tracking-widest leading-none mt-1">{item.subtitle}</p>

                      <button
                        onClick={handleToggleSave}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-dama-sakura flex items-center justify-center shadow-md active:scale-150 transition-all duration-300"
                      >
                        <span className="material-symbols-outlined text-active text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${expandedSavedIdx === idx ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-5 border-t border-dama-sakura/5 bg-white">
                      <div className="text-xs text-dama-brown/80 leading-relaxed whitespace-pre-wrap font-medium bg-dama-bg/30 p-4 rounded-2xl mb-4">
                        {item.fullContent}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.tips.map((tip: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-dama-sakura/5 rounded-full text-[9px] font-bold text-dama-brown border border-dama-sakura/5">
                            {tip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 bg-dama-brown/40 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in zoom-in-95 overflow-y-auto max-h-[90vh] no-scrollbar">
            <h2 className="text-xl font-bold text-dama-brown mb-6 text-center">{t.editProfile}</h2>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-dama-sakura p-1 bg-white">
                  <img src={form.avatar} className="w-full h-full rounded-full object-cover" alt="preview" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-dama-sakura text-white flex items-center justify-center border-2 border-white shadow-md active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{t.nameLabel}</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={translations[lang].common.loading}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                />
              </div>
              {!form.isPostpartum ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{t.lmpLabel}</label>
                    <input
                      type="date"
                      value={form.lmpDate || ''}
                      onChange={e => {
                        const newVal = e.target.value;
                        setForm({ ...form, lmpDate: newVal, dueDate: calculateDueDate(newVal) });
                      }}
                      className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{t.dueLabel}</label>
                    <input
                      type="date"
                      value={form.dueDate || ''}
                      onChange={e => {
                        const newVal = e.target.value;
                        setForm({ ...form, dueDate: newVal, lmpDate: calculateLMP(newVal) });
                      }}
                      className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                    />
                  </div>
                  <button
                    onClick={() => setForm({ ...form, isPostpartum: true })}
                    className="w-full py-3 bg-dama-matcha/10 text-dama-matcha rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-dama-matcha/20 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">child_care</span>
                    {t.toPostpartum}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">寶寶姓名</label>
                    <input
                      value={form.babyName || ''}
                      onChange={e => setForm({ ...form, babyName: e.target.value })}
                      placeholder="輸入寶寶姓名"
                      className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">寶寶出生日期</label>
                    <input
                      type="date"
                      value={form.birthDate || ''}
                      onChange={e => setForm({ ...form, birthDate: e.target.value })}
                      className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                    />
                  </div>
                  <button
                    onClick={() => setForm({ ...form, isPostpartum: false })}
                    className="w-full py-3 bg-dama-sakura/10 text-dama-sakura rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-dama-sakura/20 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">pregnant_woman</span>
                    返回孕期階段
                  </button>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <button onClick={handleSaveProfile} className="w-full bg-dama-sakura text-white py-4 rounded-full font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all text-sm">
                {tc.update}
              </button>
              <button onClick={() => setEditing(false)} className="w-full py-3 font-bold text-dama-brown/30 text-xs hover:text-dama-brown transition-colors">
                {tc.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-dama-brown/40 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-dama-brown mb-6">{tp.addTitle}</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.inputTitle}</label>
                <input
                  value={noteForm.title}
                  onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                  placeholder={tp.inputTitlePlaceholder}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.category}</label>
                <div className="flex gap-2">
                  {(['note', 'task', 'meeting'] as NoteCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNoteForm({ ...noteForm, category: cat })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${noteForm.category === cat ? 'bg-dama-sakura border-dama-sakura text-white' : 'bg-white border-dama-sakura/20 text-dama-brown/40'}`}
                    >
                      {cat === 'note' ? tp.catNote : cat === 'task' ? tp.catTask : tp.catMeeting}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.targetDate}</label>
                <input
                  type="date"
                  value={noteForm.targetDate}
                  onChange={e => setNoteForm({ ...noteForm, targetDate: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.content}</label>
                <textarea
                  rows={4}
                  value={noteForm.content}
                  onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura no-scrollbar"
                  placeholder={tp.contentPlaceholder}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <button onClick={handleAddNote} className="w-full bg-dama-sakura text-white py-4 rounded-full font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all text-sm">
                {tp.saveNote}
              </button>
              <button onClick={() => setShowNoteModal(false)} className="w-full py-3 font-bold text-dama-brown/30 text-xs">
                {tc.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingNote && (
        <div className="fixed inset-0 bg-dama-brown/40 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-dama-brown mb-6">{tp.editTitle}</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.inputTitle}</label>
                <input
                  value={editNoteForm.title}
                  onChange={e => setEditNoteForm({ ...editNoteForm, title: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                  placeholder={tp.inputTitlePlaceholder}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.category}</label>
                <div className="flex gap-2">
                  {(['note', 'task', 'meeting'] as NoteCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setEditNoteForm({ ...editNoteForm, category: cat })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${editNoteForm.category === cat ? 'bg-dama-sakura border-dama-sakura text-white' : 'bg-white border-dama-sakura/20 text-dama-brown/40'}`}
                    >
                      {cat === 'note' ? tp.catNote : cat === 'task' ? tp.catTask : tp.catMeeting}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.targetDate}</label>
                <input
                  type="date"
                  value={editNoteForm.targetDate}
                  onChange={e => setEditNoteForm({ ...editNoteForm, targetDate: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">{tp.content}</label>
                <textarea
                  rows={4}
                  value={editNoteForm.content}
                  onChange={e => setEditNoteForm({ ...editNoteForm, content: e.target.value })}
                  className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura no-scrollbar"
                  placeholder={tp.contentPlaceholder}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <button onClick={handleUpdateNote} className="w-full bg-dama-sakura text-white py-4 rounded-full font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all text-sm">
                {tp.updateNote}
              </button>
              <button onClick={() => setEditingNote(null)} className="w-full py-3 font-bold text-dama-brown/30 text-xs">
                {tc.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pb-4 flex flex-col items-center gap-4">
        {onRestartTour && (
          <button onClick={onRestartTour} className="flex items-center gap-2 px-8 py-3 rounded-full bg-dama-sakura/10 text-dama-sakura font-bold text-sm hover:bg-dama-sakura/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">explore</span>
            {t.featureGuide}
          </button>
        )}
        <button onClick={onLogout} className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-red-200 text-red-400 font-bold text-sm hover:bg-red-50 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-lg">logout</span>
          {tc.logout}
        </button>
      </div>
    </div>
  );
};

export default Profile;
