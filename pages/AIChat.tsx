
import React, { useState, useEffect, useRef } from 'react';
// UI Version: 2026-03-05-v3-Zen
import { UserProfile, ChatMessage } from '../types';
import { getChatHistory, saveChatMessage, deleteChatSession } from '../services/dbService';
import { translations } from '../data/translations';

const AIChat: React.FC<{
  user: UserProfile,
  chatId: string | null,
  onSelectChat: (id: string) => void,
  onClearChatId: () => void,
  onSyncStatus: any
}> = ({ user, chatId, onSelectChat, onClearChatId, onSyncStatus }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<{ id: string, lastMessage: string, timestamp: number }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const lang = user.preferredLanguage || 'zh';
  const t = translations[lang].ai;
  const tc = translations[lang].common;

  // 建議問題池
  const SUGGESTION_POOL = [
    '懷孕初期飲食', '什麼是葉酸？', '最近很焦慮...', '感冒可以吃藥嗎？',
    '胎動什麼時候開始？', '如何緩解孕吐？', '產後憂鬱怎麼辦？', '餵母乳要注意什麼？',
    '寶寶哭鬧不停', '如何選購待產包？', '孕期運動建議', '睡眠品質變差',
    '腰痠背痛', '孕期皮膚變化', '體重管理'
  ];

  // 每 3 小時隨機更新一次建議
  const currentSuggestions = React.useMemo(() => {
    const threeHoursInMs = 1000 * 60 * 60 * 3;
    const seed = Math.floor(Date.now() / threeHoursInMs);
    const len = SUGGESTION_POOL.length;
    // 使用 seed 決定三個不重複的索引 (簡單確定性算法)
    const idx1 = seed % len;
    const idx2 = (seed + 7) % len;
    const idx3 = (seed + 13) % len;
    return [SUGGESTION_POOL[idx1], SUGGESTION_POOL[idx2 === idx1 ? (idx2 + 1) % len : idx2], SUGGESTION_POOL[idx3 === idx1 || idx3 === idx2 ? (idx3 + 1) % len : idx3]];
  }, []);

  // Helper function to map history to sorted sessions
  const mapHistoryToSessions = (history: Record<string, ChatMessage[]>) => {
    return Object.entries(history)
      .map(([id, msgs]: [string, any]) => {
        const lastMsg = msgs[msgs.length - 1];
        // Ensure we handle timestamp consistently
        let ts = lastMsg?.timestamp || Date.now();
        // If it's a string Date, convert to number
        if (typeof ts === 'string') ts = new Date(ts).getTime();

        const lastContent = lastMsg?.content || '';

        return {
          id,
          lastMessage: lastContent,
          timestamp: Number(ts) || Date.now()
        };
      })
      // 放寬過濾，確保內容一定能顯示出現在列表中
      .filter(s => s.lastMessage && s.lastMessage.trim() !== '')
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  useEffect(() => {
    const loadSessions = async () => {
      const history = await getChatHistory(user.uid);
      setSessions(mapHistoryToSessions(history));

      if (chatId && history && history[chatId]) {
        setMessages(history[chatId]);
      } else if (!chatId) {
        setMessages([]);
      }
      // 如果有 chatId 但歷史紀錄還沒同步到，且我們有本地訊息，就先保留本地訊息
      // 這能防止發送第一則訊息後，useEffect 重新讀取 history 導致 messages 被清空的情形
    };
    loadSessions();
  }, [user.uid, chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentChatId = chatId || Date.now().toString();
    if (!chatId) onSelectChat(currentChatId);

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input, // 最後一則訊息作為 query
          history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.text || 'Failed to fetch AI response');
      }

      const data = await response.json();
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.text, // 後端回傳的是 text 欄位
        timestamp: Date.now()
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveChatMessage(user.uid, currentChatId, finalMessages, onSyncStatus);

      // 重要：儲存後立即重新讀取列表，確保「紀錄」視窗同步最新狀態
      const history = await getChatHistory(user.uid);
      setSessions(mapHistoryToSessions(history));

    } catch (error: any) {
      console.error('Chat error:', error);

      let errorText = t.error;
      // 嘗試從後端獲取更具體的錯誤訊息
      if (error instanceof Error && error.message) {
        errorText = error.message;
      }

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorText,
        timestamp: Date.now()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // 強制讀取一次確保 UI 同步
      const history = await getChatHistory(user.uid);
      setSessions(mapHistoryToSessions(history));
    }
  };

  const handleNewChat = () => {
    onClearChatId();
    setMessages([]);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e: any, id: string) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    console.log('Attempting to delete session:', id);

    const confirmMsg = "確定要刪除這則對話紀錄嗎？";
    if (window.confirm(confirmMsg)) {
      try {
        console.log('Deletion confirmed for:', id);
        await deleteChatSession(user.uid, id, onSyncStatus);

        if (chatId === id) {
          handleNewChat();
        }

        // Refresh local history list
        const history = await getChatHistory(user.uid);
        setSessions(mapHistoryToSessions(history));
        console.log('History refreshed successfully');
      } catch (err) {
        console.error('Delete failed:', err);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const renderFormattedText = (text: string) => {
    // 內部輔助函式：清理所有 Markdown 符號 (加強版)
    // 使用正則表達式全局替換：井字號、星號
    const cleanText = (t: string) => {
      if (!t) return '';
      return t.replace(/[#*]/g, '').trim();
    };

    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-2" />;

      // 1. 處理標題 - 只要開頭有 # 就視為標題並徹底清除符號
      if (trimmedLine.startsWith('#')) {
        return (
          <h3 key={i} className="text-[15px] font-bold text-[#D4A5A5] mt-5 mb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#D4A5A5] rounded-full opacity-50"></span>
            {cleanText(trimmedLine)}
          </h3>
        );
      }

      // 2. 處理列表 - 兼容多種符號
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('•')) {
        return (
          <div key={i} className="flex gap-2 ml-1 my-1.5 items-start text-gray-700">
            <span className="text-[#D4A5A5] mt-1.5 text-[5px]">●</span>
            <div className="flex-1 text-[13px]">{cleanText(trimmedLine)}</div>
          </div>
        );
      }

      // 3. 一般文本
      return (
        <div key={i} className="leading-relaxed mb-1.5 text-gray-700 text-[13px]">
          {cleanText(line)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-dotted-grid relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6 pt-10 sticky top-0 bg-[#FAF3E0] z-[30] shadow-sm">
        <button
          onClick={() => setShowHistory(true)}
          className="flex flex-col items-center gap-1.5 group transition-all active:scale-90"
        >
          <div className="p-2.5 rounded-2xl bg-[#7E593E]/10 text-[#7E593E] group-hover:bg-[#7E593E] group-hover:text-[#FAF3E0] transition-all shadow-sm">
            <span className="material-symbols-outlined text-2xl">history</span>
          </div>
          <span className="text-[10px] font-black text-[#A07855] tracking-widest uppercase">紀錄</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#7E593E] rounded-2xl flex items-center justify-center shadow-lg rotate-3">
              <span className="text-3xl">🍪</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-[#3E2723] tracking-tighter">{t.title}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-[#69C181] rounded-full animate-pulse shadow-[0_0_8px_#69C181]"></span>
                <span className="text-[11px] font-black text-[#A07855] tracking-widest leading-none">溫柔守護中</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex flex-col items-center gap-1.5 group transition-all active:scale-90"
        >
          <div className="p-2.5 rounded-2xl bg-[#7E593E]/10 text-[#7E593E] group-hover:bg-[#7E593E] group-hover:text-[#FAF3E0] transition-all shadow-sm border border-[#7E593E]/20">
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </div>
          <span className="text-[10px] font-black text-[#A07855] tracking-widest uppercase">新對話</span>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {(!messages || messages.length === 0) && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-in fade-in duration-1000">
            <div className="relative mb-12 flex items-center justify-center opacity-40">
              <span className="text-6xl select-none animate-bounce">🐾</span>
            </div>

            <p className="text-[#A07855] font-black text-lg mb-12 tracking-wide leading-relaxed">
              「哈囉！！我是小達，<br />今天有什麼想聊聊的嗎？🧸」
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mb-8">
              {currentSuggestions.slice(0, 3).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(handleSend, 50);
                  }}
                  className="px-6 py-5 bg-[#FAF3E0] border-2 border-[#7E593E]/10 rounded-[28px] text-[13px] text-[#3E2723] font-black hover:bg-[#7E593E]/5 transition-all shadow-sm active:scale-95 text-center leading-snug"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 px-6 rounded-[30px] shadow-sm text-[13px] leading-relaxed relative font-medium ${m.role === 'user'
                ? 'bg-[#7E593E] text-[#FFF9F5] rounded-tr-none'
                : 'bg-white text-[#3E2723] rounded-tl-none border border-[#7E593E]/5'
                }`}>
                {renderFormattedText(m.content || '')}
              </div>
              <p className="text-[10px] mt-2 text-[#A07855] font-black px-1 opacity-60 uppercase tracking-widest">
                {m.timestamp && !isNaN(Number(m.timestamp))
                  ? new Date(m.timestamp).toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true })
                  : '剛剛'}
              </p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-white p-5 px-8 rounded-[30px] rounded-tl-none shadow-sm border border-[#7E593E]/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#A07855] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#A07855] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#A07855] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-24 left-0 right-0 p-5 z-[30] pointer-events-none">
        <div className="max-w-md mx-auto relative flex items-center bg-white rounded-[35px] shadow-2xl border border-[#7E593E]/10 p-2.5 pointer-events-auto overflow-hidden">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="溫柔提問..."
            className="flex-1 bg-transparent border-none rounded-full py-4 pl-6 pr-14 text-sm focus:ring-0 placeholder-[#A07855]/40 font-black text-[#3E2723]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2.5 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${input.trim()
              ? 'bg-[#7E593E] text-[#FAF3E0] hover:scale-105'
              : 'bg-gray-50 text-gray-200 opacity-50'
              }`}
          >
            <span className="material-symbols-outlined text-2xl font-black">send</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-[#3E2723]/60 backdrop-blur-[4px] animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setShowHistory(false)}
          />

          {/* Bottom Sheet History */}
          <div className="fixed bottom-0 left-0 right-0 z-[110] bg-[#FAF3E0] rounded-t-[45px] shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[85vh] pointer-events-auto">
            <header className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-[#FAF3E0] rounded-t-[45px] z-10">
              <div className="w-12 h-1.5 bg-[#7E593E]/20 rounded-full absolute top-4 left-1/2 -translate-x-1/2" />
              <h2 className="font-black text-[#3E2723] text-xl pl-2">聊天歷史紀錄</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-3 text-[#A07855] hover:text-[#7E593E] transition-colors bg-white rounded-full shadow-sm"
              >
                <span className="material-symbols-outlined text-2xl font-bold">close</span>
              </button>
            </header>

            <div className="flex-1 p-8 pt-2 space-y-5 overflow-y-auto no-scrollbar pb-12">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center">
                  <span className="material-symbols-outlined text-7xl mb-4">cookie</span>
                  <p className="text-base font-black">還沒有餅乾紀錄</p>
                </div>
              ) : (
                sessions.map(s => (
                  <div
                    key={s.id}
                    className="relative group"
                  >
                    <div
                      onClick={() => { onSelectChat(s.id); setShowHistory(false); }}
                      className={`p-6 bg-white rounded-[32px] border-2 transition-all cursor-pointer flex items-center gap-5 shadow-sm hover:shadow-md active:scale-[0.98] ${chatId === s.id ? 'border-[#7E593E]' : 'border-transparent'}`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF3E0] flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[#7E593E] text-3xl">chat_bubble</span>
                      </div>
                      <div className="flex-1 min-w-0 pr-12 text-left">
                        <p className="text-lg font-black text-[#3E2723] truncate leading-tight">{s.lastMessage}</p>
                        <p className="text-xs text-[#A07855] font-bold mt-1.5 uppercase tracking-widest opacity-60">
                          {s.timestamp && !isNaN(s.timestamp)
                            ? `${new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} ${new Date(s.timestamp).toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                            : '剛剛'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const myId = s.id;
                        if (window.confirm('確定要刪除這條記錄嗎？')) {
                          try {
                            await deleteChatSession(user.uid, myId, onSyncStatus);
                            if (chatId === myId) handleNewChat();
                            const history = await getChatHistory(user.uid);
                            setSessions(mapHistoryToSessions(history));
                          } catch (err) {
                            console.error(err);
                            alert('刪除失敗，這可能是因為資料庫設定（例如 Supabase 外鍵未開啟 Cascade 刪除）或權限不足。');
                          }
                        }
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center text-[#A07855] hover:text-red-500 hover:bg-red-50 transition-all shrink-0 bg-[#FAF3E0] rounded-full z-[120] shadow-md border border-[#7E593E]/10 pointer-events-auto"
                    >
                      <span className="material-symbols-outlined text-2xl font-black">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChat;
