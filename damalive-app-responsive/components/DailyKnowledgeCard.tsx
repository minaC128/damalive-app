import React, { useEffect, useState } from 'react';
import { UserProfile, KnowledgeItem } from '../types';
import { getDailyKnowledge } from '../services/dbService';

interface DailyKnowledgeCardProps {
    user: UserProfile;
}

const DailyKnowledgeCard: React.FC<DailyKnowledgeCardProps> = ({ user }) => {
    const [tips, setTips] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 預設內容 (當資料庫尚未匯入時顯示)
    const fallbackItem: KnowledgeItem = {
        id: '0',
        category: user.isPostpartum ? 'postpartum' : 'pregnancy',
        period_type: 'month',
        period_value: 1,
        title: user.isPostpartum ? '產後第一個月：好好休息' : '孕期生活：保持愉快心情',
        content: user.isPostpartum
            ? '這段時間媽咪最重要的事情就是照顧好自己。記得跟著寶寶一起小睡，並多喝水與補充營養。'
            : '寶寶正慢慢長大，這是妳與寶寶連結的開始。多聽聽音樂、散散步，讓自己維持放鬆的狀態吧！'
    };

    useEffect(() => {
        const fetchTips = async () => {
            if (!user) return;
            setLoading(true);

            let daysDiff = 0;
            if (user.isPostpartum && user.birthDate) {
                const birth = new Date(user.birthDate);
                const today = new Date();
                daysDiff = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
            } else {
                const reference = user.dueDate ? new Date(user.dueDate) : new Date(user.lmpDate!);
                const now = new Date();
                if (user.dueDate) {
                    daysDiff = 280 - Math.floor((reference.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                } else {
                    daysDiff = Math.floor((now.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24));
                }
            }
            if (daysDiff < 1) daysDiff = 1;

            try {
                const data = await getDailyKnowledge(user.isPostpartum, daysDiff, 'month');
                if (data && data.length > 0) {
                    setTips(data);
                }
            } catch (err) {
                console.error("Fetch tips error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, [user.uid, user.isPostpartum, user.lmpDate, user.dueDate, user.birthDate]);

    if (loading) return (
        <div className="mt-6 bg-white/50 animate-pulse rounded-3xl p-6 h-36 flex flex-col gap-3">
            <div className="h-4 bg-dama-sakura/10 w-1/4 rounded-full"></div>
            <div className="h-6 bg-dama-brown/5 w-3/4 rounded-full"></div>
            <div className="h-4 bg-dama-brown/5 w-full rounded-full"></div>
        </div>
    );

    const tip = tips.length > 0 ? tips[0] : fallbackItem;

    return (
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-dama-sakura/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-dama-matcha/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-dama-matcha/10 flex items-center justify-center shrink-0 text-dama-matcha">
                    <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-dama-matcha uppercase tracking-wider bg-dama-matcha/10 px-2 py-0.5 rounded-full">
                            本月小知識
                        </span>
                        <span className="text-[10px] text-dama-brown/40 font-bold">
                            {tip.period_type === 'week' ? `第 ${tip.period_value} 週` : `第 ${tip.period_value} 個月`}
                        </span>
                    </div>
                    <h3 className="font-bold text-dama-brown text-lg mb-2">{tip.title}</h3>
                    <div className="text-sm text-dama-brown/70 leading-relaxed whitespace-pre-wrap">
                        {tip.content.replace(/\\n/g, '\n')}
                    </div>
                    {tip.source_title && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-dama-brown/30">
                            <span className="material-symbols-outlined text-[12px]">menu_book</span>
                            來源：{tip.source_title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyKnowledgeCard;
