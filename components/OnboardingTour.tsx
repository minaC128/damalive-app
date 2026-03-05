import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, translations } from '../data/translations';

interface OnboardingTourProps {
    language: Language;
    onFinish: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ language, onFinish }) => {
    const [step, setStep] = useState(0);
    const t = translations[language].profile.onboarding;

    const steps = [
        {
            title: t.welcomeTitle,
            desc: t.welcomeDesc,
            icon: 'waving_hand',
            color: 'bg-dama-sakura/10'
        },
        {
            title: t.identityTitle,
            desc: t.identityDesc,
            icon: 'person_search',
            color: 'bg-dama-matcha/10'
        },
        {
            title: t.step1Title,
            desc: t.step1Desc,
            icon: 'account_circle',
            color: 'bg-dama-sakura/5',
            ui: (
                <div className="mt-4 w-32 h-10 bg-white rounded-full shadow-md flex items-center px-3 gap-2 border border-dama-sakura/20">
                    <div className="w-6 h-6 rounded-full bg-dama-sakura/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-dama-sakura">login</span>
                    </div>
                    <div className="h-2 w-16 bg-dama-bg rounded-full" />
                </div>
            )
        },
        {
            title: t.step2Title,
            desc: t.step2Desc,
            icon: 'manage_accounts',
            color: 'bg-blue-50'
        },
        {
            title: t.homeMoodTitle,
            desc: t.homeMoodDesc,
            icon: 'mood',
            color: 'bg-orange-50',
            ui: (
                <div className="flex gap-2 mt-4">
                    {['happy', 'calm', 'tired', 'sad'].map(m => (
                        <div key={m} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">
                            {m === 'happy' ? '😄' : m === 'calm' ? '😌' : m === 'tired' ? '🥱' : '😔'}
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: t.homeCardTitle,
            desc: t.homeCardDesc,
            icon: 'style',
            color: 'bg-dama-sakura/5',
            ui: (
                <div className="mt-4 w-40 h-24 bg-white rounded-2xl shadow-md border border-dama-sakura/10 p-3">
                    <div className="w-8 h-8 rounded-lg bg-dama-sakura/20 mb-2" />
                    <div className="h-2 w-full bg-dama-bg rounded-full mb-1" />
                    <div className="h-2 w-2/3 bg-dama-bg rounded-full" />
                </div>
            )
        },
        {
            title: t.journeyTitle,
            desc: t.journeyDesc,
            icon: 'explore',
            color: 'bg-indigo-50',
            ui: (
                <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full bg-dama-sakura/10 flex items-center justify-center border-4 border-white shadow-sm">
                        <span className="material-symbols-outlined text-4xl text-dama-sakura">pregnant_woman</span>
                    </div>
                </div>
            )
        },
        {
            title: t.knowledgeTitle,
            desc: t.knowledgeDesc,
            icon: 'auto_stories',
            color: 'bg-dama-matcha/5',
            ui: (
                <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-[200px]">
                    <div className="h-12 bg-white rounded-xl shadow-sm border border-dama-matcha/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-dama-matcha">restaurant</span>
                    </div>
                    <div className="h-12 bg-white rounded-xl shadow-sm border border-dama-matcha/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-dama-matcha">fitness_center</span>
                    </div>
                </div>
            )
        },
        {
            title: t.aiTitle,
            desc: t.aiDesc,
            icon: 'smart_toy',
            color: 'bg-violet-50',
            ui: (
                <div className="mt-4 w-full px-4">
                    <div className="bg-white rounded-2xl shadow-md p-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-dama-sakura flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm text-white">smart_toy</span>
                        </div>
                        <div className="h-8 flex-1 bg-dama-bg rounded-lg" />
                    </div>
                </div>
            )
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-dama-brown/60 backdrop-blur-xl transition-all duration-500">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl relative flex flex-col items-center overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="absolute top-8 left-0 right-0 flex justify-center gap-1.5 px-10 z-20">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'flex-1 bg-dama-sakura' : 'w-2 bg-dama-sakura/10'}`}
                            />
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className={`w-full h-48 flex items-center justify-center ${steps[step].color} transition-colors duration-500 pt-8`}>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white rounded-[32px] shadow-xl flex items-center justify-center border-4 border-white/50 relative">
                                <span className="material-symbols-outlined text-4xl text-dama-sakura" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {steps[step].icon}
                                </span>
                            </div>
                            {steps[step].ui}
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="p-10 text-center flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-dama-brown mb-4 tracking-tight leading-tight">
                            {steps[step].title}
                        </h2>
                        <div className="bg-dama-bg/30 p-5 rounded-[24px] mb-8 min-h-[100px] flex items-center">
                            <p className="text-xs text-dama-brown/70 leading-relaxed font-bold">
                                {steps[step].desc}
                            </p>
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <button
                                onClick={nextStep}
                                className="w-full py-4 bg-dama-sakura text-white rounded-[24px] font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 group"
                            >
                                {step === steps.length - 1 ? t.finish : t.next}
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                    {step === steps.length - 1 ? 'celebration' : 'arrow_forward'}
                                </span>
                            </button>

                            {step < steps.length - 1 && (
                                <button
                                    onClick={onFinish}
                                    className="py-2 text-[10px] font-bold text-dama-brown/30 hover:text-dama-brown transition-colors uppercase tracking-widest"
                                >
                                    {t.skip}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default OnboardingTour;
