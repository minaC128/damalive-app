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
            color: 'bg-dama-sakura/10',
            ui: (
                <div className="w-48 h-32 bg-white rounded-[32px] shadow-sm flex items-center justify-center border-4 border-dama-sakura/5">
                    <div className="text-4xl text-dama-sakura">👋</div>
                </div>
            )
        },
        {
            title: t.identityTitle,
            desc: t.identityDesc,
            icon: 'person_search',
            color: 'bg-dama-matcha/10',
            ui: (
                <div className="flex gap-4">
                    <div className="w-20 h-24 bg-white rounded-2xl shadow-sm border-2 border-dama-matcha/20 flex flex-col items-center justify-center p-2">
                        <span className="material-symbols-outlined text-dama-matcha text-2xl">pregnant_woman</span>
                        <div className="w-10 h-1.5 bg-dama-matcha/10 rounded-full mt-2" />
                    </div>
                    <div className="w-20 h-24 bg-white rounded-2xl shadow-sm border-2 border-dama-matcha/20 flex flex-col items-center justify-center p-2">
                        <span className="material-symbols-outlined text-dama-matcha text-2xl">child_care</span>
                        <div className="w-10 h-1.5 bg-dama-matcha/10 rounded-full mt-2" />
                    </div>
                </div>
            )
        },
        {
            title: t.step1Title,
            desc: t.step1Desc,
            icon: 'account_circle',
            color: 'bg-dama-sakura/5',
            ui: (
                <div className="w-40 h-12 bg-white rounded-full shadow-md flex items-center px-4 gap-3 border border-dama-sakura/20">
                    <div className="w-8 h-8 rounded-full bg-dama-sakura/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-dama-sakura">login</span>
                    </div>
                    <div className="h-2 w-20 bg-dama-bg rounded-full" />
                </div>
            )
        },
        {
            title: t.step2Title,
            desc: t.step2Desc,
            icon: 'manage_accounts',
            color: 'bg-blue-50',
            ui: (
                <div className="w-44 h-28 bg-white rounded-[24px] shadow-sm p-4 relative border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs text-blue-400">person</span>
                        </div>
                        <div className="h-1.5 w-16 bg-dama-bg rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-dama-bg rounded-full" />
                        <div className="h-1.5 w-2/3 bg-dama-bg rounded-full" />
                    </div>
                </div>
            )
        },
        {
            title: t.homeMoodTitle,
            desc: t.homeMoodDesc,
            icon: 'mood',
            color: 'bg-orange-50',
            ui: (
                <div className="flex gap-2">
                    {['happy', 'calm', 'tired', 'sad'].map(m => (
                        <div key={m} className={`w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl border-2 ${m === 'happy' ? 'border-orange-200' : 'border-transparent'}`}>
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
                <div className="w-44 h-32 bg-white rounded-[32px] shadow-lg border border-dama-sakura/10 overflow-hidden relative">
                    <div className="h-20 bg-dama-sakura/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-dama-sakura/30">image</span>
                    </div>
                    <div className="p-3">
                        <div className="h-2 w-full bg-dama-bg rounded-full mb-1" />
                        <div className="h-2 w-2/3 bg-dama-bg rounded-full" />
                    </div>
                </div>
            )
        },
        {
            title: t.journeyTitle,
            desc: t.journeyDesc,
            icon: 'explore',
            color: 'bg-indigo-50',
            ui: (
                <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-indigo-100 shadow-sm relative">
                        <span className="material-symbols-outlined text-4xl text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>pregnant_woman</span>
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">W12</div>
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
                <div className="grid grid-cols-2 gap-3 w-48">
                    <div className="h-16 bg-white rounded-2xl shadow-sm border border-dama-matcha/10 flex flex-col items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-dama-matcha text-xl">restaurant</span>
                        <div className="w-8 h-1 bg-dama-matcha/10 rounded-full" />
                    </div>
                    <div className="h-16 bg-white rounded-2xl shadow-sm border border-dama-matcha/10 flex flex-col items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-dama-matcha text-xl">fitness_center</span>
                        <div className="w-8 h-1 bg-dama-matcha/10 rounded-full" />
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
                <div className="w-56 px-4">
                    <div className="bg-white rounded-3xl shadow-md p-4 flex items-start gap-3 border border-violet-100">
                        <div className="w-10 h-10 rounded-2xl bg-violet-500 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl text-white">smart_toy</span>
                        </div>
                        <div className="space-y-2 flex-1 pt-1">
                            <div className="h-2 w-full bg-dama-bg rounded-full" />
                            <div className="h-2 w-4/5 bg-dama-bg rounded-full" />
                        </div>
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-dama-brown/40 backdrop-blur-xl transition-all duration-500">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-sm flex flex-col items-center gap-8 relative"
                >
                    {/* UI Mockup Display */}
                    <div className={`w-full aspect-[4/3] rounded-[48px] shadow-2xl overflow-hidden relative flex items-center justify-center ${steps[step].color} border-4 border-white`}>
                        {/* Static Progress Indicator */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-10 z-20">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-dama-sakura' : 'w-2 bg-dama-sakura/10'}`} />
                            ))}
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {steps[step].ui}
                        </motion.div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-dama-bg/50">
                            <span className="material-symbols-outlined text-2xl text-dama-sakura">{steps[step].icon}</span>
                        </div>
                    </div>

                    {/* Annotation Bubble */}
                    <div className="w-full relative">
                        {/* Bubble Tail */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 rounded-sm shadow-[-5px_-5px_10px_rgba(0,0,0,0.02)]" />

                        <div className="bg-white rounded-[40px] p-8 pb-10 shadow-2xl relative z-10 text-center flex flex-col items-center">
                            <h2 className="text-xl font-bold text-dama-brown mb-3 tracking-tight">
                                {steps[step].title}
                            </h2>
                            <p className="text-xs text-dama-brown/60 leading-relaxed font-bold mb-8 px-4">
                                {steps[step].desc}
                            </p>

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

                                {step < steps.length - 1 ? (
                                    <button onClick={onFinish} className="py-2 text-[10px] font-bold text-dama-brown/30 hover:text-dama-brown transition-colors uppercase tracking-widest">
                                        {t.skip}
                                    </button>
                                ) : (
                                    <div className="h-8" />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default OnboardingTour;
