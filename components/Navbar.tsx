
import React from 'react';
import { Page, UserProfile } from '../types';
import { translations, Language } from '../data/translations';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  language?: Language;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, language = 'zh' }) => {
  const t = translations[language].nav;
  const navItems = [
    { id: 'home', label: t.home, icon: 'home' },
    { id: 'growth', label: t.journey, icon: 'auto_graph' },
    { id: 'ai', label: '小達', icon: 'pets', special: true },
    { id: 'knowledge', label: t.knowledge, icon: 'menu_book' },
    { id: 'profile', label: t.profile, icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-accent-pink/30 pb-8 pt-3 px-4 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_30px_rgba(242,206,206,0.2)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as Page)}
          className={`flex flex-col items-center gap-1 w-1/5 transition-all ${item.special ? '-mt-10' : ''
            } ${currentPage === item.id ? 'text-dama-sakura' : 'text-dama-brown/40'}`}
        >
          {item.special ? (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white active:scale-90 transition-transform ${currentPage === 'ai' ? 'bg-dama-matcha' : 'bg-dama-sakura'}`}>
              <span className="material-symbols-outlined text-3xl">pets</span>
            </div>
          ) : (
            <>
              <span className={`material-symbols-outlined text-2xl ${currentPage === item.id ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
