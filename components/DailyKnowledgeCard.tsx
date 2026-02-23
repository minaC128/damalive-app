import React, { useEffect, useState } from 'react';
import { UserProfile, KnowledgeItem } from '../types';
import { getDailyKnowledge } from '../services/storageService';

interface DailyKnowledgeCardProps {
    user: UserProfile;
}

const DailyKnowledgeCard: React.FC<DailyKnowledgeCardProps> = ({ user }) => {
    const [tips, setTips] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            if (!user) return;

            let daysDiff = 0;
            if (user.isPostpartum && user.birthDate) {
                const birth = new Date(user.birthDate);
                const today = new Date();
                daysDiff = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff < 1) daysDiff = 1;
            } else if (!user.isPostpartum && user.lmpDate) {
                const lmp = new Date(user.lmpDate);
                const today = new Date();
                daysDiff = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff < 1) daysDiff = 1;
            }

            const data = await getDailyKnowledge(user.isPostpartum, daysDiff);
            setTips(data);
            setLoading(false);
        };

        fetchTips();
    }, [user]);

    if (loading) return <div className="animate-pulse h-32 bg-dama-brown/5 rounded-3xl mt-6"></div>;
    if (tips.length === 0) return null;

    // 隨機選一條或全部顯示
    const tip = tips[0];

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
                            每日小知識
                        </span>
                        <span className="text-[10px] text-dama-brown/40 font-bold">
                            {tip.period_type === 'week' ? `第 ${tip.period_value} 週` : `第 ${tip.period_value} 個月`}
                        </span>
                    </div>
                    <h3 className="font-bold text-dama-brown text-lg mb-2">{tip.title}</h3>
                    <div className="text-sm text-dama-brown/70 leading-relaxed whitespace-pre-wrap">
                        {tip.content}
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
