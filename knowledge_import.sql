-- DAMALIVE Knowledge Base Import Script
-- 請在 Supabase SQL Editor 中執行此腳本 (全選複製 -> 貼上 -> Run)

-- 1. 建立 Knowledge Base 表 (如果不存在)
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('pregnancy', 'postpartum')),
  period_type text not null check (period_type in ('week', 'month', 'day')),
  period_value int not null,
  title text not null,
  content text not null,
  source_title text,
  source_url text,
  created_at timestamptz not null default now()
);

-- 2. 設定權限 (RLS)
alter table knowledge_base enable row level security;

-- 允許所有人讀取 (重要！因為這是衛教資訊)
drop policy if exists "Enable read access for all users" on knowledge_base;
create policy "Enable read access for all users"
  on knowledge_base for select using (true);

-- 允許已登入用戶新增 (方便我們匯入資料)
drop policy if exists "Enable insert for authenticated users" on knowledge_base;
create policy "Enable insert for authenticated users"
  on knowledge_base for insert with check (auth.role() = 'authenticated');

-- 3. 清空舊資料 (避免重複匯入)
truncate table knowledge_base;

insert into knowledge_base (category, period_type, period_value, title, content) values
-- 新生兒 / 第 1 週
('postpartum', 'week', 1, '新生兒注意事項：睡眠安全', '1. 仰睡最安全：新生兒應該採仰睡，不能趴睡，因為趴睡會增加新生兒猝死症的風險。\n2. 夜間留意寶寶：睡覺時建議留一盞小燈，方便隨時注意寶寶的狀況。\n3. 避免同床：新生兒不應與父母睡在同一張床上，以免大人睡熟時翻身壓到寶寶。\n4. 床墊與環境：床墊要平整不能太軟，身體下方不應放枕頭、棉被、毯子或填充玩偶，避免堵住口鼻。'),
('postpartum', 'week', 1, '新生兒注意事項：體溫與衣著', '1. 避免過熱：房間保持在24度上下。棉被只需蓋到胸口，手臂要露出。\n2. 洋蔥式穿法：摸摸後頸感覺溫度，後頸溫溫的就是剛好。太熱出汗就脫一件。一般來說，寶寶穿的衣服跟大人差不多就好，最多多一件外衣。'),
('postpartum', 'week', 1, '育兒技巧：正確抱姿', '1. 支撐頭頸：新生兒頸部肌肉尚未成熟，抱起時一定要支托頭頸。\n2. 避免劇烈搖晃：不可大力搖晃或拋起新生兒，這會造成腦部傷害（嬰兒搖晃症候群）。'),
('postpartum', 'week', 1, '育兒技巧：換尿布五步驟', '1. 洗屁屁：用溫清水洗淨。\n2. 雙腳舉高：一手抓住雙腳舉高。\n3. 放尿布：放入乾淨尿布。\n4. 黏好尿布：撕開魔鬼氈黏好。\n5. 最後檢查：確認腰部鬆緊度與大腿側邊防漏側邊。'),
('postpartum', 'week', 1, '育兒技巧：幫寶寶洗澡', '採用「橄欖球側抱法」：\n1. 抱好寶寶：將寶寶以橄欖球姿勢側抱在腋下，支托住後頸。\n2. 先洗臉：用濕布巾輕輕擦洗臉部。\n3. 再洗頭：輕輕搓洗頭皮並沖淨。\n4. 最後身體：下水洗身體，留意脖子、腋下、大腿皺褶處。'),
('postpartum', 'week', 1, '育兒技巧：甚至爸爸也能協助親餵', '1. 舒適姿勢：協助媽媽調整靠枕。\n2. 防溢吐奶：準備好紗布巾。\n3. 按摩舒緩：替媽媽按摩頭皮與肩頸，舒緩情緒。'),
('postpartum', 'week', 1, '育兒技巧：瓶餵小撇步', '1. 輕點嘴唇：讓寶寶主動張嘴。\n2. 奶瓶傾斜：充滿奶嘴避免吸入空氣。\n3. 暫停拍嗝：不想喝時不要強迫，先拍嗝休息。'),
('postpartum', 'week', 1, '育兒技巧：如何哄睡', '1. 輕拍寶寶背部或溫柔撫摸。\n2. 使用安撫奶嘴滿足吸吮需求。\n3. 觀察睡眠訊號：揉眼睛、打呵欠時就開始哄，不要等到哭鬧。'),
('postpartum', 'week', 1, '臍帶護理二步驟', '1. 先消毒：75%酒精，由內往外環狀擦拭。\n2. 後乾燥：95%酒精，再次由內往外環狀擦拭，加速乾燥。'),
('postpartum', 'week', 1, '育兒技巧：拍嗝', '1. 讓寶寶側身坐在大人腿上，一手托住下巴頸部。\n2. 另一手手掌微彎呈空心狀，由下往上輕拍背部。'),

