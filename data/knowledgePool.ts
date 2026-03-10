import { KnowledgeItem } from '../types';

export const pregnancyPool: { [key: string]: { [category: string]: KnowledgeItem[] } } = {
    zh: {
        nutrition: [
            {
                id: 'preg_folate',
                title: '葉酸 (Folate)',
                subtitle: '神經管守護者',
                content: '幫助寶寶腦部和脊髓發育。',
                fullContent: '🧠 葉酸｜重要性：\n懷孕初期是寶寶腦部與神經發育的關鍵時期。缺乏葉酸會增加先天性神經發育問題的風險。\n\n* 攝取時機：\n👉 懷孕前 ～ 懷孕 12 週特別重要\n\n* 推薦食物：\n- 深綠色蔬菜（菠菜、紅莧菜、空心菜等）\n- 豆類、豆製品（燕麥、紅豆、綠豆、鷹嘴豆）\n- 動物肝臟（豬肝、雞肝）、鯖魚、牡蠣',
                tips: ['菠菜、蘆筍', '動物肝臟', '懷孕初期必備'],
                source: '孕期營養',
                icon: 'eco',
                color: 'bg-dama-sakura/10',
                minWeek: 1,
                maxWeek: 16
            },
            {
                id: 'preg_iodine',
                title: '碘 (Iodine)',
                subtitle: '智力發展關鍵',
                content: '幫助寶寶生長與智力發展，預防發育遲緩。',
                fullContent: '🧂 碘｜重要性：\n碘不足可能影響寶寶的成長與學習能力，嚴重時甚至增加流產風險。\n\n* 怎麼補充？\n- 家中料理使用「加碘鹽」\n- 適量吃海帶、海藻類\n- ⚠️ 提醒：若有甲狀腺疾病，請先詢問醫師',
                tips: ['加碘鹽', '海帶、海菜', '甲狀腺注意'],
                source: '孕期營養',
                icon: 'egg_alt',
                color: 'bg-blue-50',
                minWeek: 1,
                maxWeek: 40
            },
            {
                id: 'preg_iron',
                title: '鐵質 (Iron)',
                subtitle: '供應血氧團隊',
                content: '預防貧血與早產，應付後期血量需求。',
                fullContent: '🩸 鐵｜重要性：\n懷孕時媽媽的血量會增加，若鐵不足容易貧血，增加早產風險。\n\n* 怎麼補充？\n- 紅肉（牛肉、豬肉）\n- 深綠色蔬菜、豆干、豆腐\n- 到懷孕後期對鐵的需求會增加，可依醫師建議補充額外營養品',
                tips: ['紅肉、黑木耳', '葡萄乾', '紅莧菜'],
                source: '孕期營養',
                icon: 'bloodtype',
                color: 'bg-red-50',
                minWeek: 20,
                maxWeek: 40
            }
        ],
        exercise: [
            {
                id: 'preg_walk',
                title: '步行散步',
                subtitle: '安全有氧首選',
                content: '運動不是不行，重點是安全、適度。',
                fullContent: '🚶‍♀️ 步行｜簡單且最安全：\n有助心肺健康、增強血液循環，減少疲倦和水腫。\n\n* 運動關鍵：\n- 穿著舒適運動鞋\n- 避開極端氣候\n- 隨時補充水分\n- 建議每天 20–30 分鐘',
                tips: ['維持心肺功能', '控制體重', '提升睡眠'],
                source: '運動指南',
                icon: 'directions_walk',
                color: 'bg-dama-matcha/10',
                minWeek: 1,
                maxWeek: 40
            },
            {
                id: 'preg_swim',
                title: '游泳與水中運動',
                subtitle: '水的浮力支撐',
                content: '舒緩關節與背部壓力。',
                fullContent: '🏊‍♀️ 游泳｜零重力體驗：\n水的浮力能減輕身體重量，使運動更舒服，特別適合背部不適的孕媽咪。',
                tips: ['水溫適中', '避免滑倒', '有人陪同'],
                source: '運動指南',
                icon: 'pool',
                color: 'bg-cyan-50',
                minWeek: 13,
                maxWeek: 36
            },
            {
                id: 'preg_yoga',
                title: '孕婦瑜伽',
                subtitle: '身心靈平衡',
                content: '拉伸肌肉、緩解緊繃、練習深呼吸。',
                fullContent: '🧘‍♀️ 瑜伽｜溫柔伸展：\n幫助拉伸肌肉、改善柔軟度、緩解緊繃感，對於焦慮也有很好的舒緩作用。',
                tips: ['專業老師指導', '避免過度扭轉', '深呼吸放鬆'],
                source: '運動指南',
                icon: 'self_improvement',
                color: 'bg-indigo-50',
                minWeek: 13,
                maxWeek: 40
            },
            {
                id: 'preg_strength',
                title: '輕度力量訓練',
                subtitle: '強化支撐力',
                content: '不是高強度健身，而是穩定核心肌力。',
                fullContent: '🏋️‍♀️ 力量訓練｜關鍵在低負重：\n溫和強化肌肉，穩定核心肌力，幫助支撐日益沉重的身軀。',
                tips: ['輕重量', '穩定第一', '呼吸順暢'],
                source: '運動指南',
                icon: 'fitness_center',
                color: 'bg-teal-50',
                minWeek: 13,
                maxWeek: 32
            }
        ],
        wellness: [
            {
                id: 'preg_morning_sickness',
                title: '緩解孕吐方法',
                subtitle: 'Morning Sickness',
                content: '晨間小點心是關鍵。',
                fullContent: '🤢 孕吐攻略｜減輕晨吐困擾：\n\n1. 起床前吃蘇打餅乾，避免空腹胃酸直接刺激。\n2. 少量多餐，避免油膩或味道濃烈食物。\n3. 以口含冰塊稀釋水分補給，避免大口喝水、減少嘔吐感。\n4. 若沒胃口不要強迫進食，寶寶會優先攝取母體原本的能量。',
                tips: ['蘇打餅乾', '含冰塊', '少量多餐'],
                source: '舒緩攻略',
                icon: 'home_health',
                color: 'bg-orange-50',
                minWeek: 4,
                maxWeek: 16
            },
            {
                id: 'preg_relaxation',
                title: '保持心情愉快',
                subtitle: '心理健康安適',
                content: '寶寶最喜歡心情平和的媽媽。',
                fullContent: '💖 心情好的五個方法：\n\n1. 追求興趣愛好\n2. 保持積極社交活動\n3. 設定小目標和獎勵，提升自信\n4. 寫日記釋放壓力\n5. 規劃未來（如準備寶寶房間）',
                tips: ['寫日記', '社交聊天', '聽音樂'],
                source: '心理調適',
                icon: 'favorite',
                color: 'bg-rose-50',
                minWeek: 1,
                maxWeek: 40
            },
            {
                id: 'preg_sleep_tips',
                title: '改善睡眠品質',
                subtitle: '睡個好覺',
                content: '孕婦枕是你最好的夥伴。',
                fullContent: '😴 睡眠對策｜媽咪也要好好休息：\n\n- 維持穩定作息，白天可以小睡補充體力。\n- 利用孕婦枕尋找最舒服的姿勢。\n- 睡覺時可將枕頭墊高一點。',
                tips: ['孕婦枕', '穩定作息', '白天小睡'],
                source: '生活指南',
                icon: 'nightlight',
                color: 'bg-indigo-50',
                minWeek: 1,
                maxWeek: 40
            },
            {
                id: 'preg_edema',
                title: '腿部水腫改善',
                subtitle: '泡熱水舒緩',
                content: '墊高小腿，促進循環。',
                fullContent: '🦶 水腫對策｜擊退腫脹感：\n\n- 睡覺時用枕頭墊高小腿。\n- 白天讓腿部泡熱水舒緩。\n- 向醫師詢問適合的消水腫食品。',
                tips: ['枕頭墊腳', '溫水泡腳', '避久坐久站'],
                source: '身體護理',
                icon: 'waves',
                color: 'bg-blue-50',
                minWeek: 24,
                maxWeek: 40
            },
            {
                id: 'preg_heartburn',
                title: '胃酸與反胃緩解',
                subtitle: '消化道照護',
                content: '尤其在第九個月最為明顯。',
                fullContent: '🔥 胃酸與反胃對策：\n\n1. 飯後 3 小時內不要躺下。\n2. 睡前 3 小時內不要進食。\n3. 避免咖啡、濃茶、巧克力與高脂肪食物。\n4. 抬高床頭 15-20 公分。',
                tips: ['抬高床頭', '飯後不立臥', '清淡飲食'],
                source: '身體護理',
                icon: 'medical_services',
                color: 'bg-yellow-50',
                minWeek: 28,
                maxWeek: 40
            },
            {
                id: 'preg_back_pain',
                title: '腰背疼痛舒緩',
                subtitle: '10 大方法解析',
                content: '溫熱水沖洗，加上適度伸展。',
                fullContent: '😫 腰痛閃避指南｜舒緩肌肉負擔：\n\n- 適時伸展（擴胸、側邊伸展）。\n- 使用孕婦托腹帶，支撐孕肚重量。\n- 維持良好坐姿、站姿，每 30 分鐘活動一次。\n- 溫水（37°C）沖洗腰背。',
                tips: ['托腹帶', '溫水淋浴', '規律伸展'],
                source: '身體護理',
                icon: 'accessibility_new',
                color: 'bg-green-50',
                minWeek: 20,
                maxWeek: 40
            },
            {
                id: 'preg_skincare',
                title: '肌膚護理方法',
                subtitle: '預防妊娠紋',
                content: '調整保養品，溫和不刺激。',
                fullContent: '✨ 肌膚護理｜媽咪亮起來：\n\n- 選擇溫和不刺激、專為孕婦設計的產品。\n- 使用潤膚油或霜大面積塗抹腹部、大腿與臀部。',
                tips: ['溫和成分', '加強潤膚', '及早預防'],
                source: '生活指南',
                icon: 'spa',
                color: 'bg-amber-50',
                minWeek: 1,
                maxWeek: 40
            }
        ]
    },
    en: {
        nutrition: [
            { id: 'preg_folate', title: 'Folic Acid', subtitle: 'Neural Tube Guardian', content: 'Helps baby\'s brain and spinal cord develop.', fullContent: '🧠 Folic Acid | Importance:\nEarly pregnancy is crucial for brain/nerve development. Lack of it increases neural tube defect risks.\n\n* When to take:\n👉 Pre-pregnancy to 12 weeks\n\n* Recommended foods:\n- Dark green veggies (spinach, water spinach)\n- Beans, oats\n- Liver, mackerel, oysters', tips: ['Spinach, asparagus', 'Liver', 'Essential for early term'], source: 'Nutrition', icon: 'eco', color: 'bg-dama-sakura/10', minWeek: 1, maxWeek: 16 },
            { id: 'preg_iodine', title: 'Iodine', subtitle: 'Intelligence Key', content: 'Supports growth and intelligence development.', fullContent: '🧂 Iodine | Importance:\nLack of iodine affects growth and learning ability.\n\n* How to supplement:\n- Iodized salt\n- Seaweed, kelp\n- ⚠️ Note: Consult a doctor if you have thyroid issues.', tips: ['Iodized salt', 'Seaweed/Kelp', 'Thyroid caution'], source: 'Nutrition', icon: 'egg_alt', color: 'bg-blue-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_iron', title: 'Iron', subtitle: 'Oxygen Supply', content: 'Prevents anemia and preterm birth.', fullContent: '🩸 Iron | Importance:\nBlood volume increases during pregnancy, making iron crucial.\n\n* How to supplement:\n- Red meat (beef, pork)\n- Dark green veggies, tofu\n- High demand in later stages.', tips: ['Red meat', 'Raisins', 'Spinach'], source: 'Nutrition', icon: 'bloodtype', color: 'bg-red-50', minWeek: 20, maxWeek: 40 }
        ],
        exercise: [
            { id: 'preg_walk', title: 'Walking', subtitle: 'Safe Cardio', content: 'Moderate and safe exercise is key.', fullContent: '🚶‍♀️ Walking | Simple & Safe:\nImproves heart health and reduces fatigue/edema.\n\n* Key tips:\n- Comfortable shoes\n- Stay hydrated\n- 20-30 mins daily', tips: ['Cardio health', 'Weight control', 'Better sleep'], source: 'Exercise', icon: 'directions_walk', color: 'bg-dama-matcha/10', minWeek: 1, maxWeek: 40 },
            { id: 'preg_swim', title: 'Swimming', subtitle: 'Zero Gravity', content: 'Relieves joint and back pressure.', fullContent: '🏊‍♀️ Swimming | Weightless Experience:\nBouyancy reduces body weight stress, great for back pain relief.', tips: ['Warm water', 'Anti-slip', 'Go with someone'], source: 'Exercise', icon: 'pool', color: 'bg-cyan-50', minWeek: 13, maxWeek: 36 },
            { id: 'preg_yoga', title: 'Prenatal Yoga', subtitle: 'Mind-Body Balance', content: 'Stretch muscles and practice deep breathing.', fullContent: '🧘‍♀️ Yoga | Gentle Strech:\nImproves flexibility, relieves tension and anxiety.', tips: ['Guided classes', 'No deep twists', 'Deep breathing'], source: 'Exercise', icon: 'self_improvement', color: 'bg-indigo-50', minWeek: 13, maxWeek: 40 },
            { id: 'preg_strength', title: 'Light Lifting', subtitle: 'Core Strength', content: 'Moderate core stability training.', fullContent: '🏋️‍♀️ Light Weights | Key is Low Load:\nStrengthens core to support your growing belly.', tips: ['Light weights', 'Stability first', 'Breathe smoothly'], source: 'Exercise', icon: 'fitness_center', color: 'bg-teal-50', minWeek: 13, maxWeek: 32 }
        ],
        wellness: [
            { id: 'preg_morning_sickness', title: 'Morning Sickness', subtitle: 'Relief Tips', content: 'Morning snacks are crucial.', fullContent: '🤢 Sickness Relief:\n\n1. Crackers before getting out of bed.\n2. Small, frequent meals.\n3. Ice chips for hydration.\n4. Don\'t force eating if no appetite.', tips: ['Crackers', 'Ice chips', 'Frequent meals'], source: 'Wellness', icon: 'home_health', color: 'bg-orange-50', minWeek: 4, maxWeek: 16 },
            { id: 'preg_relaxation', title: 'Stay Happy', subtitle: 'Mental Health', content: 'A peaceful mom is best for baby.', fullContent: '💖 5 Tips for Happiness:\n\n1. Pursue hobbies\n2. Socialize\n3. Set small goals\n4. Journaling\n5. Plan for the future', tips: ['Journal', 'Chattting', 'Music'], source: 'Wellness', icon: 'favorite', color: 'bg-rose-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_sleep_tips', title: 'Better Sleep', subtitle: 'Rest Well', content: 'Pregnancy pillows are your best friend.', fullContent: '😴 Sleep Strategies:\n\n- Stable schedule\n- Use pregnancy pillow\n- Elevate head slightly', tips: ['Maternity pillow', 'Stable routine', 'Day naps'], source: 'Guide', icon: 'nightlight', color: 'bg-indigo-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_edema', title: 'Leg Edema', subtitle: 'Warm Water Soak', content: 'Elevate legs, promote circulation.', fullContent: '🦶 Edema Relief:\n\n- Elevate legs on pillows.\n- Soak feet in warm water.\n- Consult doctor for food relief.', tips: ['Elevate legs', 'Warm soak', 'Avoid long standing'], source: 'Care', icon: 'waves', color: 'bg-blue-50', minWeek: 24, maxWeek: 40 },
            { id: 'preg_heartburn', title: 'Heartburn Relief', subtitle: 'Digestive Care', content: 'Most obvious in the 9th month.', fullContent: '🔥 Heartburn Strategies:\n\n1. Don\'t lie down within 3 hrs of eating.\n2. No food 3 hrs before bed.\n3. Avoid coffee, tea, chocolate.\n4. Elevate bed head 15-20cm.', tips: ['Elevate head', 'No lying down', 'Light diet'], source: 'Care', icon: 'medical_services', color: 'bg-yellow-50', minWeek: 28, maxWeek: 40 },
            { id: 'preg_back_pain', title: 'Back Pain Relief', subtitle: 'Top Methods', content: 'Warm showers and stretching.', fullContent: '😫 Back Pain Guide:\n\n- Stretch often.\n- Use maternity belt.\n- Good posture, move every 30m.\n- Warm showers.', tips: ['Maternity belt', 'Warm shower', 'Stretch'], source: 'Care', icon: 'accessibility_new', color: 'bg-green-50', minWeek: 20, maxWeek: 40 },
            { id: 'preg_skincare', title: 'Skincare', subtitle: 'Stretch Marks', content: 'Gentle and non-irritating.', fullContent: '✨ Skincare:\n\n- Use gentle pregnancy-safe products.\n- Apply oil or cream on belly, thighs, and hips.', tips: ['Gentle ingredients', 'Moisturize', 'Start early'], source: 'Guide', icon: 'spa', color: 'bg-amber-50', minWeek: 1, maxWeek: 40 }
        ]
    },
    ja: {
        nutrition: [
            { id: 'preg_folate', title: '葉酸', subtitle: '神経管の守護者', content: '赤ちゃんの脳と脊髄の発達を助けます。', fullContent: '🧠 葉酸｜重要性：\n妊娠初期は赤ちゃんの脳と神経の発達に重要です。葉酸不足は神経管閉鎖障害のリスクを高めます。\n\n* 摂取時期：\n👉 妊娠前 〜 妊娠12週\n\n* おすすめの食材：\n- 緑黄色野菜（ほうれん草など）\n- 豆類、オーツ麦\n- 鶏レバー、サバ、牡蠣', tips: ['ほうれん草、アスパラ', 'レバー', '妊娠初期の必須栄養'], source: '妊娠中の栄養', icon: 'eco', color: 'bg-dama-sakura/10', minWeek: 1, maxWeek: 16 },
            { id: 'preg_iodine', title: 'ヨウ素', subtitle: '知能発達の鍵', content: '赤ちゃんの成長と知能発達をサポートします。', fullContent: '🧂 ヨウ素｜重要性：\nヨウ素不足は赤ちゃんの成長と学習能力に影響を与える可能性があります。\n\n* 補給方法：\n- ヨウ素添加塩\n- 海藻類、昆布\n- ⚠️ 注意：甲状腺疾患がある場合は医師に相談してください。', tips: ['ヨウ素入りの塩', '海藻類', '甲状腺の注意'], source: '妊娠中の栄養', icon: 'egg_alt', color: 'bg-blue-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_iron', title: '鉄分', subtitle: '酸素供給チーム', content: '貧血や早産を防ぎます。', fullContent: '🩸 鉄分｜重要性：\n妊娠中は血液量が増加するため、鉄分が不足すると貧血になりやすく、早産のリスクが高まります。\n\n* 補給方法：\n- 赤身肉（牛肉、豚肉）\n- 緑黄色野菜、豆腐\n- 妊娠後期には鉄分の需要が高まります。', tips: ['赤身肉', 'レーズン', 'ほうれん草'], source: '妊娠中の栄養', icon: 'bloodtype', color: 'bg-red-50', minWeek: 20, maxWeek: 40 }
        ],
        exercise: [
            { id: 'preg_walk', title: 'ウォーキング', subtitle: '安全な有酸素運動', content: '適度で安全な運動が鍵です。', fullContent: '🚶‍♀️ ウォーキング｜簡単で最も安全：\n心肺機能を高め、血液循環を改善し、疲労やむくみを軽減します。\n\n* ポイント：\n- 快適な靴を履く\n- 水分補給\n- 毎日20〜30分', tips: ['心肺機能の維持', '体重管理', '睡眠の質向上'], source: '運動ガイド', icon: 'directions_walk', color: 'bg-dama-matcha/10', minWeek: 1, maxWeek: 40 },
            { id: 'preg_swim', title: '水泳', subtitle: '無重力体験', content: '関節や背中の痛みを和らげます。', fullContent: '🏊‍♀️ 水泳｜無重力体験：\n水の浮力が体重を支え、運動を快適にします。特に背中の痛みがある妊婦さんにおすすめです。', tips: ['適度な水温', '滑り止め対策', '同伴者と一緒に'], source: '運動ガイド', icon: 'pool', color: 'bg-cyan-50', minWeek: 13, maxWeek: 36 },
            { id: 'preg_yoga', title: 'マタニティヨガ', subtitle: '心身のバランス', content: '筋肉を伸ばし、深呼吸を練習します。', fullContent: '🧘‍♀️ ヨガ｜優しいストレッチ：\n筋肉を伸ばし、柔軟性を高め、緊張を和らげます。不安の軽減にも効果的です。', tips: ['指導者の元で', '過度なひねりを避ける', '深呼吸でリラックス'], source: '運動ガイド', icon: 'self_improvement', color: 'bg-indigo-50', minWeek: 13, maxWeek: 40 },
            { id: 'preg_strength', title: '軽い筋力トレーニング', subtitle: 'サポート力の強化', content: '過度な筋トレではなく、安定した体幹作りです。', fullContent: '🏋️‍♀️ 筋力トレーニング｜低負荷が鍵：\n筋肉を穏やかに強化し、体幹を安定させ、大きくなるお腹を支えます。', tips: ['軽い重量', '安定性第一', 'スムーズな呼吸'], source: '運動ガイド', icon: 'fitness_center', color: 'bg-teal-50', minWeek: 13, maxWeek: 32 }
        ],
        wellness: [
            { id: 'preg_morning_sickness', title: 'つわりの緩和', subtitle: '対処法', content: '朝の軽食が重要です。', fullContent: '🤢 つわりの攻略法：\n\n1. 起床前にクラッカーを食べる（空腹を避ける）。\n2. 少量頻回に食事をとる。\n3. 水分の補給には氷をなめる。\n4. 食欲がない時は無理して食べない。', tips: ['クラッカー', '氷をなめる', '少量頻回'], source: '心身のケア', icon: 'home_health', color: 'bg-orange-50', minWeek: 4, maxWeek: 16 },
            { id: 'preg_relaxation', title: '楽しい気分を保つ', subtitle: 'メンタルケア', content: '穏やかな気持ちが一番です。', fullContent: '💖 気分を良くする5つの方法：\n\n1. 趣味を楽しむ\n2. 交流を持つ\n3. 小さな目標を立てる\n4. 日記を書く\n5. 未来の計画を立てる', tips: ['日記', 'おしゃべり', '音楽'], source: 'メンタルケア', icon: 'favorite', color: 'bg-rose-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_sleep_tips', title: '睡眠の質を改善する', subtitle: '良い睡眠', content: '抱き枕はあなたの親友です。', fullContent: '😴 睡眠対策｜ママもしっかり休む：\n\n- 規則正しい生活\n- 抱き枕を使って楽な姿勢を見つける\n- 枕を少し高くする', tips: ['抱き枕', '規則正しい生活', '昼寝'], source: '生活ガイド', icon: 'nightlight', color: 'bg-indigo-50', minWeek: 1, maxWeek: 40 },
            { id: 'preg_edema', title: '足のむくみ改善', subtitle: 'お湯で足湯', content: '足を高くして循環を促します。', fullContent: '🦶 むくみ対策：\n\n- 寝る時は枕で足を高くする。\n- 日中はお湯で足湯をする。\n- むくみに効く食べ物について医師に相談する。', tips: ['足を高くする', '足湯', '長時間の立ち仕事を避ける'], source: '体調管理', icon: 'waves', color: 'bg-blue-50', minWeek: 24, maxWeek: 40 },
            { id: 'preg_heartburn', title: '胃酸と胸焼けの緩和', subtitle: '消化器のケア', content: '妊娠9ヶ月目が最も顕著です。', fullContent: '🔥 胃酸対策：\n\n1. 食後3時間は横にならない。\n2. 就寝3時間前は食事をしない。\n3. コーヒー、濃いお茶、チョコレートを避ける。\n4. ベッドの頭を15〜20cm高くする。', tips: ['頭を高くする', '食後すぐ横にならない', 'あっさりした食事'], source: '体調管理', icon: 'medical_services', color: 'bg-yellow-50', minWeek: 28, maxWeek: 40 },
            { id: 'preg_back_pain', title: '腰と背中の痛みの緩和', subtitle: '10の対処法', content: '温水を浴びて適度にストレッチ。', fullContent: '😫 腰痛回避ガイド：\n\n- こまめにストレッチ。\n- 妊婦帯を使ってお腹の重さを支える。\n- 良い姿勢を保ち、30分に1回は動く。\n- 温水シャワー。', tips: ['妊婦帯', '温水シャワー', 'ストレッチ'], source: '体調管理', icon: 'accessibility_new', color: 'bg-green-50', minWeek: 20, maxWeek: 40 },
            { id: 'preg_skincare', title: 'スキンケア', subtitle: '妊娠線の予防', content: '刺激の少ない製品を使います。', fullContent: '✨ スキンケア：\n\n- 刺激の少ない妊婦専用の製品を選ぶ。\n- お腹、太もも、ヒップにオイルやクリームをたっぷり塗る。', tips: ['マイルドな成分', '保湿強化', '早めの予防'], source: '生活ガイド', icon: 'spa', color: 'bg-amber-50', minWeek: 1, maxWeek: 40 }
        ]
    }
};

