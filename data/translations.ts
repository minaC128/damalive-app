
export type Language = 'zh' | 'en' | 'ja';

export const translations = {
    zh: {
        nav: {
            home: '首頁',
            journey: '旅程',
            knowledge: '知識',
            profile: '我的'
        },
        common: {
            loading: '載入中...',
            update: '更新資料',
            cancel: '取消',
            save: '儲存',
            delete: '刪除',
            logout: '登出帳號',
            pregnant: '孕期階段',
            postpartum: '產後護理階段',
            fontSize: '字體大小',
            language: '語言',
            small: '小',
            medium: '中',
            large: '大',
            edit: '編輯',
            collapse: '收起內容'
        },
        home: {
            greeting: '早安',
            babyDays: '寶寶 {days} 天大',
            pregWeeks: '懷孕第 {weeks} 週',
            moodCheck: '今日心情 Check-in',
            moodHappy: '愉快',
            moodCalm: '平靜',
            moodTired: '疲憊',
            moodSad: '沮喪',
            today: '今日插畫',
            drawing: '繪製暖心插畫中...',
            growthInsightTitle: '發展關鍵與照護指南',
            growthPregTitle: '每週成長週記',
            slogan: '「 與寶寶一同成長的每一刻 」'
        },
        planner: {
            title: '媽咪計畫本',
            noNotes: '還沒有任何紀錄嗎？\n記錄下一次的產檢或是寶寶的任務吧！',
            addTitle: '新增計畫紀錄',
            inputTitle: '標題',
            inputTitlePlaceholder: '如：產檢紀錄、寶寶預防針',
            category: '分類',
            catNote: '筆記',
            catTask: '任務',
            catMeeting: '安排',
            targetDate: '計畫日期',
            content: '內容',
            contentPlaceholder: '寫下詳細內容...',
            saveNote: '儲存紀錄',
            expected: '預計：',
            created: '建立',
            emptyContent: '無詳細內容描述',
            viewAll: '還有 {count} 項計畫...',
            collapse: '收納計畫'
        },
        ai: {
            title: 'AI 育兒小達',
            welcome: '哈囉！我是妳的 AI 育兒助手',
            suggestion: '妳可以問我：「初期出血怎麼辦？」或「產後憂鬱如何排解？」',
            placeholder: '輸入妳的問題...',
            history: '聊天歷史紀錄',
            error: '抱歉，我暫時無法回應，請稍後再試。'
        },
        knowledge: {
            title: '生育知識庫',
            tagNutrition: '營養補充',
            tagExercise: '運動指南',
            tagWellness: '身心調適',
            fullStory: '詳細知識內容',
            slogan: '「 每天一點新知識，陪妳溫柔啟航 」'
        },
        profile: {
            title: '個人中心',
            editProfile: '編輯個人檔案',
            nameLabel: '姓名 / 暱稱',
            lmpLabel: '最後一次經期日期 (LMP)',
            dueLabel: '預定產期 (DUE DATE)',
            toPostpartum: '切換至產後階段',
            savedKnowledge: '收藏的知識小卡',
            noSaved: '還沒有收藏任何小卡嗎？\n在知識庫點擊愛心即可收藏！',
            noSavedDesc: '收藏的小卡會顯示在這裡，方便隨時查閱。'
        }
    },
    en: {
        nav: {
            home: 'Home',
            journey: 'Journey',
            knowledge: 'Learn',
            profile: 'Profile'
        },
        common: {
            loading: 'Loading...',
            update: 'Update',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            logout: 'Logout',
            pregnant: 'Pregnancy',
            postpartum: 'Postpartum',
            fontSize: 'Font Size',
            language: 'Language',
            small: 'Small',
            medium: 'Medium',
            large: 'Large',
            edit: 'Edit',
            collapse: 'Collapse'
        },
        home: {
            greeting: 'Good Morning',
            babyDays: 'Baby is {days} days old',
            pregWeeks: 'Week {weeks} of Pregnancy',
            moodCheck: 'Daily Mood Check-in',
            moodHappy: 'Happy',
            moodCalm: 'Calm',
            moodTired: 'Tired',
            moodSad: 'Sad',
            today: 'Daily Art',
            drawing: 'Generating art...',
            growthInsightTitle: 'Development & Care Guide',
            growthPregTitle: 'Weekly Growth Log',
            slogan: '\"Growing together with your baby.\"'
        },
        planner: {
            title: 'Mommy Planner',
            noNotes: 'No records yet?\nRecord your next check-up or baby tasks!',
            addTitle: 'Add New Record',
            inputTitle: 'Title',
            inputTitlePlaceholder: 'e.g., Prenatal check-up, Baby vaccination',
            category: 'Category',
            catNote: 'Note',
            catTask: 'Task',
            catMeeting: 'Event',
            targetDate: 'Target Date',
            content: 'Details',
            contentPlaceholder: 'Write down more details...',
            saveNote: 'Save Record',
            expected: 'Target: ',
            created: 'Created',
            emptyContent: 'No detailed description',
            viewAll: '{count} more plans...',
            collapse: 'Collapse'
        },
        ai: {
            title: 'AI Assistant',
            welcome: 'Hello! I am your AI assistant.',
            suggestion: 'Ask me anything about pregnancy or postpartum care.',
            placeholder: 'Type your message...',
            history: 'Chat History',
            error: 'Sorry, I am having trouble responding. Please try again later.'
        },
        knowledge: {
            title: 'Knowledge Base',
            tagNutrition: 'Nutrition',
            tagExercise: 'Exercise',
            tagWellness: 'Wellness',
            fullStory: 'Detailed Information',
            slogan: '\"A little knowledge every day for a gentle journey.\"'
        },
        profile: {
            title: 'Profile',
            editProfile: 'Edit Profile',
            nameLabel: 'Name / Nickname',
            lmpLabel: 'Last Menstrual Period (LMP)',
            dueLabel: 'Expected Due Date',
            toPostpartum: 'Switch to Postpartum',
            savedKnowledge: 'Saved Cards',
            noSaved: 'No saved cards yet?',
            noSavedDesc: 'Your favorite knowledge cards will appear here.'
        }
    },
    ja: {
        nav: {
            home: 'ホーム',
            journey: 'ジャーニー',
            knowledge: '知識',
            profile: 'マイ'
        },
        common: {
            loading: '読み込み中...',
            update: '更新',
            cancel: 'キャンセル',
            save: '保存',
            delete: '削除',
            logout: 'ログアウト',
            pregnant: '妊娠中',
            postpartum: '産後ケア',
            fontSize: 'フォントサイズ',
            language: '言語',
            small: '小',
            medium: '中',
            large: '大',
            edit: '編輯',
            collapse: '閉じる'
        },
        home: {
            greeting: 'おはようございます',
            babyDays: '赤ちゃん誕生から {days} 日',
            pregWeeks: '妊娠 {weeks} 週目',
            moodCheck: '今日のご気分は？',
            moodHappy: '楽しい',
            moodCalm: '穏やか',
            moodTired: '疲れ',
            moodSad: '悲しい',
            today: '今日のイラスト',
            drawing: 'イラストを作成中...',
            growthInsightTitle: '成長とケアのヒント',
            growthPregTitle: '今週の成長',
            slogan: '「赤ちゃんと共に歩む、かけがえのない時間」'
        },
        planner: {
            title: 'ママの計画帳',
            noNotes: 'まだ記録がありません。\n次回の健診や育児タスクを記録しましょう！',
            addTitle: '新しい記録を追加',
            inputTitle: 'タイトル',
            inputTitlePlaceholder: '例：妊婦健診、赤ちゃんの予防接種',
            category: 'カテゴリー',
            catNote: 'メモ',
            catTask: 'タスク',
            catMeeting: '予定',
            targetDate: '予定日',
            content: '詳細',
            contentPlaceholder: '詳細を入力してください...',
            saveNote: '記録を保存',
            expected: '予定：',
            created: '作成日',
            emptyContent: '詳細な説明はありません',
            viewAll: 'あと {count} 件の予定...',
            collapse: '閉じる'
        },
        ai: {
            title: 'AI アシスタント',
            welcome: 'こんにちは！AIアシスタントです。',
            suggestion: '妊娠や産後のケアについて何でも聞いてください。',
            placeholder: 'メッセージを入力...',
            history: '履歴',
            error: '申し訳ありません。現在応答できません。後でやり直してください。'
        },
        knowledge: {
            title: '知識ベース',
            tagNutrition: '栄養不足',
            tagExercise: '運動',
            tagWellness: '健康',
            fullStory: '詳細内容',
            slogan: '「毎日の知識で、優しい育児のスタートを」'
        },
        profile: {
            title: 'プロフィール',
            editProfile: 'プロフィール編集',
            nameLabel: 'お名前 / ニックネーム',
            lmpLabel: '最終月経開始日 (LMP)',
            dueLabel: '出産予定日',
            toPostpartum: '産後モードへ切り替え',
            savedKnowledge: 'お気に入り',
            noSaved: 'お気に入りはまだありません。',
            noSavedDesc: 'お気に入りのカードがここに表示されます。'
        }
    }
};