-- 寶寶語言 (第 2-4 週)
('postpartum', 'week', 2, '寶寶語言：我肚子餓了', '哭泣方式：哭聲頻率高高低低，伴隨吸吮動作，有尋乳反應。\n對策：觀察喝奶時間，提前準備。'),
('postpartum', 'week', 2, '寶寶語言：尿布濕了', '哭泣方式：哭聲較大且持續，會有蹬腳動作，表情煩躁。\n對策：檢查尿布，建議每2-3小時更換。'),
('postpartum', 'week', 3, '寶寶語言：我想睡覺', '哭泣方式：揉眼睛、打哈欠、摸耳朵。哭聲一陣一陣，煩躁不安。\n對策：移至安靜環境，盡快哄睡。'),
('postpartum', 'week', 3, '寶寶語言：我想要抱抱', '哭泣方式：眼光緊盯照顧者，發出讓人憐惜的哭聲。\n對策：多抱抱他，不用擔心寵壞，這是建立安全感的過程。'),
('postpartum', 'week', 4, '寶寶語言：我不舒服', '哭泣方式：兩腿捲縮（腸絞痛）、哭聲微弱無力伴隨呻吟（生病）。\n對策：觀察體溫與活動力，必要時就醫。'),

-- 每月發展 (Month 1-12)
('postpartum', 'month', 1, '第一個月發展關鍵：睡眠', '新生兒主要活動是睡眠，一天約睡16-18小時。視力模糊，對聲音有反應。\n建議：適當解開包巾束縛，讓寶寶動動手腳，誘發動作發展。'),
('postpartum', 'month', 2, '第二個月發展關鍵：哭泣與反射', '哭是主要溝通方式。會有抓握反射，手指碰到手心會抓緊。\n建議：多跟寶寶握握手、擊掌，訓練手部力量。'),
('postpartum', 'month', 3, '第三個月發展關鍵：抬頭', '頸部肌肉變強，俯臥時頭能抬至45度。\n建議：仔細聆聽寶寶哭聲，練習判斷需求。'),
('postpartum', 'month', 4, '第四個月發展關鍵：翻身', '開始嘗試翻身，會笑出聲、尖叫、認人。俯臥能抬頭90度。\n建議：多跟寶寶說話、逗弄，刺激大腦認知發展。'),
('postpartum', 'month', 5, '第五個月發展關鍵：長牙與互動', '可能冒出第一顆乳牙，注意口腔清潔。對人臉感興趣，被逗弄會笑。\n建議：多給予回應互动，建立社交連結。'),
('postpartum', 'month', 6, '第六個月發展關鍵：副食品', '坐著時頭不後仰，會用手勾東西。是口腔發展期。\n建議：喝母奶寶寶可開始副食品，配方奶寶寶可提早至4個月嘗試。'),
('postpartum', 'month', 7, '第七個月發展關鍵：坐立', '開始嘗試保持坐姿，能抓握物品。\n建議：在旁保護，讓寶寶練習平衡坐立。'),
('postpartum', 'month', 8, '第八個月發展關鍵：爬行', '學會手腳協調爬行，能自己坐著玩積木。\n建議：提供安全的地板空間讓寶寶探索。'),
('postpartum', 'month', 9, '第九個月發展關鍵：扶站', '扶著家具嘗試站立。\n建議：確保家具穩固，鼓勵寶寶站立。'),
('postpartum', 'month', 10, '第十個月發展關鍵：斷夜奶', '逐漸不需要半夜餵奶，養成規律睡眠。\n建議：建立睡前儀式，幫助寶寶安穩過夜。'),
('postpartum', 'month', 11, '第十一個月發展關鍵：叫爸媽', '發展簡單語言，會叫爸爸媽媽。可能獨自站立。\n建議：多跟寶寶對話，指著物品說出名稱。'),
('postpartum', 'month', 12, '第十二個月發展關鍵：走路', '開始學走路，會做簡單手勢（揮手再見）。\n建議：多鼓勵寶寶邁開步伐，並注意環境安全。'),

-- 1-2 歲
('postpartum', 'month', 18, '10個月~1歲半：建立規則', '給予簡單清楚的規則，溫柔語氣取代責備。當他表現好時多稱讚。\n相處秘訣：給他「選擇權」（二選一），讓他感覺被尊重。'),
('postpartum', 'month', 24, '1歲半~2歲：陪伴與放手', '外出時留意安全，但也要接受他偶爾的抗拒或想親近新朋友。\n建議：每天花時間聽他說話，尊重他的想法。適度限制螢幕時間。'),

-- 爸媽身心調適 (General / Month 0)
('pregnancy', 'month', 9, '產前規劃：提前部署', '在孕期尾聲，先訂好月子餐、預約打掃或月嫂。規劃好產後支援系統，確保自己有休息時間。'),
('postpartum', 'month', 0, '爸媽身心調適：接受不完美', '照顧新生兒手忙腳亂是正常的。接受「不完美父母」是常態。覺得累時要說出來，不要硬撐。'),
('postpartum', 'month', 0, '爸媽身心調適：輪流值夜班', '照顧寶寶是馬拉松。建議父母輪流值夜班，不用值班的人戴耳塞好好睡覺。'),
('postpartum', 'month', 0, '爸媽身心調適：給自己喘息時間', '每天留一點時間深呼吸、聽音樂或泡澡。快樂的父母才有快樂的寶寶。');
