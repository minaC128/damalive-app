
import React, { useMemo, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { translations } from '../data/translations';

const GrowthTracker: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const lang = user.preferredLanguage || 'zh';
  const t = translations[lang].home;
  const tc = translations[lang].common;

  // 計算目前狀態數據與建議
  const data = useMemo(() => {
    let baseData: any = {};

    if (user.isPostpartum && user.birthDate) {
      // 產後階段
      const birth = new Date(user.birthDate);
      const today = new Date();
      const diffTime = today.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.max(0, Math.floor(diffDays / 30.44));

      let postpartumAdvice = { physical: "", nutrition: "", notice: "", mental: "" };
      if (months <= 1) {
        postpartumAdvice = {
          physical: "惡露排放中，子宮正在收縮回原位，多臥床休息有助體力恢復。",
          nutrition: "攝取優質蛋白質（如魚、雞肉）幫助傷口癒合，適量飲用溫水促進代謝。",
          notice: "避免提重物與爬長樓梯，觀察傷口是否有紅腫熱痛，若有發燒請就醫。",
          mental: "初為人母壓力大，接受不完美的自己，寶寶感受到妳的愛就足夠了。"
        };
      } else if (months <= 6) {
        postpartumAdvice = {
          physical: "荷爾蒙波動可能導致掉髮，這是暫時的現象。可以開始進行產後修復運動。",
          nutrition: "若有哺餵母乳，需多攝取鈣質與 DHA。副食品準備期，多觀察寶寶吞嚥反應。",
          notice: "定期回診檢查身體康復狀況，留意乳房是否有硬塊或不適感。",
          mental: "試著跟伴侶分配育兒任務，讓自己有完整的 2 小時放鬆時間。"
        };
      } else {
        postpartumAdvice = {
          physical: "體力已大致恢復，但長時間抱小孩容易造成媽媽手或腰痠，注意姿勢。",
          nutrition: "與寶寶一起嘗試多樣化原型食物。維持均衡飲食，補充維生素 B 群提升活力。",
          notice: "居家環境安全升級，寶寶開始爬行或學步，插座與尖角需加裝保護套。",
          mental: "重拾妳的愛好，這能幫助妳在母親身份之外找回自我價值感。"
        };
      }

      const title = months >= 11 ? '茁壯的小樹' : (months >= 6 ? '充滿活力的向日葵' : '一株小嫩芽');

      let growthImg = null;
      if (months < 2) growthImg = '/images/growth_1_2.png';
      else if (months < 4) growthImg = '/images/growth_3_4.png';
      else if (months < 6) growthImg = '/images/growth_5_6.png';
      else if (months < 8) growthImg = '/images/growth_7_8.png';
      else growthImg = '/images/growth_9plus.png';

      baseData = {
        fruitName: months >= 11 ? 'small tree' : (months >= 6 ? 'sunflower' : 'sprout'),
        title: title,
        desc: months >= 11 ? '寶寶開始嘗試站立或邁步，對世界充滿好奇心！' : (months >= 6 ? '寶寶開始嘗試副食品了！會翻身也會發出可愛的咿呀聲喔。' : '寶寶正在適應這個新世界，睡眠時間很長。'),
        icon: months >= 11 ? 'forest' : (months >= 6 ? 'local_florist' : 'spa'),
        label: t.babyDays.replace('{days}', String(diffDays)),
        progress: (months / 12) * 100,
        weight: months >= 11 ? '約 9 - 11 kg' : (months >= 6 ? '約 7.5 - 8.5 kg' : '約 3.5 - 4.5 kg'),
        height: months >= 11 ? '約 72 - 76 cm' : (months >= 6 ? '約 65 - 70 cm' : '約 50 - 55 cm'),
        imgEmoji: months >= 11 ? '🌳' : (months >= 6 ? '🌻' : '🌱'),
        mode: 'postpartum',
        momAdvice: postpartumAdvice,
        staticImg: growthImg
      };
    } else {
      // 懷孕階段
      let week = 1;
      if (user.dueDate) {
        const due = new Date(user.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        week = 40 - Math.floor(diffDays / 7);
      } else if (user.lmpDate) {
        const lmp = new Date(user.lmpDate);
        const today = new Date();
        const diffDays = Math.ceil((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
        week = Math.floor(diffDays / 7);
      }
      week = Math.max(1, Math.min(42, week));

      const stageConfig = (w: number) => {
        if (w >= 36) return { name: 'watermelon', title: '寶寶現在像一顆大西瓜', desc: '寶寶已經準備好隨時跟妳見面了，放鬆心情迎接吧！', weight: '約 2600g+', height: '約 47cm+', icon: 'watermelon', emoji: '🍉' };
        if (w >= 28) return { name: 'eggplant', title: '寶寶現在像一顆圓茄子', desc: '眼睛開始會開合囉，他在感受子宮內的微光。', weight: '約 1000g+', height: '約 37cm', icon: 'eggplant', emoji: '🍆' };
        if (w >= 20) return { name: 'banana', title: '寶寶現在像一根香蕉', desc: '寶寶已經能聽到媽咪的聲音了，試著對他說說話吧。', weight: '約 300g', height: '約 16.4cm', icon: 'banana', emoji: '🍌' };
        if (w >= 12) return { name: 'lemon', title: '寶寶現在像一顆檸檬', desc: '指紋正在形成中！這週寶寶的動作會更協調喔。', weight: '約 14g', height: '約 5.4cm', icon: 'lemon', emoji: '🍋' };
        if (w >= 8) return { name: 'strawberry', title: '寶寶現在像一顆樹莓', desc: '心臟已經開始規律跳動了，是非常強韌的小生命。', weight: '約 1g', height: '約 1.6cm', icon: 'raspberry', emoji: '🍓' };
        return { name: 'poppy seed', title: '寶寶現在像一顆罌粟籽', desc: '神經系統正在迅速發展中，媽咪要多補充進口葉酸喔。', weight: '< 1g', height: '約 0.2cm', icon: 'grain', emoji: '✨' };
      };

      const stage = stageConfig(week);

      let momAdvice = { physical: "", nutrition: "", notice: "", mental: "" };
      if (week <= 4) {
        momAdvice = {
          physical: "受精卵正尋找溫暖的著床點，妳可能會感到輕微的疲倦或體溫升高。",
          nutrition: "這週起「葉酸」攝取至關重要，多吃深綠色蔬菜如菠菜與蘆筍。",
          notice: "避免接觸 X 光或強力清潔劑，讓身體保持在最純淨的狀態。",
          mental: "放鬆心情，等待生命的奇蹟扎根，即使有些不安也是正常的反應。"
        };
      } else if (week <= 8) {
        momAdvice = {
          physical: "嗅覺變得很靈敏，晨吐（孕吐）可能開始報到，乳房會感到明顯脹痛。",
          nutrition: "少量多餐能緩解孕吐。蘇打餅乾或乾吐司是早晨醒來時的好夥伴。",
          notice: "遠離菸酒及二手菸，若有異常陰道出血請務必聯繫產科醫生。",
          mental: "第一次聽見心跳聲會是驚喜，跟伴侶分享這份喜悅能減輕焦慮。"
        };
      } else if (week <= 12) {
        momAdvice = {
          physical: "頻尿現象變多，這是子宮增大壓迫膀胱的緣故。嗜睡感依然明顯。",
          nutrition: "多補充鐵質預防貧血。可以開始攝取含維生素 C 的水果幫助吸收。",
          notice: "準備第一次正式產檢。現在起不宜搬運重物或進行劇烈搖晃運動。",
          mental: "初期狀況漸趨穩定，對寶寶的健康感到安心一點了嗎？妳做得很好。"
        };
      } else if (week <= 16) {
        momAdvice = {
          physical: "進入舒適的第二孕期！害喜減緩，食慾開始恢復，肚子開始微凸。",
          nutrition: "這週起補充鈣質很重要，鮮奶或小魚乾能預防妳抽筋並幫助寶寶骨骼發育。",
          notice: "可以換上彈性好的孕婦褲，減少腹部受壓。適度散步能維持體力。",
          mental: "體力恢復了，跟伴侶來場小約會吧，維持親密關係也是胎教的一部分。"
        };
      } else if (week <= 20) {
        momAdvice = {
          physical: "妳可能會感覺到第一次胎動，像泡泡或小魚在游泳。腰椎負擔逐漸變大。",
          nutrition: "增加 DHA 攝取幫助寶寶大腦與視力發展，核桃與藻油是優質來源。",
          notice: "注意站姿與坐姿，別長時間久坐。可以練習凱格爾運動預防漏尿。",
          mental: "寶寶聽覺發展中，多對肚子說話或播放柔和音樂，建立你們的專屬連結。"
        };
      } else if (week <= 24) {
        momAdvice = {
          physical: "子宮高度接近肚臍，皮膚可能因擴張感到搔癢，可以開始塗抹妊娠油或乳液。",
          nutrition: "注意糖分攝取，準備迎接妊娠糖尿病篩檢（喝糖水挑戰）。",
          notice: "容易出現小腿水腫，晚上睡覺時可以墊個枕頭抬高腿部。",
          mental: "感受寶寶規規律的作息，妳會發現他也有自己的睡覺與活動時間喔。"
        };
      } else if (week <= 28) {
        momAdvice = {
          physical: "正式進入第三孕期。肚子大得很有感，呼吸開始覺得有些淺，動作變緩慢。",
          nutrition: "加強補鐵，預防中後期生理性貧血。適量吃紅肉或紅莧菜。",
          notice: "學會算胎動，若一整天胎動明顯減少，請務必隨時聯繫醫院。",
          mental: "開始有產前壓力了嗎？找幾位媽咪朋友聊聊，或是諮詢小達緩解緊張。"
        };
      } else if (week <= 32) {
        momAdvice = {
          physical: "子宮壓迫胃部可能導致胃食道逆流。恥骨聯合處偶爾會有悶痛感。",
          nutrition: "維持優質蛋白質，減少重口味與加工食品，避免水腫加劇。",
          notice: "開始準備待產包與寶寶用品，這能讓妳在心理上更有掌控感。",
          mental: "寶寶開始佔據妳大部分的思緒，享受這份即將見面前的甜蜜倒數。"
        };
      } else if (week <= 36) {
        momAdvice = {
          physical: "假性陣痛（肚子發硬）變頻繁。寶寶入盆後會覺得呼吸稍微順暢，但頻尿更嚴重。",
          nutrition: "保持體力，但別過度大吃大喝，以免寶寶過大增加生產難度。",
          notice: "練習拉梅茲呼吸法。注意是否有破水、規則陣痛或見紅等產兆。",
          mental: "相信自己的身體與醫護團隊，妳與寶寶已經一起度過了最艱難的時刻。",
        };
      } else {
        momAdvice = {
          physical: "隨時都可能有產兆。妳的身體已完全準備好迎接分娩，下墜感會很明顯。",
          nutrition: "攝取清淡、好消化的食物，隨時為生產儲備爆發性能量。",
          notice: "手機保持電力、醫院聯絡方式設為快捷鍵，放輕鬆迎接新成員。",
          mental: "即將開啟全新篇章，妳會是一位很棒的媽咪。加油，我們都為妳打氣！"
        };
      }

      baseData = {
        ...stage,
        fruitName: stage.name,
        label: t.pregWeeks.replace('{weeks}', String(week)),
        progress: (week / 40) * 100,
        mode: 'pregnancy',
        momAdvice
      };
    }
    return baseData;
  }, [user, t]);

  // 使用 Nano Banana 生成圖片
  useEffect(() => {
    const generateImage = async (retries = 2) => {
      // 如果有靜態圖片，直接使用
      if (data.staticImg) {
        setGeneratedImg(data.staticImg);
        setIsGenerating(false);
        return;
      }

      setIsGenerating(true);
      try {
        const prompt = `A playful and childlike children's book illustration of a cute ${data.fruitName} with a happy, smiling face and tiny hands/feet. Style: soft colored pencils, kawaii nursery art, vibrant pastel tones, hand-drawn with heart, whimsical and friendly, fills the frame, high quality.`;

        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setGeneratedImg(`data:${result.mimeType || 'image/png'};base64,${result.data}`);
            setIsGenerating(false);
            return;
          }
        }
        throw new Error('Image generation failed');
      } catch (error: any) {
        console.error("GrowthTracker image generation failed:", error);
        if (retries > 0) {
          setTimeout(() => generateImage(retries - 1), 3000);
          return;
        }
        setGeneratedImg(`https://api.dicebear.com/7.x/shapes/svg?seed=${data.fruitName}&backgroundColor=FFB7C5`);
        setIsGenerating(false);
      }
    };

    generateImage();
  }, [data.fruitName]);

  return (
    <div className="px-6 py-6 min-h-screen bg-dama-bg">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold text-dama-brown uppercase tracking-tight">{translations[lang].nav.journey}</h1>
      </div>

      <div className="flex bg-white/50 backdrop-blur-sm rounded-full p-1.5 mb-8 shadow-inner border border-dama-sakura/10">
        <div className={`flex-1 py-3 rounded-full text-xs font-bold text-center transition-all ${data.mode === 'pregnancy' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'}`}>
          {tc.pregnant}
        </div>
        <div className={`flex-1 py-3 rounded-full text-xs font-bold text-center transition-all ${data.mode === 'postpartum' ? 'bg-dama-matcha text-white shadow-md' : 'text-dama-brown/40'}`}>
          {tc.postpartum}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border-4 border-double border-dama-sakura/30 shadow-xl p-8 flex flex-col items-center relative overflow-hidden mb-10">
        <div className="text-center mb-6 relative z-10">
          <p className="text-dama-sakura font-bold text-sm tracking-[0.2em] mb-1">
            {data.mode === 'pregnancy' ? translations[lang].nav.journey : '寶寶成長'}
          </p>
          <h2 className="text-2xl font-bold text-dama-brown">{data.title}</h2>
        </div>

        <div className="w-full aspect-square max-w-[280px] bg-dama-bg rounded-[56px] border-2 border-dashed border-dama-sakura/40 flex items-center justify-center shadow-[inset_0_4px_12px_rgba(242,206,206,0.2)] relative mb-8 transition-transform overflow-hidden hover:scale-[1.02]">
          {isGenerating && !generatedImg ? (
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-dama-sakura animate-spin">auto_awesome</span>
              <p className="text-[10px] font-bold text-dama-sakura/60 uppercase tracking-widest">繪製暖心中...</p>
            </div>
          ) : (
            <img
              alt={data.fruitName}
              className="w-full h-full object-contain p-4 animate-in fade-in zoom-in-90 duration-1000"
              src={generatedImg || 'https://api.dicebear.com/7.x/shapes/svg?seed=loading_growth'}
            />
          )}
        </div>

        <div className="bg-dama-bg/50 p-6 rounded-3xl w-full border border-dama-sakura/10 relative z-10">
          <h4 className="text-[10px] font-bold text-dama-brown/40 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">edit_note</span>
            寶寶狀態
          </h4>
          <p className="text-center text-dama-brown/80 leading-relaxed italic text-sm">
            "{data.desc}"
          </p>
        </div>
      </div>

      <section className="animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-bold text-dama-brown">媽咪專屬週報</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] border border-dama-sakura/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3 text-dama-matcha">
              <span className="material-symbols-outlined text-xl">accessibility_new</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">身體變化</span>
            </div>
            <p className="text-xs text-dama-brown/80 leading-relaxed font-medium">{data.momAdvice.physical}</p>
          </div>

          <div className="bg-white p-5 rounded-[32px] border border-dama-sakura/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3 text-orange-300">
              <span className="material-symbols-outlined text-xl">restaurant</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">營養與運動</span>
            </div>
            <p className="text-xs text-dama-brown/80 leading-relaxed font-medium">{data.momAdvice.nutrition}</p>
          </div>

          <div className="bg-white p-5 rounded-[32px] border border-dama-sakura/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3 text-dama-sakura">
              <span className="material-symbols-outlined text-xl">priority_high</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">注意事項</span>
            </div>
            <p className="text-xs text-dama-brown/80 leading-relaxed font-medium">{data.momAdvice.notice}</p>
          </div>

          <div className="bg-white p-5 rounded-[32px] border border-dama-sakura/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3 text-blue-300">
              <span className="material-symbols-outlined text-xl">psychology</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">心理健康</span>
            </div>
            <p className="text-xs text-dama-brown/80 leading-relaxed font-medium">{data.momAdvice.mental}</p>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-4">
        <div className="flex justify-between items-end mb-1 px-1">
          <span className="font-bold text-dama-brown text-sm">目前的階段</span>
          <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${data.mode === 'pregnancy' ? 'bg-dama-sakura' : 'bg-dama-matcha'}`}>
            {data.label}
          </span>
        </div>
        <div className="w-full h-3 bg-white border border-dama-sakura/10 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${data.mode === 'pregnancy' ? 'bg-dama-sakura' : 'bg-dama-matcha'}`}
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pb-24">
        <div className="bg-white p-6 rounded-[32px] border border-dama-sakura/5 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-dama-sakura mb-1 text-3xl">monitor_weight</span>
          <p className="text-[10px] font-bold text-dama-brown/30 uppercase tracking-tighter">預估重量</p>
          <p className="text-xl font-bold text-dama-brown mt-1">{data.weight}</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-dama-sakura/5 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-dama-matcha mb-1 text-3xl">straighten</span>
          <p className="text-[10px] font-bold text-dama-brown/30 uppercase tracking-tighter">預估身高</p>
          <p className="text-xl font-bold text-dama-brown mt-1">{data.height}</p>
        </div>
      </div>
    </div>
  );
};

export default GrowthTracker;
