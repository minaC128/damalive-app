
export const pregnancyPool: any = {
    zh: {
        nutrition: [
            {
                id: 'preg_folate',
                title: '葉酸 (Folate)',
                subtitle: '神經管守護者',
                desc: '下圖查看更多詳細內容。',
                fullContent: '🧠 葉酸｜幫助寶寶腦部和脊髓發育\n\n* 為什麼重要？\n懷孕初期是寶寶腦部與神經發育的關鍵時期，葉酸不夠，會增加先天性神經發育問題的風險。\n\n* 什麼時候最重要？\n👉 懷孕前～懷孕 12 週特別重要\n\n* 怎麼補充？\n- 深綠色蔬菜（菠菜、紅莧菜、韭菜、空心菜、紅鳳菜）\n- 豆類、豆製品（燕麥、紅藜、紅豆、綠豆、鷹嘴豆、碗豆仁）\n- 動物（豬肝、雞肝、鯖魚、牡蠣、淡菜）\n- 也可依醫師建議補充葉酸',
                tips: ['菠菜、蘆筍', '動物肝臟', '懷孕初期必備'],
                source: '孕期營養',
                icon: 'eco',
                color: 'bg-dama-sakura/10'
            },
            {
                id: 'preg_iron',
                title: '鐵質 (Iron)',
                subtitle: '供應血氧團隊',
                desc: '後期及分娩時失血量大，需加強補充。',
                fullContent: '🩸 鐵｜預防貧血與早產\n\n* 為什麼重要？\n懷孕時，媽媽的血量會增加，若鐵不夠，容易貧血，也可能影響寶寶成長，增加早產風險。\n\n* 怎麼補充？\n- 紅肉（牛肉、豬肉）\n- 深綠色蔬菜\n- 豆干、豆腐等豆類\n- 到懷孕後期，鐵的需求會增加，可依醫師建議補充',
                tips: ['紅肉、黑木耳', '葡萄乾', '紅莧菜'],
                source: '孕期掃盲',
                icon: 'bloodtype',
                color: 'bg-red-50'
            }
        ],
        exercise: [
            {
                id: 'preg_walk',
                title: '步行散步',
                subtitle: '安全有氧',
                desc: '日常最簡單且有效的運動方式。',
                fullContent: '🚶‍♀️ 步行\n最簡單、安全、隨時做得到！有助心肺健康。\n\n運動的好處：\n- 增強心肺功能 & 血液循環\n- 減少疲倦和水腫\n- 幫助控制體重\n- 減少腰背疼痛\n- 能提升睡眠品質',
                tips: ['舒適運動鞋', '避開極端氣候', '補充水分'],
                source: '運動指南',
                icon: 'directions_walk',
                color: 'bg-dama-matcha/10'
            },
            {
                id: 'preg_yoga',
                title: '孕婦瑜珈',
                subtitle: '身心平衡',
                desc: '緩解腰痠背痛，練習呼吸律動。',
                fullContent: '🧘‍♀️ 孕婦瑜珈｜溫柔的伸展\n\n* 好處：\n- 強化骨盆肌肉，幫助順產\n- 改善血液循環，減少抽筋\n- 練習深呼吸，緩解產前焦慮\n- 矯正體態，減少腰椎負擔',
                tips: ['專業老師指導', '避免壓迫腹部', '量力而為'],
                source: '運動指南',
                icon: 'self_improvement',
                color: 'bg-indigo-50'
            }
        ],
        wellness: [
            {
                id: 'preg_mental',
                title: '心理安適',
                subtitle: '保持心情愉快',
                desc: '情緒波動是正常的。點擊查看更多放鬆方法。',
                fullContent: '保持心情愉快的好方法：\n\n1. 追求興趣愛好\n2. 保持積極的社交活動\n3. 設定小目標和獎勳\n4. 寫日記\n5. 規劃未來的期待',
                tips: ['深呼吸', '寫日記', '輕快音樂'],
                source: '心靈錦囊',
                icon: 'favorite',
                color: 'bg-rose-50'
            },
            {
                id: 'preg_skin',
                title: '孕期肌膚護理',
                subtitle: '預防妊娠紋',
                desc: '從三個月開始加強滋潤。',
                fullContent: '✨ 肌膚護理｜媽咪也要美美的\n\n* 關鍵點：\n- 選擇無香味、低刺激的保養品\n- 在肚子、大腿、臀部塗抹妊娠紋霜或油\n- 保持室內濕度適中\n- 多喝水，從內而外補水',
                tips: ['洗澡後立即塗抹', '成分簡單最重要', '搭配溫柔按摩'],
                source: '生活美學',
                icon: 'face_retouching_natural',
                color: 'bg-orange-50'
            }
        ]
    },
    en: {
        nutrition: [
            {
                id: 'preg_folate',
                title: 'Folate',
                subtitle: 'Guardian of Neural Tubes',
                desc: 'Click for more details.',
                fullContent: '🧠 Folate | Supporting Baby\'s Brain and Spinal Cord Development\n\n* Why is it important?\nEarly pregnancy is a critical period for brain and nerve development.',
                tips: ['Spinach, Asparagus', 'Beef Liver', 'Citrus'],
                source: 'Nutrition',
                icon: 'eco',
                color: 'bg-dama-sakura/10'
            },
            {
                id: 'preg_iron',
                title: 'Iron',
                subtitle: 'Oxygen Delivery',
                desc: 'Crucial for blood volume.',
                fullContent: '🩸 Iron helps prevent anemia and promotes healthy growth.',
                tips: ['Red meat', 'Lentils', 'Spinach'],
                source: 'Nutrition',
                icon: 'bloodtype',
                color: 'bg-red-50'
            }
        ],
        exercise: [
            {
                id: 'preg_walk',
                title: 'Walking',
                subtitle: 'Safe Exercise',
                desc: 'Keep moving gently.',
                fullContent: 'Walking is the best way to maintain health during pregnancy.',
                tips: ['Good shoes', 'Hydrate', 'Pace yourself'],
                source: 'Fitness',
                icon: 'directions_walk',
                color: 'bg-dama-matcha/10'
            }
        ],
        wellness: [
            {
                id: 'preg_mental',
                title: 'Mental Wellness',
                subtitle: 'Stay Positive',
                desc: 'Normal to feel moody.',
                fullContent: 'Take time for yourself.',
                tips: ['Rest', 'Breathe', 'Connect'],
                source: 'Self-care',
                icon: 'favorite',
                color: 'bg-rose-50'
            }
        ]
    },
    ja: {
        nutrition: [
            {
                id: 'preg_folate',
                title: '葉酸',
                subtitle: '赤ちゃんの健康のために',
                desc: '詳細は下をクリック。',
                fullContent: '葉酸は赤ちゃんの神経管の発達に不可欠です。',
                tips: ['ほうれん草', 'ブロッコリー'],
                source: '栄養',
                icon: 'eco',
                color: 'bg-dama-sakura/10'
            }
        ],
        exercise: [],
        wellness: []
    }
};

