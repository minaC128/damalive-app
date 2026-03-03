import React, { useState, useEffect } from 'react';
// Cache bust: 2026-03-03 10:33
import { UserProfile, KnowledgeItem } from '../types';
import { pregnancyPool, postpartumPool } from '../data/knowledgePool';
import { saveProfile } from '../services/dbService';
import { translations } from '../data/translations';

const KnowledgeBase: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void, onSyncStatus: any }> = ({ user, onUpdateUser, onSyncStatus }) => {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'exercise' | 'wellness'>('nutrition');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [shuffledItems, setShuffledItems] = useState<KnowledgeItem[]>([]);

  const lang = user.preferredLanguage || 'zh';
  const t = translations[lang].knowledge;
  const tc = translations[lang].common;

  // 使用日期作為 seed 的隨機排列函數
  const shuffleWithSeed = (array: KnowledgeItem[], seed: number) => {
    const arr = [...array];
    let m = arr.length, t, i;
    while (m) {
      i = Math.floor(Math.abs(Math.sin(seed++)) * m--);
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
    return arr;
  };

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const pool = user.isPostpartum ? postpartumPool[activeTab] : pregnancyPool[activeTab];

    // 將 desc 映射到 content 以符合 KnowledgeItem 介面
    const mappedPool = pool.map(item => ({
      ...item,
      content: (item as any).desc || ''
    }));

    setShuffledItems(shuffleWithSeed(mappedPool as any, seed));
  }, [user.isPostpartum, activeTab]);

  const handleToggleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isSaved = (user.savedKnowledgeIds || []).includes(id);
    const nextSaved = isSaved
      ? (user.savedKnowledgeIds || []).filter(sid => sid !== id)
      : [...(user.savedKnowledgeIds || []), id];

    const updatedUser = { ...user, savedKnowledgeIds: nextSaved };
    onUpdateUser(updatedUser);
    await saveProfile(user.uid, updatedUser, onSyncStatus);
  };

  const tabs = [
    { id: 'nutrition' as const, label: t.tagNutrition, icon: 'restaurant_menu' },
    { id: 'exercise' as const, label: t.tagExercise, icon: 'fitness_center' },
    { id: 'wellness' as const, label: t.tagWellness, icon: 'eco' },
  ];

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-700">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-dama-brown tracking-tight">
          {t.title}
        </h2>
      </header>

      <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-full shadow-sm border border-dama-sakura/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpandedItem(null); }}
            className={`flex-1 py-3 px-2 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === tab.id ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/30 hover:bg-dama-bg/50'}`}
          >
            <span className="material-symbols-outlined text-sm">{tab.id === 'nutrition' ? 'child_care' : tab.id === 'exercise' ? 'face' : 'favorite'}</span>
            <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {shuffledItems.map((item, idx) => {
          const isExpanded = expandedItem === item.id;
          const isSaved = (user.savedKnowledgeIds || []).includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setExpandedItem(isExpanded ? null : item.id)}
              className="bg-white rounded-[40px] shadow-sm border border-dama-sakura/5 overflow-hidden transition-all duration-500 cursor-pointer active:scale-[0.98] group relative"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Top Colored Section */}
              <div className={`${item.color} p-8 relative overflow-hidden transition-all duration-500 min-h-[160px] flex flex-col justify-center`}>
                {/* Background Large Icon Watermark */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.04] scale-[2.2] rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                  <span className="material-symbols-outlined text-[120px]">{item.icon}</span>
                </div>

                <div className="absolute top-6 left-6 flex items-start justify-between w-[calc(100%-48px)] z-10">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-dama-brown text-lg">{item.icon}</span>
                  </div>

                  {/* Category Label */}
                  <span className="text-[9px] bg-white/60 px-3 py-1 rounded-full font-bold text-dama-brown/40 uppercase tracking-widest mt-1">
                    {item.source}
                  </span>
                </div>

                <div className="relative z-10 mt-10">
                  <h3 className="text-2xl font-bold text-dama-brown leading-tight pr-12">{item.title}</h3>
                  <p className="text-[11px] font-bold text-dama-brown/30 uppercase tracking-[0.1em] mt-1 mb-1">{item.subtitle}</p>
                </div>

                {/* Heart Button Positioned according to screenshot */}
                <button
                  onClick={(e) => handleToggleSave(e, item.id)}
                  className={`absolute right-8 bottom-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isSaved ? 'bg-dama-sakura text-white scale-110' : 'bg-white text-dama-sakura hover:scale-110'}`}
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
              </div>

              {/* Bottom White Section */}
              <div className="bg-white p-7 relative z-10 border-t border-dama-sakura/5">
                <p className="text-sm text-dama-brown/60 leading-relaxed font-medium">
                  {item.content}
                </p>

                <div className={`mt-6 transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="pt-6 border-t border-dama-sakura/5">
                    <div className="bg-dama-bg/40 p-6 rounded-[32px] mb-6 shadow-inner">
                      <h4 className="text-[10px] font-bold text-dama-sakura uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                        {t.fullStory}
                      </h4>
                      <p className="text-sm text-dama-brown/80 leading-[1.8] whitespace-pre-wrap font-medium">
                        {item.fullContent}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-dama-sakura uppercase tracking-widest px-1">實用的建議</h4>
                      <div className="flex flex-col gap-2">
                        {item.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-dama-sakura/5 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-dama-sakura/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-dama-sakura">{i + 1}</span>
                            </div>
                            <p className="text-xs text-dama-brown/80 font-medium leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedItem(null); }}
                      className="w-full mt-8 py-4 bg-dama-bg rounded-2xl text-[10px] font-bold text-dama-brown/30 hover:text-dama-sakura transition-colors flex items-center justify-center gap-2"
                    >
                      {tc.collapse}
                      <span className="material-symbols-outlined text-xs">keyboard_arrow_up</span>
                    </button>
                  </div>
                </div>

                {/* Expand Indicator */}
                {!isExpanded && (
                  <div className="mt-4 flex justify-center">
                    <span className="material-symbols-outlined text-dama-brown/10 text-xl transition-transform group-hover:translate-y-1">expand_more</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center mt-12 mb-8 gap-5">
        <p className="text-[11px] font-bold text-dama-brown/20 italic tracking-widest whitespace-pre-wrap text-center">
          「 每天一點新知識，陪妳溫柔啟航 」
        </p>

        <button className="px-10 py-4 bg-white rounded-full border-2 border-dama-sakura/30 text-dama-sakura font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
          更多育兒指南
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;