export const postpartumPool: { [key: string]: { [category: string]: KnowledgeItem[] } } = {
    zh: {
        nutrition: [
            {
                id: 'post_safe_sleep',
                title: '新生兒安全睡眠',
                subtitle: '仰睡最安全',
                content: '預防猝死，床鋪不放雜物。',
                fullContent: '💤 新生兒睡眠五大法則：\n\n1. 仰睡最安全：不趴睡，降低猝死風險。\n2. 避免同床：不同床但可同房，避免壓迫寶寶。\n3. 環境平整：床墊不可太軟，不放枕頭、棉被、填充玩偶（防堵塞）。\n4. 避免過熱：室溫維持 24°C，棉被蓋到胸口即可。\n5. 模擬環境：減少噪音，可使用白噪音。',
                tips: ['仰睡避猝死', '防過度保暖', '床面清空'],
                source: '照顧手冊',
                icon: 'shield_moon',
                color: 'bg-blue-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_iron',
                title: '產後補鐵',
                subtitle: '恢復紅韻氣色',
                content: '修復分娩流失，增強血液循環。',
                fullContent: '🩸 鐵質補充：生產過程會流失血液，補充鐵質能幫助體力恢復，預防產後疲倦紅。',
                tips: ['紅肉、肝臟', '紅莧菜', '深綠蔬菜'],
                source: '產後營養',
                icon: 'bloodtype',
                color: 'bg-red-50',
                minMonth: 1,
                maxMonth: 3
            },
            {
                id: 'post_fiber_water',
                title: '纖維質與水分',
                subtitle: '腸道順暢祕訣',
                content: '解決產後排便困擾。',
                fullContent: '🥬 纖維質｜讓腸道動起來：產後活動減少，加上傷口顧慮，多吃纖維、多喝水是預防便秘的最好方式。',
                tips: ['黑木耳、地瓜', '溫開水輔助', '奇異果'],
                source: '產後營養',
                icon: 'egg_alt',
                color: 'bg-green-50',
                minMonth: 1,
                maxMonth: 6
            }
        ],
        exercise: [
            {
                id: 'post_holding',
                title: '正確抱姿技巧',
                subtitle: '托住頭部頸部',
                content: '保護脆弱的頸部與腦部。',
                fullContent: '🤱 抱抱寶寶｜關鍵動作：\n\n1. 支撐頭頸：新生兒頸部肌肉未成熟，抱起時務必托住。\n2. 避免搖晃：不可大力搖晃、拋起或架在肩上，以免造成腦部傷害。',
                tips: ['托後腦勺', '嚴禁大力搖晃', '溫柔貼近心口'],
                source: '育兒技巧',
                icon: 'volunteer_activism',
                color: 'bg-pink-50',
                minMonth: 1,
                maxMonth: 4
            },
            {
                id: 'post_diaper',
                title: '換尿布 SOP',
                subtitle: '保護嬌嫩屁屁',
                content: '洗屁屁優於濕紙巾。',
                fullContent: '🧷 換尿布五步驟：\n\n1. 洗屁屁：用溫水洗淨最溫柔。\n2. 雙腳舉高：穩定抓住雙腳。\n3. 擺放尿布：乾淨尿布墊在適合位置。\n4. 黏好魔鬼氈。\n5. 最後檢查：確認鬆緊度、整理大腿防漏側邊。',
                tips: ['二指鬆緊度', '溫水洗屁屁', '防漏邊拉開'],
                source: '育兒技巧',
                icon: 'soap',
                color: 'bg-teal-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_bathing',
                title: '洗澡與護理',
                subtitle: '橄欖球抱法',
                content: '安全洗滌法與順序建議。',
                fullContent: '🛀 清潔順序：\n\n- 抱好：橄欖球姿勢側抱，手托後頸，拇指扣住耳朵防進水。\n- 洗臉：布巾輕輕擦拭。\n- 洗頭：搓洗頭皮後擦乾。\n- 洗身體：留意皺褶處、腋下與生殖器。',
                tips: ['支托後頸', '水溫及體溫', '防耳朵進水'],
                source: '育兒技巧',
                icon: 'bathtub',
                color: 'bg-cyan-50',
                minMonth: 1,
                maxMonth: 6
            },
            {
                id: 'post_feeding_assist',
                title: '親餵與瓶餵協助',
                subtitle: '神隊友的支援',
                content: '爸爸可以做很多事。',
                fullContent: '🍼 餵食協助點滴：\n\n* 親餵：準備靠枕、按摩太太肩膀、喝奶後清潔寶寶口腔。\n* 瓶餵：奶瓶傾斜讓奶水充滿奶嘴（不吞空氣）、觀察寶寶情緒不強迫。',
                tips: ['清潔口腔', '輔助抱枕', '觀察反應'],
                source: '育兒技巧',
                icon: 'local_drink',
                color: 'bg-orange-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_burping',
                title: '拍嗝與防吐奶',
                subtitle: '空掌輕拍背部',
                content: '托住下巴，釋放胃部氣體。',
                fullContent: '💨 拍嗝技巧：\n\n1. 寶寶側坐：托住其下巴與肩膀穩定。\n2. 空掌輕拍：手心微彎呈空掌，在背部向上輕拍。',
                tips: ['手呈空掌', '注意下巴支撐', '不餵太急'],
                source: '育兒技巧',
                icon: 'baby_changing_station',
                color: 'bg-amber-50',
                minMonth: 1,
                maxMonth: 6
            },
            {
                id: 'post_umbilical',
                title: '臍帶護理指南',
                subtitle: '定期酒精消毒',
                content: '一邊消毒，一邊乾燥。',
                fullContent: '🚑 臍帶清潔兩部曲：\n\n1. 消毒：使用 75% 酒精，由內往外擦拭根部一圈。\n2. 乾燥：使用 95% 酒精，由內往外重複一次。',
                tips: ['完全乾燥', '無異味出血', '每日 2-3 次'],
                source: '育兒技巧',
                icon: 'medical_information',
                color: 'bg-red-50',
                minMonth: 1,
                maxMonth: 1
            },
            {
                id: 'post_soothing',
                title: '新生兒哄睡與安撫',
                subtitle: '增加安全感',
                content: '揉眼睛、打呵欠就要準備睡了。',
                fullContent: '💤 安撫要點：\n\n- 輕拍背部或溫柔撫摸。\n- 適時搭配安撫奶嘴提供安全感。\n- 掌握黃金時機：在寶寶「躁動」時就開始哄，而不是等到「大哭」。',
                tips: ['觀察睡眠訊號', '奶嘴輔助', '穩定白噪音'],
                source: '育兒技巧',
                icon: 'child_care',
                color: 'bg-purple-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_crying_meaning',
                title: '看懂寶寶的語言',
                subtitle: '哭聲辨識攻略',
                content: '肚子餓？尿布濕？還是想抱抱？',
                fullContent: '🗣️ 哭聲解密：\n\n1. 飢餓：頻率高低起伏，伴隨寻乳反應。\n2. 尿布濕：大聲且不停的，伴隨蹭腳動作。\n3. 想睡：一陣一陣的，行為開始煩躁不安。\n4. 想被安撫：眼睛注視照顧者，發出憐惜哭聲。\n5. 不舒服：排除前面四項後，雙腿捲縮（可能是腸絞痛）或微弱呻吟。',
                tips: ['先排除生理需求', '多觀察肢體', '大聲多為不適'],
                source: '育兒分析',
                icon: 'forum',
                color: 'bg-violet-50',
                minMonth: 1,
                maxMonth: 6
            }
        ],
        wellness: [
            {
                id: 'post_dev_1',
                title: '第 1 個月：睡眠與覺醒',
                subtitle: '新生兒適應期',
                content: '大部分時間都在睡覺，視力仍模糊。',
                fullContent: '🍼 月齡發展｜第 1 個月：\n\n- 睡眠：主要活動是睡眠（12-16小時），幫助大腦快速成長。\n- 互動：適當解開束縛，帶著動動手腳，誘發大動作發展。',
                tips: ['仰睡最安全', '多睡覺長大', '視力模糊期'],
                source: '里程碑',
                icon: 'bedroom_baby',
                color: 'bg-blue-50',
                minMonth: 1,
                maxMonth: 1
            },
            {
                id: 'post_dev_2',
                title: '第 2 個月：抓握與情緒',
                subtitle: '探索雙手力量',
                content: '抓握反射明顯，常握握手可訓練肌肉。',
                fullContent: '🍼 月齡發展｜第 2 個月：\n\n- 哭泣：透過哭聲表達需求與溝通。\n- 反射：抓握反射明顯，可以帶寶寶擊掌、握手，訓練小肌肉與協調。',
                tips: ['握握手練習', '透過撫摸安撫', '對聲音有反應'],
                source: '里程碑',
                icon: 'front_hand',
                color: 'bg-teal-50',
                minMonth: 2,
                maxMonth: 2
            },
            {
                id: 'post_dev_3',
                title: '第 3 個月：抬頭觀察',
                subtitle: '頸部力量增強',
                content: '俯臥時可將頭抬起 45 度。',
                fullContent: '🍼 月齡發展｜第 3 個月：\n\n- 體力：頸部肌肉變強，趴著時能抬頭看。這是練習肺活量與肺部擴張的好時機。',
                tips: ['抬頭 45 度', '哭泣是互動工具', '仔細聆聽哭聲'],
                source: '里程碑',
                icon: 'visibility',
                color: 'bg-cyan-50',
                minMonth: 3,
                maxMonth: 3
            },
            {
                id: 'post_dev_4',
                title: '第 4 個月：翻身與認知',
                subtitle: '視覺認人期',
                content: '會翻身、會大笑，開始認得熟面孔。',
                fullContent: '🍼 月齡發展｜第 4 個月：\n\n- 運動：開始嘗試翻身；俯臥能抬頭至 90 度。\n- 社交：會笑出聲或尖叫，眼睛開始會認人。\n- 認知：給予大量語言與感官刺激。',
                tips: ['抬頭 90 度', '翻身與大笑', '眼睛會認人'],
                source: '里程碑',
                icon: 'sentiment_very_satisfied',
                color: 'bg-indigo-50',
                minMonth: 4,
                maxMonth: 4
            },
            {
                id: 'post_dev_5',
                title: '第 5 個月：長牙與回應',
                subtitle: '第一顆乳牙',
                content: '會給予回應，被抱起會笑。',
                fullContent: '🍼 月齡發展｜第 5 個月：\n\n- 生理：部分寶寶開始冒出第一顆乳牙（需注意口腔清潔）。\n- 社交：對於人的接觸會給回應，睜大眼睛想看清楚人。',
                tips: ['注意口腔清潔', '主動互動回應', '對人感興趣'],
                source: '里程碑',
                icon: 'child_care',
                color: 'bg-amber-50',
                minMonth: 5,
                maxMonth: 5
            },
            {
                id: 'post_dev_6',
                title: '第 6 個月：副食品開啟',
                subtitle: '坐姿練習與勾物',
                content: '可以嘗試副食品，坐著時頭不後仰。',
                fullContent: '🍼 月齡發展｜第 6 個月：\n\n- 生理：原本尋乳/吸吮反射，開始轉向有意識的進食。可以餵副食品。\n- 運動：坐著時頭不會後仰，會嘗試用手去勾東西。',
                tips: ['副食品嘗試', '訓練坐姿', '手勾物品'],
                source: '里程碑',
                icon: 'restaurant',
                color: 'bg-orange-50',
                minMonth: 6,
                maxMonth: 6
            },
            {
                id: 'post_dev_7_8',
                title: '第 7-8 個月：爬行',
                subtitle: '大動作發育',
                content: '學會坐立與協調爬行。',
                fullContent: '🍼 月齡發展｜第 7-8 個月：\n\n- 7月：嘗試保持坐姿，學習平衡。\n- 8月：學會手腳協調爬行，能抓積木玩玩具。',
                tips: ['學習獨立坐立', '手腳協調爬行', '玩抓積木'],
                source: '里程碑',
                icon: 'directions_run',
                color: 'bg-green-50',
                minMonth: 7,
                maxMonth: 8
            },
            {
                id: 'post_dev_9_10',
                title: '第 9-10 個月：扶站',
                subtitle: '學步的前奏',
                content: '嘗試扶著家具站立，斷夜奶。',
                fullContent: '🍼 月齡發展｜第 9-10 個月：\n\n- 9月：扶家具站立。\n- 10月：逐漸不再需要深夜餵奶，養成規律作息。',
                tips: ['扶物站立', '斷夜奶練習', '規律睡覺習慣'],
                source: '里程碑',
                icon: 'stairs',
                color: 'bg-yellow-50',
                minMonth: 9,
                maxMonth: 10
            },
            {
                id: 'post_dev_11_12',
                title: '第 11-12 個月：站立與語言',
                subtitle: '開始說話與學走',
                content: '叫爸爸媽媽，練習獨自站立。',
                fullContent: '🍼 月齡發展｜第 11-12 個月：\n\n- 11月：會叫簡單詞彙（爸、媽）；能獨自站立。\n- 12月：開始走路探索；會有揮手等簡單手勢。',
                tips: ['叫爸媽', '獨自站立與走', '揮手說再見'],
                source: '里程碑',
                icon: 'celebration',
                color: 'bg-rose-50',
                minMonth: 11,
                maxMonth: 12
            },
            {
                id: 'post_depression',
                title: '產後情緒與憂鬱',
                subtitle: '傾聽與陪伴',
                content: '勝過千言萬語的建議。',
                fullContent: '🌧️ 情緒對策：\n\n- 使用「愛丁堡產後憂鬱量表」自評。\n- 家人應給予傾聽、理解，取代糾正。\n- 以實際行動支持（如：分擔家務），拒當家庭邊緣人。',
                tips: ['量表自評', '實際分擔', '專業醫學諮詢'],
                source: '心理調適',
                icon: 'psychology',
                color: 'bg-red-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_sleep_coping',
                title: '睡眠不足的應對',
                subtitle: '跟著寶寶一起睡',
                content: '即使是摺運動也能分散壓力。',
                fullContent: '☕ 熬過斷魂夜的小撇步：\n\n1. 跟著寶寶睡：即使在白天，寶寶睡覺時你就跟著補眠。\n2. 輪流值班：爸爸媽媽約定時段休息，休息的人戴耳塞隔絕聲音。\n3. 優先順序：照顧好自己和寶寶最重要，家事可以晚點甚至外包。',
                tips: ['白天補眠', '輪流顧夜班', '家事外包'],
                source: '生活指南',
                icon: 'hotel',
                color: 'bg-indigo-50',
                minMonth: 1,
                maxMonth: 6
            },
            {
                id: 'post_self_adjustment',
                title: '身心調適與管理',
                subtitle: '接受不完美',
                content: '情緒要說出來，不是撐過去。',
                fullContent: '🌱 媽咪的心理防禦：\n\n- 接受混亂是常態，產後適應需要數個月。\n- 把「我很累」說出口，這不是脆弱，是尋求保護。\n- 透過情緒書寫（每天 5 分鐘）進行自我察覺。',
                tips: ['降低期待', '自我察覺', '向外求援'],
                source: '心理調適',
                icon: 'self_improvement',
                color: 'bg-amber-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_god_teammate',
                title: '伴侶合作神隊友',
                subtitle: '團隊作戰',
                content: '爸爸也需要建立父子連結。',
                fullContent: '神隊友攻略：\n\n- 爸爸負責固定項目（如：換尿布、洗澡）。\n- 每天肯定對方的付出，減少責備。\n- 設定每週一小時「非育兒時間」交流。',
                tips: ['讚美取代責備', '固定分工', '非育兒交流'],
                source: '家庭關係',
                icon: 'groups',
                color: 'bg-blue-50',
                minMonth: 1,
                maxMonth: 12
            },
            {
                id: 'post_social_resources',
                title: '新手爸媽社群資源',
                subtitle: '同儕的力量',
                content: '多一個有效的情緒抒發出口。',
                fullContent: '🌍 尋求共鳴：\n加入新手爸媽社群，透過同儕交流獲取經驗。善用作息紀錄 APP，讓瑣事不佔大腦空間。',
                tips: ['紀錄 APP', '互助社群', '情感宣洩'],
                source: '生活指南',
                icon: 'public',
                color: 'bg-green-50',
                minMonth: 1,
                maxMonth: 12
            }
        ]
    },
    en: {
        nutrition: [
            { id: 'post_safe_sleep', title: 'Safe Sleep', subtitle: 'Back is Best', content: 'Prevents SIDS, keep crib empty.', fullContent: '💤 Newborn Sleep Top Rules:\n\n1. Back to sleep: Prevents SIDS.\n2. No bed-sharing: Room-sharing is okay but no bed-sharing.\n3. Flat surface: Firm mattress, no pillows, blankets, or toys.\n4. Avoid overheating: Room temp 24°C.\n5. Environment: Use white noise if needed.', tips: ['Back to sleep', 'Do not overheat', 'Empty crib'], source: 'Care Guide', icon: 'shield_moon', color: 'bg-blue-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_iron', title: 'Postpartum Iron', subtitle: 'Restore Vitality', content: 'Recovers blood lost during childbirth.', fullContent: '🩸 Iron Supplement: Blood loss during birth makes iron important for physical recovery and preventing fatigue.', tips: ['Red meat, liver', 'Amaranth', 'Dark veggies'], source: 'Nutrition', icon: 'bloodtype', color: 'bg-red-50', minMonth: 1, maxMonth: 3 },
            { id: 'post_fiber_water', title: 'Fiber & Water', subtitle: 'Smooth Digestion', content: 'Solves postpartum bowel issues.', fullContent: '🥬 Fiber | Keep Bowels Moving: Reduced activity postpartum leads to constipation. High fiber and lots of water is the best prevention.', tips: ['Wood ear, sweet potato', 'Warm water', 'Kiwi'], source: 'Nutrition', icon: 'egg_alt', color: 'bg-green-50', minMonth: 1, maxMonth: 6 }
        ],
        exercise: [
            { id: 'post_holding', title: 'Good Holding Posture', subtitle: 'Support the Head', content: 'Protect the fragile neck and brain.', fullContent: '🤱 Holding Baby | Key actions:\n\n1. Support Head & Neck: Always support the head when picking up.\n2. No Shaking: Never shake or toss the baby to prevent brain injury.', tips: ['Support back of head', 'No shaking', 'Hold close to heart'], source: 'Care Skills', icon: 'volunteer_activism', color: 'bg-pink-50', minMonth: 1, maxMonth: 4 },
            { id: 'post_diaper', title: 'Diaper Change SOP', subtitle: 'Protect Baby\'s Bottom', content: 'Washing is better than wet wipes.', fullContent: '🧷 Diaper 5 Steps:\n\n1. Wash bottom: Warm water is gentlest.\n2. Lift legs: Hold legs steady.\n3. Put diaper: Place clean diaper underneath.\n4. Fasten Velcro.\n5. Final check: Two fingers fit, pull out leak guards.', tips: ['Two fingers loose', 'Warm water wash', 'Pull leak guards'], source: 'Care Skills', icon: 'soap', color: 'bg-teal-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_bathing', title: 'Bathing & Care', subtitle: 'Football Hold', content: 'Safe washing methods and sequences.', fullContent: '🛀 Bath Sequence:\n\n- Hold: Football hold, support neck, thumb caps ear.\n- Face: Wipe with cloth.\n- Head: Rub scalp then dry.\n- Body: Check folds, armpits, and genitals.', tips: ['Neck support', 'Check water temp', 'Protect ears'], source: 'Care Skills', icon: 'bathtub', color: 'bg-cyan-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_feeding_assist', title: 'Feeding Assistance', subtitle: 'Partner Support', content: 'Fathers can do a lot to help.', fullContent: '🍼 Feeding Help:\n\n* Breastfeeding: Adjust pillows, massage mom\'s shoulders, clean baby\'s mouth.\n* Bottle: Tilt bottle to keep nipple filled (avoid air).', tips: ['Clean mouth', 'Support pillows', 'Observe reactions'], source: 'Care Skills', icon: 'local_drink', color: 'bg-orange-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_burping', title: 'Burping Tips', subtitle: 'Gentle Back Pats', content: 'Support the chin, release gas.', fullContent: '💨 Burping Tricks:\n\n1. Side sit: Support chin and shoulder.\n2. Cupped hand: Gently pat the back upwards with a cupped hand.', tips: ['Cupped hand', 'Support chin', 'Don\'t feed too fast'], source: 'Care Skills', icon: 'baby_changing_station', color: 'bg-amber-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_umbilical', title: 'Umbilical Cord Care', subtitle: 'Alcohol Disinfection', content: 'Disinfect while drying.', fullContent: '🚑 Umbilical Care 2 Steps:\n\n1. Disinfect: 75% alcohol, wipe root inside out.\n2. Dry: 95% alcohol, repeat once.', tips: ['Completely dry', 'No bleeding/smell', '2-3 times daily'], source: 'Care Skills', icon: 'medical_information', color: 'bg-red-50', minMonth: 1, maxMonth: 1 },
            { id: 'post_soothing', title: 'Soothing to Sleep', subtitle: 'Increase Security', content: 'Rubbing eyes and yawning means sleepy.', fullContent: '💤 Soothing Keys:\n\n- Gentle back pats.\n- Use a pacifier for security.\n- Golden timing: Start when they are "fussy", not when "crying".', tips: ['Watch sleep cues', 'Pacifier help', 'White noise'], source: 'Care Skills', icon: 'child_care', color: 'bg-purple-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_crying_meaning', title: 'Decode Baby Cries', subtitle: 'Crying Analysis', content: 'Hungry? Wet? Or wants a hug?', fullContent: '🗣️ Cry Decoding:\n\n1. Hungry: High pitch, rooting reflex.\n2. Wet diaper: Loud, kicking legs.\n3. Sleepy: On and off crying, rubbing eyes.\n4. Needs comfort: Looks at you, whimpers.\n5. Uncomfortable: Curling legs (colic) or weak moans.', tips: ['Rule out physical needs', 'Watch body language', 'Loud = discomfort'], source: 'Analysis', icon: 'forum', color: 'bg-violet-50', minMonth: 1, maxMonth: 6 }
        ],
        wellness: [
            { id: 'post_dev_1', title: 'Month 1: Sleep & Waking', subtitle: 'Adaptation Phase', content: 'Mostly sleeping, vision is blurred.', fullContent: '🍼 Month 1 Dev:\n\n- Sleep: Mainly sleeping (12-16 hrs) for brain growth.\n- Interact: Unswaddle occasionally to move limbs.', tips: ['Back is best', 'Sleep to grow', 'Blurred vision'], source: 'Milestone', icon: 'bedroom_baby', color: 'bg-blue-50', minMonth: 1, maxMonth: 1 },
            { id: 'post_dev_2', title: 'Month 2: Grasp & Emotion', subtitle: 'Discovering Hands', content: 'Strong grasp reflex.', fullContent: '🍼 Month 2 Dev:\n\n- Crying: Expresses needs via crying.\n- Reflex: Grasping reflex is strong, good for hand training.', tips: ['Hand holding practice', 'Soothe by touch', 'Reacts to sounds'], source: 'Milestone', icon: 'front_hand', color: 'bg-teal-50', minMonth: 2, maxMonth: 2 },
            { id: 'post_dev_3', title: 'Month 3: Head Lift', subtitle: 'Stronger Neck', content: 'Lifts head 45 degrees when prone.', fullContent: '🍼 Month 3 Dev:\n\n- Energy: Stronger neck muscles, can lift head when on tummy. Great for lung expansion.', tips: ['Lift head 45 degree', 'Crying is interaction', 'Listen closely'], source: 'Milestone', icon: 'visibility', color: 'bg-cyan-50', minMonth: 3, maxMonth: 3 },
            { id: 'post_dev_4', title: 'Month 4: Rolls & Laughs', subtitle: 'Visual Recognition', content: 'Rolls over, laughs, recognizes faces.', fullContent: '🍼 Month 4 Dev:\n\n- Movement: Tries rolling over; lifts head 90 degrees.\n- Social: Laughs out loud, eyes recognize people.\n- Cog: Provide language and sensory stimuli.', tips: ['Head at 90 deg', 'Roll & laugh', 'Recognizes faces'], source: 'Milestone', icon: 'sentiment_very_satisfied', color: 'bg-indigo-50', minMonth: 4, maxMonth: 4 },
            { id: 'post_dev_5', title: 'Month 5: Teething', subtitle: 'First Tooth', content: 'Gives responses, smiles when held.', fullContent: '🍼 Month 5 Dev:\n\n- Physical: Some babies get their first tooth.\n- Social: Responds to touches, opens eyes wide to see.', tips: ['Oral hygiene', 'Active response', 'Interested in people'], source: 'Milestone', icon: 'child_care', color: 'bg-amber-50', minMonth: 5, maxMonth: 5 },
            { id: 'post_dev_6', title: 'Month 6: Solids', subtitle: 'Sitting & Reaching', content: 'Try solids, head steady when sitting.', fullContent: '🍼 Month 6 Dev:\n\n- Physical: Rooting turns to conscious eating. Time for solids.\n- Movement: Head steady when sitting, tries to reach things.', tips: ['Try solids', 'Sit training', 'Reach for objects'], source: 'Milestone', icon: 'restaurant', color: 'bg-orange-50', minMonth: 6, maxMonth: 6 },
            { id: 'post_dev_7_8', title: 'Month 7-8: Crawling', subtitle: 'Gross Motor Skills', content: 'Learns to sit and crawl.', fullContent: '🍼 Month 7-8 Dev:\n\n- M7: Tries to stay sitting, learns balance.\n- M8: Crawls with hands and knees, grabs blocks.', tips: ['Learn to sit', 'Crawling', 'Play with blocks'], source: 'Milestone', icon: 'directions_run', color: 'bg-green-50', minMonth: 7, maxMonth: 8 },
            { id: 'post_dev_9_10', title: 'Month 9-10: Cruising', subtitle: 'Prelude to Walking', content: 'Pulls to stand, weans night feeds.', fullContent: '🍼 Month 9-10 Dev:\n\n- M9: Pulls up on furniture to stand.\n- M10: Outgrows night feeds, sets a routine.', tips: ['Pull to stand', 'Wean night feeds', 'Sleep routine'], source: 'Milestone', icon: 'stairs', color: 'bg-yellow-50', minMonth: 9, maxMonth: 10 },
            { id: 'post_dev_11_12', title: 'Month 11-12: Standing & Talking', subtitle: 'First Words & Steps', content: 'Says Mama/Dada, stands alone.', fullContent: '🍼 Month 11-12 Dev:\n\n- M11: Says simple words; stands alone.\n- M12: Walks to explore; waves hand.', tips: ['Say Mama/Dada', 'Stand and walk', 'Wave goodbye'], source: 'Milestone', icon: 'celebration', color: 'bg-rose-50', minMonth: 11, maxMonth: 12 },
            { id: 'post_depression', title: 'Postpartum Blues', subtitle: 'Listen & Companion', content: 'Better than a thousand advice.', fullContent: '🌧️ Emotional Coping:\n\n- Use Edinburgh Postnatal Depression Scale.\n- Family should listen and understand, not correct.\n- Support with actions (e.g. chores).', tips: ['Self-assess scale', 'Share chores', 'Medical help'], source: 'Mental Health', icon: 'psychology', color: 'bg-red-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_sleep_coping', title: 'Sleep Deprivation', subtitle: 'Sleep when baby sleeps', content: 'Distribute pressure effectively.', fullContent: '☕ Surviving the Night:\n\n1. Sleep with baby: Catch up on sleep during the day when baby sleeps.\n2. Shift work: Parents take turns, use earplugs when resting.\n3. Priority: Taking care of yourself and baby is most important, outsource chores.', tips: ['Day naps', 'Shift work', 'Outsource chores'], source: 'Guide', icon: 'hotel', color: 'bg-indigo-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_self_adjustment', title: 'Self Adjustment', subtitle: 'Accept Imperfections', content: 'Speak out your emotions.', fullContent: '🌱 Mental Defense:\n\n- Accept chaos, adapting takes months.\n- Say "I am tired", it\'s not weakness.\n- Journal your feelings (5 mins/day).', tips: ['Lower expectations', 'Self-awareness', 'Ask for help'], source: 'Mental Health', icon: 'self_improvement', color: 'bg-amber-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_god_teammate', title: 'Partner Teamwork', subtitle: 'Team Battle', content: 'Fathers need to bond too.', fullContent: 'Partner Guide:\n\n- Father takes fixed tasks (e.g. diapers, baths).\n- Praise daily, reduce blame.\n- Set 1 hr/week "non-parenting" talk time.', tips: ['Praise>Blame', 'Fixed tasks', 'Adult talk time'], source: 'Family', icon: 'groups', color: 'bg-blue-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_social_resources', title: 'Parent Communities', subtitle: 'Power of Peers', content: 'An outlet for emotions.', fullContent: '🌍 Seeking Echoes:\nJoin parent groups to share experiences. Use tracker apps to free up mental space.', tips: ['Tracker App', 'Support groups', 'Emotional outlet'], source: 'Guide', icon: 'public', color: 'bg-green-50', minMonth: 1, maxMonth: 12 }
        ]
    },
    ja: {
        nutrition: [
            { id: 'post_safe_sleep', title: '安全な睡眠', subtitle: '仰向けが最適', content: '乳幼児突然死症候群(SIDS)を防ぐ。', fullContent: '💤 新生児の睡眠ルール：\n\n1. 仰向け寝：SIDSを防ぎます。\n2. 添い寝しない：同室はOKですが、同じベッドは避けます。\n3. 平らな表面：硬めのマットレス、枕やぬいぐるみは置かない。\n4. 温めすぎない：室温24°C。\n5. 環境：必要に応じてホワイトノイズを使用。', tips: ['仰向け寝', '温めすぎない', 'ベビーベッドは空に'], source: 'ケアガイド', icon: 'shield_moon', color: 'bg-blue-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_iron', title: '産後の鉄分', subtitle: '活力の回復', content: '出産時の出血を補います。', fullContent: '🩸 鉄分補給：出産時の出血により、身体の回復と疲労防止のために鉄分が重要になります。', tips: ['赤身肉、レバー', 'ほうれん草', '緑黄色野菜'], source: '栄養', icon: 'bloodtype', color: 'bg-red-50', minMonth: 1, maxMonth: 3 },
            { id: 'post_fiber_water', title: '食物繊維と水分', subtitle: 'スムーズな消化', content: '産後の便秘を解決します。', fullContent: '🥬 食物繊維｜腸を動かす：産後は活動量が減るため便秘になりやすいです。高食物繊維と多めの水分が最良の予防策です。', tips: ['さつまいも', '白湯', 'キウイ'], source: '栄養', icon: 'egg_alt', color: 'bg-green-50', minMonth: 1, maxMonth: 6 }
        ],
        exercise: [
            { id: 'post_holding', title: '正しい抱き方', subtitle: '頭を支える', content: '弱い首と脳を守ります。', fullContent: '🤱 赤ちゃんの抱き方｜重要ポイント：\n\n1. 頭と首を支える：抱き上げる時は必ず頭を支えます。\n2. 揺さぶらない：脳損傷を防ぐため、決して激しく揺さぶったり投げたりしないでください。', tips: ['後頭部を支える', '揺さぶらない', '心臓の近くで抱く'], source: 'ケアのコツ', icon: 'volunteer_activism', color: 'bg-pink-50', minMonth: 1, maxMonth: 4 },
            { id: 'post_diaper', title: 'おむつ替えの手順', subtitle: 'お尻を守る', content: 'おしりふきより洗う方が良いです。', fullContent: '🧷 おむつ替え5ステップ：\n\n1. お尻を洗う：お湯が最も肌に優しいです。\n2. 足を持ち上げる：足をしっかり持ちます。\n3. おむつを敷く：清潔なおむつを下に敷きます。\n4. テープを留める。\n5. 最終確認：指2本分のゆとり、ギャザーを引き出す。', tips: ['指2本分のゆとり', 'お湯で洗う', 'ギャザーを引き出す'], source: 'ケアのコツ', icon: 'soap', color: 'bg-teal-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_bathing', title: '入浴とケア', subtitle: 'フットボール抱き', content: '安全な洗い方と順番。', fullContent: '🛀 入浴の順番：\n\n- 抱き方：フットボール抱き、首を支え、親指で耳を塞ぐ。\n- 顔：ガーゼで拭く。\n- 頭：頭皮を洗い、乾かす。\n- 体：しわ、脇の下、性器を洗う。', tips: ['首を支える', 'お湯の温度確認', '耳を守る'], source: 'ケアのコツ', icon: 'bathtub', color: 'bg-cyan-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_feeding_assist', title: '授乳のサポート', subtitle: 'パートナーの支援', content: 'パパにもできることはたくさんあります。', fullContent: '🍼 授乳のサポート：\n\n* 母乳：クッションを調整する、ママの肩を揉む、赤ちゃんの口を拭く。\n* ミルク：空気を飲まないよう哺乳瓶を傾ける。', tips: ['口を拭く', '授乳クッション', '反応を観察する'], source: 'ケアのコツ', icon: 'local_drink', color: 'bg-orange-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_burping', title: 'ゲップのさせ方', subtitle: '優しく背中を叩く', content: 'あごを支え、ガスを逃します。', fullContent: '💨 ゲップのコツ：\n\n1. 横向きに座る：あごと肩を支える。\n2. 手を丸める：手をカップ状にして、下から上に優しく背中を叩く。', tips: ['手をカップ状に', 'あごを支える', 'ゆっくり飲ませる'], source: 'ケアのコツ', icon: 'baby_changing_station', color: 'bg-amber-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_umbilical', title: 'へその緒のケア', subtitle: 'アルコール消毒', content: '消毒しながら乾燥させます。', fullContent: '🚑 へその緒ケア2ステップ：\n\n1. 消毒：75%アルコールで、根元を内側から外側へ拭く。\n2. 乾燥：95%アルコールで、もう一度繰り返す。', tips: ['完全に乾燥させる', '出血や異臭に注意', '1日2〜3回'], source: 'ケアのコツ', icon: 'medical_information', color: 'bg-red-50', minMonth: 1, maxMonth: 1 },
            { id: 'post_soothing', title: '寝かしつけ', subtitle: '安心感を高める', content: '目をこすったり、あくびをしたら眠いサイン。', fullContent: '💤 寝かしつけの鍵：\n\n- 優しく背中を叩く。\n- 安心感を与えるためにおしゃぶりを使う。\n- ゴールデンタイム：「泣く」前、「ぐずり」始めた時に開始する。', tips: ['睡眠のサインに注意', 'おしゃぶりの活用', 'ホワイトノイズ'], source: 'ケアのコツ', icon: 'child_care', color: 'bg-purple-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_crying_meaning', title: '泣き声の意味', subtitle: '泣き声の分析', content: 'お腹が空いた？おむつ？抱っこ？', fullContent: '🗣️ 泣き声の解読：\n\n1. 空腹：甲高い声、吸啜反射。\n2. おむつ：大きな声、足をバタバタさせる。\n3. 眠い：断続的な泣き、目をこする。\n4. 甘えたい：目を合わせ、すするように泣く。\n5. 不快：足を丸める（疝痛）か、弱々しい呻き。', tips: ['生理的欲求を確認', 'ボディランゲージ', '大声＝不快'], source: '分析', icon: 'forum', color: 'bg-violet-50', minMonth: 1, maxMonth: 6 }
        ],
        wellness: [
            { id: 'post_dev_1', title: '生後1ヶ月：睡眠と覚醒', subtitle: '適応期', content: 'ほとんど眠っており、視力はぼやけています。', fullContent: '🍼 1ヶ月の発達：\n\n- 睡眠：脳の成長のために主に寝ています（12-16時間）。\n- 交流：時々おくるみを外し、手足を動かさせます。', tips: ['仰向け寝', '寝て育つ', '視力はぼやけ'], source: 'マイルストーン', icon: 'bedroom_baby', color: 'bg-blue-50', minMonth: 1, maxMonth: 1 },
            { id: 'post_dev_2', title: '生後2ヶ月：把握と感情', subtitle: '手の発見', content: '把握反射が強いです。', fullContent: '🍼 2ヶ月の発達：\n\n- 泣き：泣くことで欲求を表現します。\n- 反射：把握反射が強く、手の訓練に良い時期です。', tips: ['手を握る練習', '触れて落ち着かせる', '音に反応'], source: 'マイルストーン', icon: 'front_hand', color: 'bg-teal-50', minMonth: 2, maxMonth: 2 },
            { id: 'post_dev_3', title: '生後3ヶ月：首すわり', subtitle: '強くなる首の筋肉', content: 'うつ伏せで頭を45度持ち上げます。', fullContent: '🍼 3ヶ月の発達：\n\n- 体力：首の筋肉が強くなり、うつ伏せで頭を上げられます。肺の拡張に良いです。', tips: ['頭を45度上げる', '泣くのも交流', 'よく耳を傾ける'], source: 'マイルストーン', icon: 'visibility', color: 'bg-cyan-50', minMonth: 3, maxMonth: 3 },
            { id: 'post_dev_4', title: '生後4ヶ月：寝返りと笑い', subtitle: '視覚認識', content: '寝返りを打ち、よく笑い、顔を認識します。', fullContent: '🍼 4ヶ月の発達：\n\n- 運動：寝返りを試みます。頭を90度持ち上げられます。\n- 社会性：声を出して笑い、目で人を認識します。\n- 認知：言葉や感覚の刺激をたくさん与えましょう。', tips: ['頭を90度', '寝返りと笑い', '顔を認識'], source: 'マイルストーン', icon: 'sentiment_very_satisfied', color: 'bg-indigo-50', minMonth: 4, maxMonth: 4 },
            { id: 'post_dev_5', title: '生後5ヶ月：歯の生え始め', subtitle: '最初の歯', content: '反応を返し、抱かれると笑います。', fullContent: '🍼 5ヶ月の発達：\n\n- 身体：最初の歯が生え始める赤ちゃんもいます。\n- 社会性：触れ合いに反応し、目を見開いて見ようとします。', tips: ['口腔ケア', '積極的な反応', '人に興味を示す'], source: 'マイルストーン', icon: 'child_care', color: 'bg-amber-50', minMonth: 5, maxMonth: 5 },
            { id: 'post_dev_6', title: '生後6ヶ月：離乳食', subtitle: 'お座りと手を伸ばす', content: '離乳食を試し、座ると頭が安定します。', fullContent: '🍼 6ヶ月の発達：\n\n- 身体：吸啜反射から意識的な食事に変わります。離乳食の時期です。\n- 運動：座った時に頭が安定し、物に手を伸ばそうとします。', tips: ['離乳食の開始', 'お座りの練習', '物に手を伸ばす'], source: 'マイルストーン', icon: 'restaurant', color: 'bg-orange-50', minMonth: 6, maxMonth: 6 },
            { id: 'post_dev_7_8', title: '生後7-8ヶ月：はいはい', subtitle: '粗大運動', content: 'お座りとはいはいを覚えます。', fullContent: '🍼 7-8ヶ月の発達：\n\n- 7ヶ月：お座りを保とうとし、バランスを学びます。\n- 8ヶ月：手足を使ってはいはいし、積み木を掴みます。', tips: ['お座りの練習', 'はいはい', 'おもちゃで遊ぶ'], source: 'マイルストーン', icon: 'directions_run', color: 'bg-green-50', minMonth: 7, maxMonth: 8 },
            { id: 'post_dev_9_10', title: '生後9-10ヶ月：つかまり立ち', subtitle: '歩く前奏曲', content: '家具につかまって立ち、夜間授乳を卒業します。', fullContent: '🍼 9-10ヶ月の発達：\n\n- 9ヶ月：家具につかまって立ち上がります。\n- 10ヶ月：夜間の授乳がなくなり、生活リズムが整います。', tips: ['つかまり立ち', '夜間断乳', '睡眠リズム'], source: 'マイルストーン', icon: 'stairs', color: 'bg-yellow-50', minMonth: 9, maxMonth: 10 },
            { id: 'post_dev_11_12', title: '生後11-12ヶ月：立つと話す', subtitle: '最初の言葉と歩み', content: 'ママパパと言い、一人で立ちます。', fullContent: '🍼 11-12ヶ月の発達：\n\n- 11ヶ月：簡単な言葉（ママ、パパ）を言い、一人で立ちます。\n- 12ヶ月：歩いて探索し、手を振ってバイバイします。', tips: ['ママパパと言う', '一人立ちと歩行', '手を振るバイバイ'], source: 'マイルストーン', icon: 'celebration', color: 'bg-rose-50', minMonth: 11, maxMonth: 12 },
            { id: 'post_depression', title: '産後うつ', subtitle: '傾聴と寄り添い', content: '千のアドバイスよりも大切です。', fullContent: '🌧️ 感情の対処：\n\n- エジンバラ産後うつ病質問票を利用する。\n- 家族は正そうとせず、聞き、理解する。\n- 行動でサポートする（例：家事の分担）。', tips: ['自己診断チェック', '家事の分担', '医療機関への相談'], source: 'メンタルケア', icon: 'psychology', color: 'bg-red-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_sleep_coping', title: '睡眠不足', subtitle: '赤ちゃんが寝ている時に寝る', content: 'プレッシャーをうまく分散する。', fullContent: '☕ 夜を乗り切るコツ：\n\n1. 赤ちゃんと寝る：赤ちゃんが寝ている間に日中でも睡眠を補う。\n2. シフト制：両親で交代し、休む時は耳栓を使う。\n3. 最優先：自分と赤ちゃんのケアが一番。家事は外注するか後回し。', tips: ['昼寝', 'シフト制', '家事の外注'], source: 'ガイド', icon: 'hotel', color: 'bg-indigo-50', minMonth: 1, maxMonth: 6 },
            { id: 'post_self_adjustment', title: '自己調整', subtitle: '完璧でないことを受け入れる', content: '感情を言葉に出す。', fullContent: '🌱 心の守り方：\n\n- 混乱を受け入れる。適応には数ヶ月かかります。\n- 「疲れた」と言う。それは弱さではありません。\n- 感情を日記に書く（1日5分）。', tips: ['期待を下げる', '自己認識', '助けを求める'], source: 'メンタルケア', icon: 'self_improvement', color: 'bg-amber-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_god_teammate', title: 'パートナーとの連携', subtitle: 'チーム戦', content: 'パパにも絆が必要です。', fullContent: 'パートナーガイド：\n\n- パパは決まったタスク（おむつ、お風呂など）を担当する。\n- 毎日褒め、非難を減らす。\n- 週に1時間「育児以外」の会話の時間を設ける。', tips: ['褒める＞非難', 'タスクの固定', '大人同士の会話'], source: '家族', icon: 'groups', color: 'bg-blue-50', minMonth: 1, maxMonth: 12 },
            { id: 'post_social_resources', title: '親のコミュニティ', subtitle: '仲間の力', content: '感情の捌け口。', fullContent: '🌍 共感を求めて：\n親のグループに参加して経験を共有する。アプリを利用して頭の容量を空ける。', tips: ['記録アプリ', 'サポートグループ', '感情の捌け口'], source: 'ガイド', icon: 'public', color: 'bg-green-50', minMonth: 1, maxMonth: 12 }
        ]
    }
};
