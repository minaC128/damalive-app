
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';
import { saveProfile } from '../services/storageService';

interface LoginOverlayProps {
  onLogin: (user: UserProfile) => void;
}

const LoginOverlay: React.FC<LoginOverlayProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // 註冊
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('註冊失敗');

        // 建立預設 profile
        const defaultProfile: UserProfile = {
          uid: data.user.id,
          name: email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          isPostpartum: false,
          lmpDate: '',
        };
        await saveProfile(data.user.id, defaultProfile);
        onLogin(defaultProfile);
      } else {
        // 登入
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (!data.user) throw new Error('登入失敗');

        // 從 DB 取 profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('uid', data.user.id)
          .single();

        if (profileData) {
          onLogin({
            uid: profileData.uid,
            name: profileData.name,
            avatar: profileData.avatar,
            lmpDate: profileData.lmp_date,
            dueDate: profileData.due_date,
            birthDate: profileData.birth_date,
            babyName: profileData.baby_name,
            isPostpartum: profileData.is_postpartum,
          });
        } else {
          // profile 不存在，建立一個預設的
          const defaultProfile: UserProfile = {
            uid: data.user.id,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            isPostpartum: false,
            lmpDate: '',
          };
          await saveProfile(data.user.id, defaultProfile);
          onLogin(defaultProfile);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || '操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-accent-pink flex flex-col items-center justify-center p-8 text-center z-[100] animate-in fade-in duration-700">
      <div className="bg-white/95 backdrop-blur-sm p-12 rounded-[60px] shadow-2xl flex flex-col items-center gap-8 max-w-sm w-full border-4 border-white">
        <div className="w-24 h-24 bg-dama-bg rounded-full flex items-center justify-center text-6xl shadow-inner border-2 border-dama-sakura animate-bounce [animation-duration:3s]">🧸</div>

        {!isLoginView ? (
          <>
            <div className="space-y-2">
              <a href="https://1125anton.my.canva.site/damalive" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                <h1 className="text-4xl font-display font-bold text-dama-brown tracking-tight uppercase">DAMALIVE</h1>
              </a>
              <div className="h-1 w-12 bg-dama-sakura mx-auto rounded-full"></div>
              <p className="text-dama-brown/60 text-sm font-bold leading-relaxed mt-4">
                妳的雲端健康護理師<br />全程陪伴妳的孕產旅程
              </p>
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={() => { setIsLoginView(true); setIsSignUp(false); }}
                className="w-full flex items-center justify-center gap-3 bg-dama-sakura text-white py-4 rounded-full hover:bg-dama-sakura/90 transition-all shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                <span className="font-bold">登入帳號</span>
              </button>
              <button
                onClick={() => { setIsLoginView(true); setIsSignUp(true); }}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-dama-sakura py-4 rounded-full hover:bg-dama-sakura text-dama-brown hover:text-white transition-all shadow-lg active:scale-95"
              >
                <span className="font-bold">註冊新帳號</span>
              </button>
              <button
                onClick={() => {
                  const demoUser: UserProfile = {
                    uid: 'guest-123',
                    name: 'Guest User',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
                    isPostpartum: false,
                    lmpDate: '',
                  };
                  onLogin(demoUser);
                }}
                className="w-full flex items-center justify-center gap-3 bg-dama-brown/10 text-dama-brown py-4 rounded-full hover:bg-dama-brown/20 transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="font-bold">訪客試用 (免登入)</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleAuth} className="w-full space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-dama-brown">{isSignUp ? '建立帳號' : '歡迎回來'}</h2>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-2xl border border-red-200">
                {error}
              </div>
            )}

            <div className="text-left space-y-1">
              <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">電子信箱</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="請輸入電子信箱"
                className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                required
              />
            </div>
            <div className="text-left space-y-1">
              <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">密碼</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isSignUp ? '設定密碼（至少 6 碼）' : '請輸入密碼'}
                className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dama-sakura text-white py-4 rounded-full font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? '處理中...' : (isSignUp ? '註冊' : '登入')}
            </button>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className="text-xs text-dama-brown/40 font-bold hover:text-dama-sakura transition-colors"
              >
                返回
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-xs text-dama-sakura font-bold hover:text-dama-brown transition-colors"
              >
                {isSignUp ? '已有帳號？登入' : '沒有帳號？註冊'}
              </button>
            </div>
          </form>
        )}

        <div className="w-full">
          <div className="flex items-center gap-2 justify-center opacity-30 mb-4">
            <span className="material-symbols-outlined text-xs">lock</span>
            <p className="text-[10px] font-bold">用戶個資都將嚴密保存</p>
          </div>

          <div className="pt-2 border-t border-dama-brown/5">
            <p className="text-[9px] text-dama-brown/20 font-bold max-w-[200px] mx-auto">
              點擊登入即代表您同意服務條款<br />與個人隱私資料保護政策
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default LoginOverlay;
