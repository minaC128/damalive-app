
// DAMALIVE App v1.1 - Internationalization
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import GrowthTracker from './pages/GrowthTracker';
import AIChat from './pages/AIChat';
import KnowledgeBase from './pages/KnowledgeBase';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import LoginOverlay from './components/LoginOverlay';
import ResetPasswordOverlay from './components/ResetPasswordOverlay';
import OnboardingTour from './components/OnboardingTour';
import { Page, UserProfile } from './types';
import { getAllData } from './services/dbService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // 監聽 Supabase Auth 狀態
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const data = await getAllData(session.user.id);
        if (data.profile) {
          // 如果 profile 存在但沒有 email (可能是舊用戶)，補上 email
          if (!data.profile.email && session.user.email) {
            const updatedProfile = { ...data.profile, email: session.user.email };
            setUser(updatedProfile);
          } else {
            setUser(data.profile);
          }
        } else {
          // session 存在但 profile 不在 → 建立預設的
          const defaultProfile: UserProfile = {
            uid: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${session.user.email}&backgroundColor=f2cece,e1e2cf,fad7c1`,
            birthDate: '',
            isPostpartum: false,
            email: session.user.email,
            fontSize: 'medium',
            preferredLanguage: 'zh',
          };
          setUser(defaultProfile);
        }
      }
      setAuthLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentPage('home');
      } else if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 檢查是否需要顯示導覽
  useEffect(() => {
    if (user && !user.hasSeenTour && !localStorage.getItem(`hasSeenTour_${user.uid}`)) {
      setShowTour(true);
    }
  }, [user]);

  // 監聽字體大小設定並套用到 全局
  useEffect(() => {
    const size = user?.fontSize || 'medium';
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${size}`);
  }, [user?.fontSize]);

  const handleOpenChat = (id: string) => {
    setActiveChatId(id);
    setCurrentPage('ai');
  };

  const onSyncStatusChange = (status: 'syncing' | 'synced') => {
    setSyncStatus(status);
    if (status === 'synced') {
      setTimeout(() => setSyncStatus(null), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dama-bg">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-dama-sakura animate-spin">progress_activity</span>
          <p className="text-sm font-bold text-dama-brown/40">載入中...</p>
        </div>
      </div>
    );
  }

  if (isResettingPassword) {
    return (
      <ResetPasswordOverlay 
        onSuccess={() => setIsResettingPassword(false)} 
        preferredLanguage={user?.preferredLanguage || 'zh'} 
      />
    );
  }

  if (!user) return <LoginOverlay onLogin={setUser} />;

  const renderPage = () => {
    const lang = user.preferredLanguage || 'zh';
    switch (currentPage) {
      case 'home': return <Home user={user} onSyncStatus={onSyncStatusChange} />;
      case 'growth': return <GrowthTracker user={user} />;
      case 'ai': return (
        <AIChat
          user={user}
          chatId={activeChatId}
          onSelectChat={setActiveChatId}
          onClearChatId={() => setActiveChatId(null)}
          onSyncStatus={onSyncStatusChange}
        />
      );
      case 'knowledge': return <KnowledgeBase user={user} onUpdateUser={setUser} onSyncStatus={onSyncStatusChange} />;
      case 'profile': return <Profile user={user} onUpdateUser={setUser} onOpenChat={handleOpenChat} onSyncStatus={onSyncStatusChange} onLogout={handleLogout} onRestartTour={() => setShowTour(true)} />;
      default: return <Home user={user} onSyncStatus={onSyncStatusChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto relative bg-dama-bg shadow-2xl overflow-hidden">
      {syncStatus && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold z-[60] shadow-sm transition-all duration-300 flex items-center gap-2 ${syncStatus === 'syncing' ? 'bg-[#4A3C3C] text-white' : 'bg-dama-matcha text-white'
          }`}>
          <span className="material-symbols-outlined text-xs" style={{ display: syncStatus === 'syncing' ? 'block' : 'none' }}>sync</span>
          <span className="material-symbols-outlined text-xs" style={{ display: syncStatus === 'synced' ? 'block' : 'none' }}>check</span>
          {syncStatus === 'syncing' ? '正在同步數據...' : '資料已更新'}
        </div>
      )}

      <main className="flex-1 pb-24 overflow-y-auto no-scrollbar">
        {renderPage()}
      </main>
      <Navbar currentPage={currentPage} onNavigate={(p) => { setCurrentPage(p); }} language={user.preferredLanguage || 'zh'} />

      {showTour && (
        <OnboardingTour
          language={user.preferredLanguage || 'zh'}
          onFinish={async () => {
            setShowTour(false);
            localStorage.setItem(`hasSeenTour_${user.uid}`, 'true');
            if (!user.hasSeenTour) {
              const updatedUser = { ...user, hasSeenTour: true };
              setUser(updatedUser);
              const { saveProfile } = await import('./services/dbService');
              await saveProfile(user.uid, updatedUser, onSyncStatusChange);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
