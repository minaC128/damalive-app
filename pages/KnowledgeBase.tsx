
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { saveProfile } from '../services/storageService';
import { pregnancyPool, postpartumPool } from '../data/knowledgePool';

type Category = 'nutrition' | 'exercise' | 'wellness';

const KnowledgeBase: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void, onSyncStatus: any }> = ({ user, onUpdateUser, onSyncStatus }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('wellness');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // 每日隨機種子演算法
  const getDailySubset = (pool: any[]) => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = [...pool];
    let m = shuffled.length, t, i;
    let s = seed;
    while (m) {
      s = (s * 9301 + 49297) % 233280;
      i = Math.floor((s / 233280) * m--);
      t = shuffled[m];
      shuffled[m] = shuffled[i];
      shuffled[i] = t;
    }
    return shuffled.slice(0, 3);
  };

  const data = useMemo(() => {
    const pool = user.isPostpartum ? postpartumPool : pregnancyPool;
    return {
      nutrition: getDailySubset(pool.nutrition),
      exercise: getDailySubset(pool.exercise),
      wellness: getDailySubset(pool.wellness)
    };
  }, [user.isPostpartum]);

  const toggleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const currentSaved = user.savedKnowledgeIds || [];
    const isSaved = currentSaved.includes(id);
    const nextSaved = isSaved
      ? currentSaved.filter(iid => iid !== id)
      : [...currentSaved, id];

    const updatedUser = { ...user, savedKnowledgeIds: nextSaved };
    await saveProfile(user.uid, updatedUser, onSyncStatus);
    onUpdateUser(updatedUser);
  };

  const getFooterButtonInfo = () => {
    if (activeCategory === 'nutrition') {
      return {
        label: user.isPostpartum ? '查看育兒好物' : '查看健康食譜',
        url: user.isPostpartum ? 'https://www.mamiessentials.com.tw' : 'https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E5%AD%95%E5%A9%A6'
      };
    }
    if (activeCategory === 'exercise') {
      return {
        label: user.isPostpartum ? '產後修復運動' : '孕期瑜珈教學',
        url: user.isPostpartum ? 'https://www.youtube.com/results?search_query=%E7%94%A2%E5%BE%8C%E9%81%8B%E5%8B%95' : 'https://www.youtube.com/results?search_query=%E5%AD%95%E5%A9%A6%E7%91%9C%E7%8F%88'
      };
    }
    return {
      label: '更多育兒指南',
      url: 'https://1125anton.my.canva.site/damalive'
    };
  };

  const footerBtn = getFooterButtonInfo();

  return (
    <div className="px-3 md:px-6 py-6 min-h-screen bg-dama-bg pb-32">
      <header className="flex flex-col items-center mb-8 mt-4">
        <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-dama-brown tracking-widest">生育知識庫</h1>
        </a>
      </header>

      <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-full mb-10 shadow-inner border border-dama-sakura/10">
        <button
          onClick={() => { setActiveCategory('nutrition'); setExpandedIdx(null); }}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'nutrition' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'}`}
        >
          <span className="material-symbols-outlined text-xs">
            {user.isPostpartum ? 'baby_changing_station' : 'restaurant'}
          </span>
          {user.isPostpartum ? '寶寶照顧' : '營養補充'}
        </button>
        <button
          onClick={() => { setActiveCategory('exercise'); setExpandedIdx(null); }}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'exercise' ? 'bg-dama-matcha text-white shadow-md' : 'text-dama-brown/40'}`}
        >
          <span className="material-symbols-outlined text-xs">
            {user.isPostpartum ? 'child_care' : 'fitness_center'}
          </span>
          {user.isPostpartum ? '育兒技巧' : '運動指南'}
        </button>
        <button
          onClick={() => { setActiveCategory('wellness'); setExpandedIdx(null); }}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'wellness' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'}`}
        >
          <span className="material-symbols-outlined text-xs">favorite</span>
          身心調適
        </button>
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data[activeCategory].map((item: any, idx: number) => {
          const isFaved = user.savedKnowledgeIds?.includes(item.id);
          return (
            <div
              key={idx}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="bg-white rounded-[32px] shadow-lg border border-dama-sakura/5 overflow-hidden cursor-pointer transition-all active:scale-[0.98] group"
            >
              <div className={`p-6 ${item.color} relative overflow-hidden transition-all duration-500 ${expandedIdx === idx ? 'pb-8' : ''}`}>
                <div className="absolute -top-4 -right-4 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45">
                  <span className="material-symbols-outlined text-9xl">{item.icon}</span>
                </div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-dama-brown text-sm">{item.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleSave(e, item.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFaved ? 'bg-dama-sakura text-white' : 'bg-white/60 text-dama-sakura hover:bg-white'}`}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isFaved ? "'FILL' 1" : "''" }}>
                        favorite
                      </span>
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[7px] bg-white/80 px-2 py-0.5 rounded-full font-bold text-dama-brown/60 uppercase tracking-tighter">
                        {item.source}
                      </span>
                      <span className="material-symbols-outlined text-dama-brown/20 text-xs">
                        {expandedIdx === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-dama-brown">{item.title}</h3>
                  <p className="text-[9px] font-bold text-dama-brown/40 uppercase tracking-widest mt-1">{item.subtitle}</p>
                </div>
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${expandedIdx === idx ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 border-t border-dama-sakura/5 bg-white">
                  <div className="text-sm text-dama-brown/80 leading-relaxed whitespace-pre-wrap font-medium bg-dama-bg/30 p-4 rounded-2xl mb-6">
                    {item.fullContent}
                  </div>

                  <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-dama-sakura/10">
                    <p className="text-[10px] font-bold text-dama-brown/40 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">edit_note</span>
                      重點筆記
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tips.map((tip: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-dama-sakura/5 rounded-full text-[10px] font-bold text-dama-brown shadow-sm border border-dama-sakura/5">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {!expandedIdx && expandedIdx !== idx && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-[11px] text-dama-brown/60 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center pb-10">
        <p className="text-[10px] text-dama-brown/30 font-bold mb-4">
          「 每天一點新知識，陪妳溫柔啟航 」
        </p>
        <button
          onClick={() => window.open(footerBtn.url, '_blank')}
          className="bg-white border-2 border-dama-sakura text-dama-sakura px-8 py-3 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all hover:bg-dama-sakura hover:text-white"
        >
          {footerBtn.label}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;
