import React, { useState, useEffect } from 'react';
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

    // 根據語言選擇對應的知識池
    const langKey = user.preferredLanguage || 'zh';
    const langPool = user.isPostpartum ? postpartumPool : pregnancyPool;
    const currentLangPool = langPool[langKey] || langPool['zh'];
    const pool = currentLangPool[activeTab] || [];

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
      <header className="mb-8 flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-dama-brown flex items-center gap-2">
            <span className="material-symbols-outlined text-dama-sakura text-2xl">menu_book</span>
            {t.title}
          </h2>
          <p className="text-[10px] font-bold text-dama-sakura/60 uppercase tracking-widest mt-1">
            {user.isPostpartum ? '產後成長與護理指南' : '孕期健康與發展百科'}
          </p>
        </div>
      </header>

      <div className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm p-1.5 rounded-3xl shadow-inner border border-dama-sakura/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpandedItem(null); }}
            className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${activeTab === tab.id ? 'bg-dama-sakura text-white shadow-md scale-[1.02]' : 'text-dama-brown/40 hover:bg-white/50'}`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
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
              className="bg-white rounded-[40px] shadow-sm border border-dama-sakura/5 overflow-hidden transition-all duration-500 cursor-pointer active:scale-[0.98] group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className={`p-6 ${item.color} relative overflow-hidden transition-all duration-500 ${isExpanded ? 'pb-8' : ''}`}>
                <div className="absolute -top-4 -right-4 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[100px]">{item.icon}</span>
                </div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-dama-brown text-lg">{item.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-white/80 px-3 py-1 rounded-full font-bold text-dama-brown/60 uppercase tracking-widest">
                      {item.source}
                    </span>
                    <button
                      onClick={(e) => handleToggleSave(e, item.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isSaved ? 'bg-dama-sakura text-white scale-110' : 'bg-white/90 text-dama-sakura hover:scale-110'}`}
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 pr-12">
                  <h3 className="text-xl font-bold text-dama-brown pr-4 break-words leading-tight">{item.title}</h3>
                  <p className="text-[9px] font-bold text-dama-brown/40 uppercase tracking-[0.2em] mt-2 mb-1 leading-none">{item.subtitle}</p>
                </div>

                <div className={`absolute right-6 bottom-6 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                  <span className="material-symbols-outlined text-dama-brown/20">expand_more</span>
                </div>
              </div>

              {/* Bottom White Area for Content */}
              <div className="bg-white px-6 py-4 border-t border-dama-sakura/5">
                <p className="text-xs text-dama-brown/60 leading-relaxed font-medium">{item.content}</p>
              </div>

              <div className={`transition-all duration-500 ease-in-out bg-white ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8 border-t border-dama-sakura/5">
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
                        <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-dama-sakura/5 shadow-sm hover:shadow-md transition-shadow">
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
            </div>
          );
        })}
      </div>
      <p className="text-center mt-12 mb-8 text-[10px] font-bold text-dama-brown/20 italic tracking-widest">
        「 專屬於妳的智慧百科，陪伴成長的每一天 」
      </p>
    </div>
  );
};

export default KnowledgeBase;
