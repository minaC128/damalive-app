
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';

type Category = 'nutrition' | 'exercise' | 'wellness';

const KnowledgeBase: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('wellness');

  // 每日隨機種子演算法：確保今日內容固定，明日自動更換
  const getDailySubset = (pool: any[]) => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 簡單的隨機打亂演算法 (Fisher-Yates with seed)
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
    // 每天顯示 3 條隨機內容
    return shuffled.slice(0, 3);
  };

  // 官方衛教資訊內容庫 - 完整池
  const pregnancyPool = {
    nutrition: [
      { title: '葉酸 (Folate)', subtitle: '神經管守護者', desc: '懷孕前三個月關鍵，建議每日 600 微克。', tips: ['菠菜、蘆筍', '動物肝臟', '柑橘'], source: '孕期營養 (2).txt', icon: 'eco', color: 'bg-dama-sakura/10' },
      { title: '鐵質 (Iron)', subtitle: '供應血氧團隊', desc: '後期及分娩時失血量大，需加強補充。', tips: ['紅肉、黑木耳', '葡萄乾', '紅莧菜'], source: '孕期營養 (2).txt', icon: 'bloodtype', color: 'bg-red-50' },
      { title: '鈣質 (Calcium)', subtitle: '骨骼強化動力', desc: '預防媽咪半夜抽筋與維持骨密度。', tips: ['鮮乳、起司', '小魚乾', '黑芝麻'], source: '孕期營養 (2).txt', icon: 'monitor_weight', color: 'bg-blue-50' },
      { title: 'DHA/Omega-3', subtitle: '腦部發展黃金期', desc: '有助於寶寶腦部與視網膜發育。', tips: ['深海魚', '核桃', '藻油'], source: '孕期營養 (2).txt', icon: 'psychology', color: 'bg-cyan-50' },
      { title: '膳食纖維', subtitle: '腸胃順暢不卡關', desc: '緩解孕期常見的便秘不適。', tips: ['地瓜、玉米', '燕麥', '各種綠葉菜'], source: '孕期營養 (2).txt', icon: 'energy_savings_leaf', color: 'bg-green-50' }
    ],
    exercise: [
      { title: '散步慢走', subtitle: '最安全有氧', desc: '每日 20-30 分鐘，維持心肺功能。', tips: ['舒適運動鞋', '避開極端氣候', '補充水分'], source: '運動指南 (2).txt', icon: 'directions_walk', color: 'bg-dama-matcha/10' },
      { title: '凱格爾運動', subtitle: '強化盆底肌', desc: '訓練骨盆肌肉感，預防產後漏尿。', tips: ['收縮5秒放鬆5秒', '不要憋氣', '隨時練習'], source: '運動指南 (2).txt', icon: 'settings_accessibility', color: 'bg-purple-50' },
      { title: '孕婦瑜珈', subtitle: '肌肉穩定延伸', desc: '緩解腰痠背痛，練習呼吸幫助順產。', tips: ['專業指導', '避免壓腹', '聽從訊號'], source: '運動指南 (2).txt', icon: 'self_improvement', color: 'bg-orange-50' },
      { title: '產前呼吸法', subtitle: '生產痛感管理', desc: '透過調節呼吸，幫助待產時放鬆子宮頸。', tips: ['腹式呼吸', '拉梅茲', '冥想配合'], source: '運動指南 (2).txt', icon: 'air', color: 'bg-blue-50' }
    ],
    wellness: [
      { title: '心理安適', subtitle: '保持心情愉快', desc: '情緒波動是正常的。透過社交維持平衡。', tips: ['深呼吸', '每日5分鐘書寫', '輕快音樂'], source: '心靈錦囊-465行', icon: 'favorite', color: 'bg-rose-50' },
      { title: '隊友支持', subtitle: '最強神隊友', desc: '請先生共同參與產檢，分擔家務壓力。', tips: ['有效溝通', '一起佈置寶寶房', '按摩肩頸'], source: '心靈錦囊-465行', icon: 'groups', color: 'bg-indigo-50' }
    ]
  };

  const postpartumPool = {
    nutrition: [ // 寶寶照顧
      { title: '安全睡眠環境', subtitle: '仰睡最安全', desc: '避免同床，床墊要平整，不放多餘填充玩偶。', tips: ['仰睡避猝死', '室溫24度', '洋蔥式穿法'], source: '照顧手冊-10行', icon: 'shield_moon', color: 'bg-blue-50' },
      { title: '看懂聽懂語言', subtitle: '哭泣的需求', desc: '肚子餓、尿布濕、想睡覺，哭聲都有細微差異。', tips: ['尋乳動作', '蹬腳表情', '揉眼哈欠'], source: '照顧手冊-95行', icon: 'chat_bubble', color: 'bg-amber-50' },
      { title: '體溫調節', subtitle: '冷暖判斷標準', desc: '不要過度包裹。判斷寶寶冷熱，摸後頸最準確。', tips: ['後頸溫熱即剛好', '流汗要脫衣', '避免同床過熱'], source: '照顧手冊-12行', icon: 'thermostat', color: 'bg-red-50' }
    ],
    exercise: [ // 育兒技巧
      { title: '洗澡：橄欖球抱', subtitle: '安全洗滌法', desc: '側抱腋下支撐後頸，拇指扣住耳朵避進水。', tips: ['先洗臉再洗頭', '後洗身體皺褶', '布巾輕擦乾'], source: '育兒技巧-43行', icon: 'soap', color: 'bg-cyan-50' },
      { title: '拍嗝與瓶餵', subtitle: '消化不擊敗', desc: '托住下巴側坐，空掌輕拍背部直到排氣。', tips: ['奶嘴充滿奶水', '不要強迫餵完', '托下巴頸部'], source: '育兒技巧-82行', icon: 'baby_changing_station', color: 'bg-dama-matcha/10' },
      { title: '臍帶與清潔', subtitle: '基礎護理必修', desc: '75%酒精由內往外環狀消毒，95%酒精乾燥。', tips: ['根部由內往外', '保持乾燥', '洗屁屁更勝濕巾'], source: '育兒技巧-76行', icon: 'medical_services', color: 'bg-teal-50' },
      { title: '哄睡與安撫', subtitle: '高質量睡眠', desc: '揉眼哈欠即是信號。輕拍背部或溫柔撫摸。', tips: ['安撫奶嘴', '白噪音模擬子宮', '避免過度勞累'], source: '育兒技巧-70行', icon: 'bedtime', color: 'bg-indigo-50' }
    ],
    wellness: [ // 身心調適
      { title: '心靈導航', subtitle: '不完美父母', desc: '接受混亂是轉換期常態。累了要說，不是硬撐。', tips: ['愛丁堡量表', '家人傾聽', '調整期待'], source: '身心調適-353行', icon: 'favorite', color: 'bg-rose-50' },
      { title: '補眠生存戰', subtitle: '碎片化休息', desc: '跟著寶寶一起睡。實施輪流值班，保障深夜睡眠。', tips: ['白天曬太陽', '輪流夜半值勤', '家務非首要'], source: '身心調適-322行', icon: 'king_bed', color: 'bg-indigo-50' },
      { title: '自我時間', subtitle: '壓力管理', desc: '每天給自己 5 分鐘情緒書寫，舒緩身心壓力。', tips: ['情緒書寫', '輕度活動', '新手爸媽社群'], source: '身心調適-368行', icon: 'self_improvement', color: 'bg-teal-50' }
    ]
  };

  // 每日本月隨機選取的結果
  const data = useMemo(() => {
    const pool = user.isPostpartum ? postpartumPool : pregnancyPool;
    return {
      nutrition: getDailySubset(pool.nutrition),
      exercise: getDailySubset(pool.exercise),
      wellness: getDailySubset(pool.wellness)
    };
  }, [user.isPostpartum]);

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

      {/* 分類選擇標籤 */}
      <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-full mb-10 shadow-inner border border-dama-sakura/10">
        <button
          onClick={() => setActiveCategory('nutrition')}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'nutrition' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'
            }`}
        >
          <span className="material-symbols-outlined text-xs">
            {user.isPostpartum ? 'baby_changing_station' : 'restaurant'}
          </span>
          {user.isPostpartum ? '寶寶照顧' : '營養補充'}
        </button>
        <button
          onClick={() => setActiveCategory('exercise')}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'exercise' ? 'bg-dama-matcha text-white shadow-md' : 'text-dama-brown/40'
            }`}
        >
          <span className="material-symbols-outlined text-xs">
            {user.isPostpartum ? 'child_care' : 'fitness_center'}
          </span>
          {user.isPostpartum ? '育兒技巧' : '運動指南'}
        </button>
        <button
          onClick={() => setActiveCategory('wellness')}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'wellness' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'
            }`}
        >
          <span className="material-symbols-outlined text-xs">favorite</span>
          身心調適
        </button>
      </div>

      {/* 衛教內容顯示 */}
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data[activeCategory].map((item: any, idx: number) => (
          <div key={idx} className="bg-white rounded-[40px] shadow-xl border border-dama-sakura/5 overflow-hidden group">
            <div className={`p-8 ${item.color} relative overflow-hidden`}>
              <div className="absolute -top-4 -right-4 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45">
                <span className="material-symbols-outlined text-9xl">{item.icon}</span>
              </div>

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-dama-brown">{item.icon}</span>
                </div>
                <span className="text-[8px] bg-white/80 px-3 py-1 rounded-full font-bold text-dama-brown/60 uppercase tracking-tighter">
                  {item.source}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-dama-brown">{item.title}</h3>
                <p className="text-[10px] font-bold text-dama-brown/40 uppercase tracking-widest mt-1">{item.subtitle}</p>
              </div>
            </div>

            <div className="p-8">
              <p className="text-sm text-dama-brown/70 leading-relaxed mb-6 font-medium">
                {item.desc}
              </p>

              <div className="bg-dama-bg p-5 rounded-3xl border-2 border-dashed border-dama-sakura/20">
                <p className="text-[10px] font-bold text-dama-brown/40 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">edit_note</span>
                  重點筆記
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tips.map((tip: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white rounded-full text-[10px] font-bold text-dama-brown shadow-sm border border-black/5">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部行動呼籲 */}
      <div className="mt-12 text-center pb-10">
        <p className="text-[10px] text-dama-brown/30 font-bold mb-4">
          「 每天一點新知識，陪妳溫柔啟航 」
        </p>
        <button
          onClick={() => window.open(footerBtn.url, '_blank')}
          className="bg-white border-2 border-dama-sakura text-dama-sakura px-8 py-4 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all hover:bg-dama-sakura hover:text-white"
        >
          {footerBtn.label}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;