export const postpartumPool: any = {
    zh: {
        nutrition: [
            {
                id: 'post_iron',
                title: '產後補鐵',
                subtitle: '恢復紅韻氣色',
                desc: '分娩失血後，補充鐵質能幫助體力恢復。',
                fullContent: '🩸 產後補鐵｜告別疲憊感\n\n* 為什麼重要？\n生產過程會流失大量血液，缺鐵容易感到頭暈、疲倦。如果是母乳媽咪，寶寶也會透過奶水吸收鐵質喔。\n\n* 推薦食物：\n- 紅肉（牛、豬、羊）\n- 豬肝、腰子（傳統月子餐常客）\n- 紅莧菜、黑木耳\n- 櫻桃、紅龍果',
                tips: ['搭配維生素 C 吸收更好', '避免與茶/咖啡同食', '少量多餐補足'],
                source: '產後營養',
                icon: 'vital_signs',
                color: 'bg-red-50'
            },
            {
                id: 'post_fiber',
                title: '纖維質與水分',
                subtitle: '順暢小秘訣',
                desc: '預防產後常見的便秘困擾。',
                fullContent: '🥬 纖維質｜讓腸道動起來\n\n* 為什麼重要？\n產後活動量減少加上傷口顧慮，便秘是許多媽咪的痛。充足的纖維與水分是最好的解決法。\n\n* 實踐清單：\n- 每天至少 3 份蔬菜、2 份水果\n- 五穀飯取代白飯\n- 每天飲水 2000cc 以上\n- 嘗試規律作息',
                tips: ['地瓜、奇異果', '溫開水輔助', '腹部輕柔按摩'],
                source: '產後營養',
                icon: 'egg_alt',
                color: 'bg-orange-50'
            }
        ],
        exercise: [
            {
                id: 'post_bath',
                title: '洗澡與護理',
                subtitle: '橄欖球抱法',
                desc: '安全洗滌法與頸部支撐技巧。',
                fullContent: '洗澡技巧：\n* 橄欖球側抱法支撐頸部\n* 先洗臉再洗頭\n* 最後清洗身體與皺褶處',
                tips: ['支托後頸', '先洗臉再洗頭', '保持乾燥'],
                source: '育兒技巧',
                icon: 'soap',
                color: 'bg-cyan-50'
            },
            {
                id: 'post_massage',
                title: '嬰兒按摩',
                subtitle: '親密接觸',
                desc: '透過觸碰建立安全感並緩解腹脹。',
                fullContent: '👶 嬰兒按摩｜愛的連結\n\n- 腹部順時針按摩可幫助排氣\n- 輕撫四肢促進神經發育\n- 最好在洗澡後、睡覺前進行',
                tips: ['避開飯後一小時', '注意寶寶反應', '眼神交流不可少'],
                source: '育兒技巧',
                icon: 'volunteer_activism',
                color: 'bg-teal-50'
            }
        ],
        wellness: [
            {
                id: 'post_mental',
                title: '心靈導航',
                subtitle: '產後心理調適',
                desc: '接受不完美，並學會說出情緒。',
                fullContent: '產後心理健康：\n1. 接受不完美是常態\n2. 大方傾訴不適感\n3. 適當放下育兒任務給隊友',
                tips: ['情感宣洩', '降低期待', '自我察覺'],
                source: '身心調適',
                icon: 'favorite',
                color: 'bg-rose-50'
            },
            {
                id: 'post_couple',
                title: '伴侶合作',
                subtitle: '你是我的神隊友',
                desc: '分工育兒，讓照顧品質更穩定。',
                fullContent: '🤝 團隊作戰｜不只是一人的事\n\n- 固定一小段夫妻專屬對話時刻\n- 肯定對方的付出，減少責備\n- 爸爸負責洗澡，建立父子連結',
                tips: ['每天讚美三句', '共同制定計畫', '分擔夜間照顧'],
                source: '家庭關係',
                icon: 'groups',
                color: 'bg-blue-50'
            }
        ]
    },
    en: {
        nutrition: [
            {
                id: 'post_iron',
                title: 'Postpartum Iron',
                subtitle: 'Restore Energy',
                desc: 'Essential for recovery.',
                fullContent: 'Iron helps replace blood lost during delivery.',
                tips: ['Beef', 'Spinach'],
                source: 'Recovery',
                icon: 'vital_signs',
                color: 'bg-red-50'
            }
        ],
        exercise: [],
        wellness: []
    }
};
