
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
            image: 'tour_welcome_1772716080176.png',
            icon: 'heart_puff'
        },
        {
            title: t.identityTitle,
            desc: t.identityDesc,
            image: 'tour_identity_1772716097860.png',
            icon: 'diversity_3'
        },
        {
            title: t.profileTitle,
            desc: t.profileDesc,
            image: 'tour_welcome_1772716080176.png', // Fallback or reuse
            icon: 'person_edit'
        },
        {
            title: t.homeTitle,
            desc: t.homeDesc,
            image: 'tour_home_1772716144777.png',
            icon: 'home'
        },
        {
            title: t.knowledgeTitle,
            desc: t.knowledgeDesc,
            image: 'tour_knowledge_1772716160884.png',
            icon: 'auto_stories'
        },
        {
            title: t.aiTitle,
            desc: t.aiDesc,
            image: 'tour_ai_1772716112934.png',
            icon: 'smart_toy'
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dama-brown/60 backdrop-blur-xl transition-all duration-500">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl relative flex flex-col items-center"
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

                    {/* Close Button */}
                    <button
                        onClick={onFinish}
                        className="absolute top-12 right-6 w-8 h-8 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-dama-brown/40 hover:text-dama-sakura transition-colors z-20"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>

                    {/* Image Container */}
                    <div className="w-full aspect-square relative overflow-hidden bg-dama-bg">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 z-10" />
                        <img
                            src={`/tour/${steps[step].image}`}
                            className="w-full h-full object-cover"
                            alt="Step Image"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-[24px] shadow-xl flex items-center justify-center z-20 border-4 border-dama-bg">
                            <span className="material-symbols-outlined text-4xl text-dama-sakura" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {steps[step].icon}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 pt-12 text-center flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-dama-brown mb-3 tracking-tight">
                            {steps[step].title}
                        </h2>
                        <p className="text-sm text-dama-brown/60 leading-relaxed font-medium mb-10 max-w-[240px]">
                            {steps[step].desc}
                        </p>

                        <button
                            onClick={nextStep}
                            className="w-full py-4 bg-dama-sakura text-white rounded-3xl font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 group"
                        >
                            {step === steps.length - 1 ? t.finish : t.next}
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                {step === steps.length - 1 ? 'celebration' : 'arrow_forward'}
                            </span>
                        </button>

                        {step < steps.length - 1 && (
                            <button
                                onClick={onFinish}
                                className="mt-4 text-[10px] font-bold text-dama-brown/30 hover:text-dama-brown transition-colors uppercase tracking-widest"
                            >
                                {t.skip}
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default OnboardingTour;
