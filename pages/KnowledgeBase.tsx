
import React, { useState } from 'react';
import { UserProfile } from '../types';

type Category = 'nutrition' | 'exercise' | 'wellness';

const KnowledgeBase: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('wellness');

  // 官方衛教資訊內容庫
  const pregnancyData = {
    nutrition: [
      {
        title: '葉酸 (Folate)',
        subtitle: '神經管發育的守護者',
        desc: '懷孕前三個月是寶寶大腦發育關鍵，建議每日攝取 600 微克。',
        tips: ['菠菜、蘆筍', '動物肝臟', '柑橘類水果'],
        source: '國健署：孕期營養指南',
        icon: 'eco',
        color: 'bg-dama-sakura/10'
      },
      {
        title: '鐵質 (Iron)',
        subtitle: '供應寶寶血氧動力',
        desc: '懷孕後期及分娩時失血量大，需加強補充。鐵質吸收建議搭配維生素 C。',
        tips: ['紅肉、黑木耳', '葡萄乾', '紅莧菜'],
        source: '衛福部：孕產婦健康手冊',
        icon: 'bloodtype',
        color: 'bg-red-50'
      },
      {
        title: '鈣質 (Calcium)',
        subtitle: '強化母體與寶寶骨骼',
        desc: '每日建議攝取 1000 毫克，能預防媽咪半夜抽筋與維持骨密度。',
        tips: ['鮮乳、起司', '小魚乾', '黑芝麻'],
        source: '國健署：飲食參考攝取量',
        icon: 'monitor_weight',
        color: 'bg-blue-50'
      }
    ],
    exercise: [
      {
        title: '散步慢走',
        subtitle: '最安全的日常有氧',
        desc: '每日 20-30 分鐘微喘的強度，有助於維持心肺功能，減輕水腫不適。',
        tips: ['穿著舒適運動鞋', '避開極端氣候', '隨時補充水分'],
        source: 'WHO：孕期身體活動建議',
        icon: 'directions_walk',
        color: 'bg-dama-matcha/10'
      },
      {
        title: '凱格爾運動',
        subtitle: '強化盆底肌群',
        desc: '針對骨盆底肌進行收縮訓練，預防懷孕後期與產後的漏尿問題。',
        tips: ['收縮 5 秒放鬆 5 秒', '不要憋氣', '隨時隨地可練習'],
        source: '婦產科醫學會指南',
        icon: 'settings_accessibility',
        color: 'bg-purple-50'
      },
      {
        title: '孕婦瑜珈',
        subtitle: '提升肌肉彈性與穩定度',
        desc: '透過柔和的延展，緩解腰痠背痛，並練習呼吸控制幫助順產。',
        tips: ['尋求專業教練指導', '避免壓迫腹部', '聽從身體訊號'],
        source: '產前健康指導手冊',
        icon: 'self_improvement',
        color: 'bg-orange-50'
      }
    ],
    wellness: [
      {
        title: '心理安適',
        subtitle: '保持心情平和愉快',
        desc: '孕期情緒波動大是正常的。多參與舒適社交，或透過冥想維持內心平靜。',
        tips: ['深呼吸與伸展', '每天 5 分鐘書寫', '聽柔和音樂'],
        source: '產前心理健康手冊',
        icon: 'favorite',
        color: 'bg-rose-50'
      }
    ]
  };

  const postpartumData = {
    nutrition: [ // 這裡變更為「寶寶照顧」
      {
        title: '新生兒安全守則',
        subtitle: '睡眠與環境安全',
        desc: '仰睡最安全，避免趴睡風險。維持室溫24度，並採取「洋蔥式穿法」以應對溫差。',
        tips: ['仰睡避猝死', '避免同床睡', '床墊要平整'],
        source: '兒童健康手冊 (1-122行)',
        icon: 'shield_moon',
        color: 'bg-blue-50'
      },
      {
        title: '看懂寶寶語言',
        subtitle: '解讀哭泣與需求',
        desc: '寶寶透過哭聲表達需求：肚子餓頻率高低交替，尿布濕伴隨蹬腳，想睡則煩躁不安。',
        tips: ['尋乳反應', '蹬腳與煩躁', '2-3小時換尿布'],
        source: '育兒常識指南 (95-118行)',
        icon: 'chat_bubble',
        color: 'bg-amber-50'
      }
    ],
    exercise: [ // 這裡變更為「育兒技巧」
      {
        title: '餵食與拍嗝技術',
        subtitle: '哺乳與奶瓶餵養',
        desc: '支撐頭頸部，掌握空掌輕拍技巧。親餵時利用哺乳枕支撐，減少媽咪體力消耗。',
        tips: ['支撐頭頸', '空掌拍嗝', '瓶餵傾斜角度'],
        source: '產後照護指南 (26-86行)',
        icon: 'baby_changing_station',
        color: 'bg-dama-matcha/10'
      },
      {
        title: '基礎清潔護理',
        subtitle: '洗澡與臍帶護理',
        desc: '橄欖球抱法洗臉頭。臍帶使用75%酒精消毒後，再以95%酒精幫助乾燥。',
        tips: ['橄欖球抱法', '臍帶雙重消毒', '洗屁屁代替濕巾'],
        source: '新生兒護理 (43-78行)',
        icon: 'soap',
        color: 'bg-cyan-50'
      }
    ],
    wellness: [ // 身心調適
      {
        title: '爸媽心靈導航',
        subtitle: '產後憂鬱與焦慮',
        desc: '接受「不完美父母」是常態。情緒要說出來而不是硬撐，家人支持與專業諮詢是關鍵。',
        tips: ['愛丁堡量表自評', '情緒書寫5分鐘', '產後社群交流'],
        source: '產後調適手冊 (284-384行)',
        icon: 'favorite',
        color: 'bg-rose-50'
      },
      {
        title: '睡眠補給策略',
        subtitle: '應對睡眠不足',
        desc: '白天找機會跟著寶寶睡。實施輪流值夜班制，並利用散步曬太陽來調節生理鐘與好心情。',
        tips: ['跟著寶寶睡', '輪流值班歇息', '白天多曬太陽'],
        source: '產後生存指引 (306-343行)',
        icon: 'bed',
        color: 'bg-indigo-50'
      }
    ]
  };

  const data = user.isPostpartum ? postpartumData : pregnancyData;

  const getFooterButtonInfo = () => {
    if (activeCategory === 'nutrition') {
      return {
        label: '查看營養菜譜',
        url: 'https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E6%9C%88%E5%AD%90%E9%A4%90'
      };
    }
    if (activeCategory === 'exercise') {
      return {
        label: '產前瑜珈訓練',
        url: 'https://www.youtube.com/watch?v=-sGq96tPV9E&list=PLiS4JNqIKmHZMeJxpb9goA--kncMWIX6y'
      };
    }
    return {
      label: '更多育兒技巧',
      url: 'https://1125anton.my.canva.site/damalive'
    };
  };

  const footerBtn = getFooterButtonInfo();

  return (
    <div className="px-3 md:px-6 py-6 min-h-screen bg-dama-bg pb-32">
      <header className="flex flex-col items-center mb-8 mt-4">
        {/* 根據截圖：刪除 DAMALIVE 字樣，並將「生育知識庫」放大變為大標題並改變顏色 */}
        <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-dama-brown tracking-widest">生育知識庫</h1>
        </a>
      </header>

      {/* 分類選擇標籤 - 三個標籤 */}
      <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-full mb-10 shadow-inner border border-dama-sakura/10">
        <button
          onClick={() => setActiveCategory('nutrition')}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'nutrition' ? 'bg-dama-sakura text-white shadow-md' : 'text-dama-brown/40'
            }`}
        >
          <span className="material-symbols-outlined text-xs">restaurant</span>
          {user.isPostpartum ? '寶寶照顧' : '營養補充'}
        </button>
        <button
          onClick={() => setActiveCategory('exercise')}
          className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === 'exercise' ? 'bg-dama-matcha text-white shadow-md' : 'text-dama-brown/40'
            }`}
        >
          <span className="material-symbols-outlined text-xs">baby_changing_station</span>
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
        {data[activeCategory].map((item, idx) => (
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
                  {item.tips.map((tip, i) => (
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
          以上資訊僅供參考，如有特定疾病或不適請務必諮詢您的主治醫師。
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
