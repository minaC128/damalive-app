-- 1. 為知識庫增加語言欄位
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS lang text DEFAULT 'zh';

-- 2. 更新現有資料為 'zh' (繁體中文)
UPDATE knowledge_base SET lang = 'zh' WHERE lang IS NULL;

-- 3. 插入英文版資料 (範例：前 4 週與部分產後資料)
INSERT INTO knowledge_base (category, period_type, period_value, title, content, lang) VALUES
('pregnancy', 'week', 1, 'Week 1: The Beginning', '★ Changes: Menstrual period. Body is preparing for ovulation.
★ Task: Start Folate supplements.
★ Comfort: Relax, everything is just starting.
★ Baby: Fertilized egg is about to form.', 'en'),

('pregnancy', 'week', 2, 'Week 2: Conception', '★ Changes: Slight temperature rise. Ovulation period.
★ Task: Maintain a regular routine.
★ Comfort: Take a deep breath.
★ Baby: Miracle moment is about to happen.', 'en'),

('postpartum', 'month', 1, 'Month 1: Newborn Sleep', '★ Development: Babies sleep 16-18 hours.
★ Safety: Back to sleep is safest.
★ Skill: Support head and neck.
★ Comfort: You will get better at this.', 'en');

-- 4. 插入日文版資料
INSERT INTO knowledge_base (category, period_type, period_value, title, content, lang) VALUES
('pregnancy', 'week', 1, '第1週：生命の始まり', '★身体の変化：月経期です。排卵の準備中。
★タスク：葉酸の摂取を開始しましょう。
★安撫の言葉：リラックスして過ごしてください。
★赤ちゃんの状態：生命の芽生えが始まります。', 'ja');
