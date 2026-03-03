
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, MoodRecord } from '../types';
import { saveMood, getAllData, getDailyKnowledge } from '../services/dbService';
import { translations } from '../data/translations';

const Home: React.FC<{ user: UserProfile, onSyncStatus: any }> = ({ user, onSyncStatus }) => {
  const lang = user.preferredLanguage || 'zh';
  const t = translations[lang].home;
  const tc = translations[lang].common;

  const [moodAdded, setMoodAdded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyKnowledge, setDailyKnowledge] = useState<{ title: string, content: string } | null>(null);

  useEffect(() => {
    const checkTodayMood = async () => {
      const data = await getAllData(user.uid);
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const hasMood = data.moods.some(m => m.date === today);
      setMoodAdded(hasMood);
    };
    checkTodayMood();
  }, [user.uid]);

  const currentWeek = useMemo(() => {
    let week = 12;
    if (user.dueDate) {
      const due = new Date(user.dueDate);
      const today = new Date();
      week = 40 - Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) / 7);
    } else if (user.lmpDate) {
      const lmp = new Date(user.lmpDate);
      week = Math.floor(Math.abs(new Date().getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24) / 7) || 1;
    }
    return Math.max(1, Math.min(42, week));
  }, [user.lmpDate, user.dueDate]);

  useEffect(() => {
    const fetchKnowledge = async () => {
      let daysDiff = 0;
      if (user.isPostpartum && user.birthDate) {
        daysDiff = Math.ceil((new Date().getTime() - new Date(user.birthDate).getTime()) / (1000 * 60 * 60 * 24));
      } else {
        const reference = user.dueDate ? new Date(user.dueDate) : new Date(user.lmpDate!);
        const now = new Date();
        if (user.dueDate) {
          daysDiff = 280 - Math.ceil((reference.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          daysDiff = Math.ceil((now.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      const type = user.isPostpartum ? 'month' : 'week';
      const knowledge = await getDailyKnowledge(user.isPostpartum, daysDiff, type);
      if (knowledge && knowledge.length > 0) {
        setDailyKnowledge({ title: knowledge[0].title, content: knowledge[0].content });
      }
    };
    fetchKnowledge();
  }, [user.uid, user.isPostpartum, user.birthDate, user.dueDate, user.lmpDate]);

  const fruitStage = useMemo(() => {
    if (user.isPostpartum) return 'newborn baby';
    if (currentWeek >= 36) return 'watermelon';
    if (currentWeek >= 28) return 'eggplant';
    if (currentWeek >= 20) return 'banana';
    if (currentWeek >= 12) return 'lemon';
    if (currentWeek >= 8) return 'strawberry';
    return 'poppy seed';
  }, [currentWeek, user.isPostpartum]);

  useEffect(() => {
    const generateDailyIllustration = async (retries = 2) => {
      setIsGenerating(true);
      try {
        let ageText = '';
        if (user.isPostpartum) {
          const days = user.birthDate
            ? Math.ceil((new Date().getTime() - new Date(user.birthDate).getTime()) / (1000 * 60 * 60 * 24))
            : 1;
          ageText = `a newborn baby about ${days} days old`;
        } else {
          ageText = `a fetus at ${currentWeek} weeks of pregnancy, which is roughly the size of a ${fruitStage}`;
        }

        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const prompt = `(Date: ${todayStr}) A super cute, childlike, and joyful nursery - style illustration of ${ageText}. The baby has a big, happy, adorable smile and sparkling eyes. Style: hand-drawn crayon and soft watercolor, playful children's book illustration, vibrant but gentle pastel colors, whimsical, warm and cozy, white background.`;

        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            // 使用經測試可產生圖像的模型
            setGeneratedImg(`data:${data.mimeType || 'image/png'};base64,${data.data}`);
            setIsGenerating(false);
            return;
          }
        }
        throw new Error('Image generation failed');
      } catch (error: any) {
        console.error("Home card image generation failed:", error);
        if (retries > 0) {
          setTimeout(() => generateDailyIllustration(retries - 1), 2000);
          return;
        }
        const fallbackUrl = `https://api.dicebear.com/7.x/not-avataaars/svg?seed=${fruitStage}&backgroundColor=f2cece,f5d8c6`;
        setGeneratedImg(fallbackUrl);
        setIsGenerating(false);
      }
    };

    generateDailyIllustration();
  }, [fruitStage]);

  const moods = [
    { icon: '😄', label: t.moodHappy, key: 'happy' as const },
    { icon: '😌', label: t.moodCalm, key: 'calm' as const },
    { icon: '🥱', label: t.moodTired, key: 'tired' as const },
    { icon: '😔', label: t.moodSad, key: 'sad' as const },
  ];

  const handleMood = async (key: 'happy' | 'calm' | 'tired' | 'sad') => {
    setMoodAdded(true);
    await saveMood(user.uid, key, onSyncStatus);
  };

  const getSubheader = () => {
    if (user.isPostpartum && user.birthDate) {
      const days = Math.ceil((new Date().getTime() - new Date(user.birthDate).getTime()) / (1000 * 60 * 60 * 24));
      return t.babyDays.replace('{days}', String(days));
    }
    return t.pregWeeks.replace('{weeks}', String(currentWeek));
  };

  return (
    <div className="px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="flex justify-between items-center mb-8">
        <div>
          <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-display font-bold text-dama-sakura tracking-tight">DAMALIVE</h1>
          </a>
          <p className="text-[10px] text-dama-brown/60 tracking-widest mt-1 uppercase font-bold">{t.greeting}，{user.name} • {getSubheader()}</p>
        </div>
        <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-dama-sakura shadow-sm object-cover" alt="avatar" />
      </header>

      <section className="bg-white/60 p-6 rounded-[32px] border-2 border-dashed border-dama-sakura mb-10 shadow-sm">
        <h3 className="font-bold text-dama-brown mb-4">{t.moodCheck} {moodAdded && '✨'}</h3>
        <div className="flex justify-between">
          {moods.map(m => (
            <button key={m.key} onClick={() => handleMood(m.key)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-2 border-transparent group-hover:border-dama-sakura transition-all">{m.icon}</div>
              <span className="text-[10px] font-bold text-dama-brown/60">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center mb-10">
        <div
          className="perspective-1000 w-full aspect-[4/3] max-w-[320px] cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-xl border-4 border-dama-sakura/10 overflow-hidden flex flex-col items-center justify-center p-2">
              <div className="w-full h-full relative ring-4 ring-dama-sakura/5 rounded-[32px] overflow-hidden">
                {isGenerating && !generatedImg ? (
                  <div className="w-full h-full bg-dama-bg rounded-[32px] flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-dama-sakura animate-spin">auto_awesome</span>
                    <p className="text-[10px] font-bold text-dama-sakura/60 uppercase tracking-widest">{t.drawing}</p>
                  </div>
                ) : (
                  <img
                    src={generatedImg || 'https://api.dicebear.com/7.x/shapes/svg?seed=loading'}
                    className="w-full h-full object-cover rounded-[32px] animate-in fade-in duration-1000"
                    alt="Daily Illustration"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/not-avataaars/svg?seed=${fruitStage}&backgroundColor=f2cece,f5d8c6`;
                    }}
                  />
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full text-center shadow-sm">
                  <p className="text-[10px] font-bold text-dama-sakura tracking-wider">{t.today}</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[40px] shadow-xl border-4 border-dama-sakura/10 p-7 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar">
              <div className="w-10 h-10 bg-dama-sakura/10 rounded-full flex items-center justify-center mb-3 shrink-0">
                <span className="material-symbols-outlined text-dama-sakura text-sm">auto_awesome</span>
              </div>

              {dailyKnowledge ? (
                <>
                  <h3 className="font-bold text-dama-brown text-sm mb-2">{dailyKnowledge.title}</h3>
                  <p className="text-[11px] text-dama-brown/70 leading-relaxed whitespace-pre-wrap">
                    {dailyKnowledge.content}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-dama-brown text-base mb-2">
                    {user.isPostpartum ? '新手爸媽小技巧' : '孕期心情小叮嚀'}
                  </h3>
                  <p className="text-xs text-dama-brown/70 leading-relaxed">
                    {user.isPostpartum
                      ? "爸爸媽媽可以畫樹狀圖來判斷寶寶哭的原因，一項一項的確認並排除，如果前四項都不是哭泣的原因，那有可能是寶寶身體不舒服，要趕緊帶他去看醫生。"
                      : "無論這段旅程多麼辛苦，記得妳並不孤單。寶寶正在用自己的方式努力長大喔！"}
                  </p>
                </>
              )}

              <div className="mt-4 pt-4 border-t border-dama-sakura/10 w-full shrink-0">
                <p className="text-[9px] font-bold text-dama-sakura uppercase tracking-widest">
                  {user.isPostpartum ? t.growthInsightTitle : t.growthPregTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-[10px] text-dama-brown/30 font-bold italic tracking-wide">{t.slogan}</p>
    </div>
  );
};

export default Home;
