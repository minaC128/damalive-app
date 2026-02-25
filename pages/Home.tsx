
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, MoodRecord } from '../types';
import { saveMood, getAllData } from '../services/storageService';

import DailyKnowledgeCard from '../components/DailyKnowledgeCard';

const Home: React.FC<{ user: UserProfile, onSyncStatus: any }> = ({ user, onSyncStatus }) => {
  const [moodAdded, setMoodAdded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
        // Fallback to a nice colored placeholder if AI fails
        const fallbackUrl = `https://api.dicebear.com/7.x/not-avataaars/svg?seed=${fruitStage}&backgroundColor=f2cece,f5d8c6`;
        setGeneratedImg(fallbackUrl);
        setIsGenerating(false);
      }
    };

    generateDailyIllustration();
  }, [fruitStage]);

  const moods = [
    { icon: '🍡', label: '愉快', key: 'happy' as const },
    { icon: '🍵', label: '平靜', key: 'calm' as const },
    { icon: '🧸', label: '疲憊', key: 'tired' as const },
    { icon: '☁️', label: '沮喪', key: 'sad' as const },
  ];

  const handleMood = async (key: 'happy' | 'calm' | 'tired' | 'sad') => {
    setMoodAdded(true);
    await saveMood(user.uid, key, onSyncStatus);
  };

  return (
    <div className="px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="flex justify-between items-center mb-8">
        <div>
          <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-display font-bold text-dama-sakura tracking-tight">DAMALIVE</h1>
          </a>
          <p className="text-[10px] text-dama-brown/60 tracking-widest mt-1 uppercase font-bold">早安，{user.name} • {user.isPostpartum && user.birthDate ? `寶寶 ${Math.ceil((new Date().getTime() - new Date(user.birthDate).getTime()) / (1000 * 60 * 60 * 24))} 天大` : `懷孕第 ${currentWeek} 週`}</p>
        </div>
        <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-dama-sakura shadow-sm object-cover" alt="avatar" />
      </header>

      <section className="bg-white/60 p-6 rounded-[32px] border-2 border-dashed border-dama-sakura mb-10 shadow-sm">
        <h3 className="font-bold text-dama-brown mb-4">今日心情 Check-in {moodAdded && '✨'}</h3>
        <div className="flex justify-between">
          {moods.map(m => (
            <button key={m.key} onClick={() => handleMood(m.key)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-2 border-transparent group-hover:border-dama-sakura transition-all">{m.icon}</div>
              <span className="text-[10px] font-bold text-dama-brown/60">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 每日 AI 插畫 (保留翻轉效果，背面改為顯示 DailyKnowledgeCard 的簡介或其他) */}
      <section className="flex flex-col items-center mb-10">
        <div
          className="perspective-1000 w-full aspect-[4/3] max-w-[320px] cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

            {/* Front Side: AI Image */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-xl border-4 border-dama-sakura/10 overflow-hidden flex flex-col items-center justify-center p-2">
              <div className="w-full h-full relative ring-4 ring-dama-sakura/5 rounded-[32px] overflow-hidden">
                {isGenerating && !generatedImg ? (
                  <div className="w-full h-full bg-dama-bg rounded-[32px] flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-dama-sakura animate-spin">auto_awesome</span>
                    <p className="text-[10px] font-bold text-dama-sakura/60 uppercase tracking-widest">繪製暖心插畫中...</p>
                  </div>
                ) : (
                  <img
                    src={generatedImg || 'https://api.dicebear.com/7.x/shapes/svg?seed=loading'}
                    className="w-full h-full object-cover rounded-[32px] animate-in fade-in duration-1000"
                    alt="Daily Illustration"
                  />
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full text-center shadow-sm">
                  <p className="text-[10px] font-bold text-dama-sakura tracking-wider">今日 {fruitStage} 插畫</p>
                </div>
              </div>
            </div>

            {/* Back Side: Dynamic Growth Insight */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[40px] shadow-xl border-4 border-dama-sakura/10 p-7 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-dama-sakura/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-dama-sakura">auto_awesome</span>
              </div>
              <h3 className="font-bold text-dama-brown text-lg mb-3">
                {user.isPostpartum ? `寶寶第 ${Math.ceil((new Date().getTime() - new Date(user.birthDate!).getTime()) / (1000 * 60 * 60 * 24 * 30))} 個月` : `懷孕第 ${currentWeek} 週`}
              </h3>
              <p className="text-xs text-dama-brown/70 leading-relaxed max-w-[240px]">
                {user.isPostpartum ? (() => {
                  const months = Math.ceil((new Date().getTime() - new Date(user.birthDate!).getTime()) / (1000 * 60 * 60 * 24 * 30));
                  if (months <= 1) return "主要活動是睡眠，這正在幫助大腦快速成長。視力雖模糊，但對聲音已有反應感囉。";
                  if (months <= 2) return "寶寶出現「抓握反射」，常跟他握握手或擊掌，能幫助小肌肉與協調性發展。";
                  if (months <= 3) return "現在是抬頭練習期！頸部肌肉變強，寶寶正努力抬起頭觀察這個世界。";
                  if (months <= 4) return "寶寶開始嘗試翻身了！大腦正積極接收各種刺激，多跟他說話可以幫助認知發展。";
                  if (months <= 6) return "副食品時間到囉！這是口腔發展的重要階段，讓寶寶嘗試各種新滋味的奇妙體驗。";
                  return "寶寶正努力學習平衡、爬行與坐立，每一點進步都是他探索世界的勇氣。";
                })() : (() => {
                  if (currentWeek <= 4) return "寶寶現在只有 1 公釐，像顆小芝麻。雖然心臟還在萌芽，但生命力已經非常頑強！";
                  if (currentWeek <= 8) return "心臟、肝臟、腎臟等主要臟器已在形成。在超音波也能聽見寶寶強而有力的心跳聲了。";
                  if (currentWeek <= 12) return "寶寶由「胎芽」畢業成為「胎兒」囉！面部表情神經正在發育，模樣越來越可愛。";
                  if (currentWeek <= 16) return "腦部開始運作！寶寶最喜歡心情平和的媽媽，妳的快樂就是對他最好的胎教。";
                  if (currentWeek <= 20) return "第一次胎動！那是寶寶在跟妳打招呼，說他在裡面住得很舒服、很活潑。";
                  if (currentWeek <= 28) return "寶寶開始能察覺周遭明暗，也會記憶媽咪聲音的節奏。多跟他說說話吧！";
                  if (currentWeek <= 36) return "皮下脂肪附著，可愛的臉蛋出現嬰兒肥囉。寶寶正在為來到這世界做最後衝刺！";
                  return "落紅、破水、規律收縮都是信號。放輕鬆呼吸，妳即將見到一生中最珍貴的禮物。";
                })()}
              </p>
              <div className="mt-5 pt-5 border-t border-dama-sakura/10 w-full">
                <p className="text-[10px] font-bold text-dama-sakura uppercase tracking-widest">
                  {user.isPostpartum ? "育兒階段小撇步" : "孕期成長小叮嚀"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 新增：每日小知識卡片 (動態載入) */}
      <DailyKnowledgeCard user={user} />

      <p className="mt-8 text-center text-[10px] text-dama-brown/30 font-bold italic tracking-wide">「 與寶寶一同成長的每一刻 」</p>
    </div>
  );
};

export default Home;
