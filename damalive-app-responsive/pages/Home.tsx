
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
  const [showMoodWarning, setShowMoodWarning] = useState(false);

  useEffect(() => {
    const checkTodayMood = async () => {
      const data = await getAllData(user.uid);
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const hasMood = data.moods.some(m => m.date === today);
      setMoodAdded(hasMood);

      // 檢查連續 3 天負面情緒 (疲憊 tired 或 沮喪 sad)
      const sortedMoods = [...data.moods].sort((a, b) => b.date.localeCompare(a.date));
      if (sortedMoods.length >= 3) {
        const lastThreeMoods = sortedMoods.slice(0, 3);
        const isNegativeTrend = lastThreeMoods.every(m => m.mood === 'tired' || m.mood === 'sad');
        setShowMoodWarning(isNegativeTrend);
      }
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
      const knowledge = await getDailyKnowledge(user.isPostpartum, daysDiff, type, lang as any);
      if (knowledge && knowledge.length > 0) {
        const item = knowledge[0];
        setDailyKnowledge({
          title: item.title,
          content: item.content
        });
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
    const generateDailyIllustration = async (retries = 0) => {
      setIsGenerating(true);

      try {
        // 新增：針對產後 1-12 個月使用特定的插圖
        if (user.isPostpartum && user.birthDate) {
          const days = Math.ceil((new Date().getTime() - new Date(user.birthDate).getTime()) / (1000 * 60 * 60 * 24));
          const month = Math.floor(days / 30) + 1;

          if (month >= 1 && month <= 12) {
            setGeneratedImg(`/images/baby_${month}m.png`);
            setIsGenerating(false);
            return;
          }
        }

        // 新增：針對孕期 1-10 個月使用特定的插圖 (覆蓋 Poppy Seed)
        if (!user.isPostpartum) {
          const pregMonth = Math.ceil(currentWeek / 4);
          if (pregMonth >= 1 && pregMonth <= 10) {
            setGeneratedImg(`/images/preg_month_${pregMonth}.png`);
            setIsGenerating(false);
            return;
          }
        }

        // 保持 Poppy Seed 邏輯作為備用或初期 (通常 month 1 已包含)
        if (!user.isPostpartum && currentWeek < 8 && !generatedImg) {
          setGeneratedImg('/images/poppy_seed.png');
          setIsGenerating(false);
          return;
        }

        let ageText = user.isPostpartum ? 'newborn baby' : `fetus at ${currentWeek} weeks`;
        const prompt = `Minimalist nursery illustration of ${ageText}. Soft watercolor, pastel colors, white background, cute children's book style.`;

        // 優先嘗試客戶端直接生成 (繞過 Netlify 10秒限制)
        const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (clientApiKey) {
          console.log("Attempting direct AI generation (Multi-Model Fallback)...");
          const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];

          for (const modelName of models) {
            try {
              const clientResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${clientApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt + " Output image only." }] }]
                })
              });

              if (clientResponse.ok) {
                const result = await clientResponse.json();
                const part = result.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                if (part?.inlineData) {
                  setGeneratedImg(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
                  setIsGenerating(false);
                  return;
                }
              }
            } catch (e) {
              console.warn(`${modelName} failed, trying next...`);
            }
          }
        }

        // 如果客戶端失敗或沒設定，才用原本的後台代理 (有超時風險)
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setGeneratedImg(`data:${data.mimeType || 'image/png'};base64,${data.data}`);
            setIsGenerating(false);
            return;
          }
        }
        throw new Error('Image creation failed');
      } catch (error: any) {
        console.warn("Using fallback illustration:", error);
        // 換成更可愛的寶寶備用圖
        const fallbackUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${fruitStage}&backgroundColor=f2cece&scale=120`;
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
      <header className="flex justify-between items-center mb-8 px-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-dama-sakura tracking-tighter">DAMALIVE</h1>
          </div>
          <p className="text-[10px] text-dama-brown/60 tracking-widest mt-1 uppercase font-bold">{t.greeting} • {user.name} • {getSubheader()}</p>
        </div>
        <img src={user.avatar} className="w-11 h-11 rounded-full border-2 border-dama-sakura/30 shadow-sm object-cover" alt="avatar" />
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

      {showMoodWarning && (
        <div className="mb-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-dama-sakura/5 border border-dama-sakura/20 p-4 rounded-2xl flex items-center gap-4 shadow-sm border-dashed">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-dama-sakura text-xl">favorite</span>
            </div>
            <p className="text-[11px] font-bold text-dama-brown leading-relaxed">
              媽咪最近辛苦了，我偵測到妳最近可能比較疲累或沮喪。
              <span className="block text-dama-sakura/80 mt-1">記得要注意心情變化，不要太過操勞，適時給自己一點放鬆的時間喔～💖</span>
            </p>
          </div>
        </div>
      )
      }

      <section className="flex flex-col items-center mb-10">
        <div
          className="perspective-1000 w-full aspect-[4/3] max-w-[320px] md:max-w-md cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-xl border-4 border-dama-sakura/10 overflow-hidden flex flex-col items-center justify-center p-2">
              <div className="w-full h-full relative ring-4 ring-dama-sakura/5 rounded-[32px] overflow-hidden bg-white">
                {isGenerating && !generatedImg ? (
                  <div className="w-full h-full bg-dama-sakura/5 rounded-[32px] flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-dama-sakura animate-spin">auto_awesome</span>
                    <p className="text-[10px] font-bold text-dama-sakura/60 uppercase tracking-widest">{t.drawing}</p>
                  </div>
                ) : (
                  <img
                    src={generatedImg || 'https://api.dicebear.com/7.x/shapes/svg?seed=loading'}
                    className="w-full h-full object-contain p-4 rounded-[32px] animate-in fade-in duration-1000"
                    alt="Illustration"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${fruitStage}&backgroundColor=f2cece&scale=120`;
                    }}
                  />
                )}
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

      <p className="mt-4 text-center text-[10px] text-dama-brown/30 font-bold tracking-wider">點擊卡片可以翻轉</p>
      <p className="mt-4 text-center text-[10px] text-dama-brown/20 font-bold italic tracking-wide">{t.slogan}</p>
    </div >
  );
};

export default Home;
