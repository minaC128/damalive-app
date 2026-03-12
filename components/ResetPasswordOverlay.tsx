import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Language } from '../data/translations';

interface ResetPasswordOverlayProps {
  onSuccess: () => void;
  preferredLanguage?: Language;
}

const ResetPasswordOverlay: React.FC<ResetPasswordOverlayProps> = ({ onSuccess, preferredLanguage = 'zh' }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Language>(preferredLanguage);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(lang === 'zh' ? '兩次輸入的密碼不一致' : lang === 'ja' ? 'パスワードが一致しません' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(lang === 'zh' ? '密碼長度至少需 6 個字元' : lang === 'ja' ? 'パスワードは6文字以上で入力してください' : 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      alert(lang === 'zh' ? '密碼重設成功！' : lang === 'ja' ? 'パスワードのリセットに成功しました！' : 'Password reset successful!');
      onSuccess();
    } catch (err: any) {
      console.error('Update password error:', err);
      setError(err.message || (lang === 'zh' ? '重設密碼失敗，請重試' : lang === 'ja' ? 'パスワードのリセットに失敗しました' : 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-accent-pink flex flex-col items-center justify-center p-8 text-center z-[100] animate-in fade-in duration-700">
      <div className="bg-white/95 backdrop-blur-sm p-12 rounded-[60px] shadow-2xl flex flex-col items-center gap-8 max-w-sm w-full border-4 border-white relative">
        <div className="absolute top-8 right-8 flex bg-dama-bg p-1 rounded-2xl shadow-inner scale-75 origin-top-right">
          {(['zh', 'en', 'ja'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${lang === l ? 'bg-white text-dama-sakura shadow-sm' : 'text-dama-brown/30'}`}
            >
              {l === 'zh' ? '中' : l === 'en' ? 'EN' : 'JP'}
            </button>
          ))}
        </div>

        <div className="w-24 h-24 bg-dama-bg rounded-full flex items-center justify-center text-6xl shadow-inner border-2 border-dama-sakura animate-bounce [animation-duration:3s]">🔐</div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-dama-brown">
            {lang === 'zh' ? '設定新密碼' : lang === 'ja' ? '新しいパスワードの設定' : 'Set New Password'}
          </h2>
          <p className="text-dama-brown/60 text-sm font-bold leading-relaxed mt-2">
            {lang === 'zh' ? '請輸入您的新密碼' : lang === 'ja' ? '新しいパスワードを入力してください' : 'Please enter your new password'}
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="w-full space-y-4 animate-in slide-in-from-right-4 duration-300">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-2xl border border-red-200">
              {error}
            </div>
          )}

          <div className="text-left space-y-1">
            <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">
              {lang === 'zh' ? '新密碼' : lang === 'ja' ? '新しいパスワード' : 'New Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
              required
              minLength={6}
            />
          </div>

          <div className="text-left space-y-1">
            <label className="text-[10px] font-bold text-dama-brown/40 uppercase ml-2">
              {lang === 'zh' ? '確認新密碼' : lang === 'ja' ? '新しいパスワード (確認)' : 'Confirm Password'}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-dama-bg border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-dama-sakura"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dama-sakura text-white py-4 rounded-full font-bold shadow-lg shadow-dama-sakura/20 active:scale-95 transition-all mt-6 disabled:opacity-50"
          >
            {loading ? (lang === 'zh' ? '處理中...' : '...') : (lang === 'zh' ? '確認修改' : lang === 'ja' ? '変更を確定する' : 'Confirm Change')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordOverlay;
