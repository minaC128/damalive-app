
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
      <header className="p-4 px-6 border-b border-gray-50/50 relative z-[30] bg-[#FAF7F5] flex items-center justify-between">
        <button
          onClick={() => setShowHistory(true)}
          className="flex flex-col items-center gap-1 text-[#D4A5A5] hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>history</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider">紀錄</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFBACA] rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-2xl">pets</span>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="font-bold text-[#5C4D4D] text-lg leading-tight">{t.title}</h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#69C181] rounded-full"></span>
                <span className="text-[#69C181] text-[10px] font-bold">溫柔守護中</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex flex-col items-center gap-1 text-[#69C181] hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 flex items-center justify-center border border-[#69C181] rounded-sm">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>add</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider">新對話</span>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {(!messages || messages.length === 0) && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-in fade-in duration-1000">
            <div className="relative mb-12 flex items-center justify-center grayscale opacity-20">
              <span className="text-6xl select-none animate-bounce">🐾</span>
            </div>

            <p className="text-[#A5928E] font-semibold text-lg mb-12 tracking-wide leading-relaxed">
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
                  className="px-6 py-4 bg-[#FEF9F6] border border-[#F5CBA7]/20 rounded-[22px] text-[13px] text-[#5C4D4D] font-bold hover:bg-[#FAD4C0] transition-all shadow-sm active:scale-95 text-center"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 px-5 rounded-[22px] shadow-sm text-[13px] leading-relaxed relative ${m.role === 'user'
                ? 'bg-[#FDE3D2] text-gray-700 rounded-tr-none'
                : 'bg-white text-gray-700 rounded-tl-none border border-white'
                }`}>
                {renderFormattedText(m.content || '')}
              </div>
              <p className="text-[10px] mt-1.5 text-gray-400 font-medium px-1">
                {m.timestamp && !isNaN(Number(m.timestamp))
                  ? new Date(m.timestamp).toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true })
                  : '剛剛'}
              </p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-white p-4 px-6 rounded-[24px] rounded-tl-none shadow-sm border border-white">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#FFBACA] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#FFBACA] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#FFBACA] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-24 left-0 right-0 p-4 z-20 pointer-events-none">
        <div className="max-w-md mx-auto relative flex items-center bg-[#F9F6F4] rounded-full shadow-lg border border-white/50 p-1 pointer-events-auto overflow-hidden">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="溫柔提問..."
            className="flex-1 bg-transparent border-none rounded-full py-4 pl-6 pr-14 text-sm focus:ring-0 placeholder-gray-300 font-medium text-[#5C4D4D]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white shadow-sm active:scale-95 ${input.trim()
              ? 'text-gray-400'
              : 'text-gray-200 opacity-50'
              }`}
          >
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setShowHistory(false)}
          />

          {/* Bottom Sheet History */}
          <div className="fixed bottom-0 left-0 right-0 z-[110] bg-[#faf7f5] rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[75vh] pointer-events-auto">
            <header className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-[#faf7f5] rounded-t-[40px] z-10">
              <div className="w-10 h-1 bg-gray-200 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
              <h2 className="font-bold text-[#5c4d4d] text-lg pl-2">聊天歷史紀錄</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full shadow-sm"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </header>

            <div className="flex-1 p-6 pt-2 space-y-4 overflow-y-auto no-scrollbar pb-10">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                  <span className="material-symbols-outlined text-6xl mb-4">chat_bubble</span>
                  <p className="text-sm font-bold">還沒有對話紀錄</p>
                </div>
              ) : (
                sessions.map(s => (
                  <div
                    key={s.id}
                    className="relative group"
                  >
                    {/* Clickable session row */}
                    <div
                      onClick={() => { onSelectChat(s.id); setShowHistory(false); }}
                      className={`p-5 bg-white rounded-[28px] border transition-all cursor-pointer flex items-center gap-4 shadow-sm hover:shadow-md active:scale-[0.98] ${chatId === s.id ? 'border-[#FFBACA]' : 'border-transparent'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#fdf2f2] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#FFBACA] text-2xl">chat_bubble</span>
                      </div>
                      <div className="flex-1 min-w-0 pr-14 text-left">
                        <p className="text-base font-bold text-[#5c4d4d] truncate">{s.lastMessage}</p>
                        <p className="text-xs text-gray-300 font-medium mt-1 uppercase tracking-tight">
                          {s.timestamp && !isNaN(s.timestamp)
                            ? `${new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} ${new Date(s.timestamp).toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                            : '剛剛'}
                        </p>
                      </div>
                    </div>

                    {/* Delete button - completely isolated from the clickable row */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const myId = s.id;
                        if (!window.confirm('確定要刪除這條記錄嗎？')) return;
                        try {
                          await deleteChatSession(user.uid, myId, onSyncStatus);
                          // Optimistically remove from UI immediately
                          setSessions(prev => prev.filter(x => x.id !== myId));
                          if (chatId === myId) handleNewChat();
                        } catch (err: any) {
                          console.error('[DeleteSession] Error:', JSON.stringify(err));
                          const msg = err?.message || err?.details || JSON.stringify(err);
                          alert(`刪除失敗: ${msg}\n\n請檢查 Supabase 的 RLS 政策是否允許 DELETE，或外鍵是否設定 ON DELETE CASCADE。`);
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-gray-400 hover:text-red-500 transition-colors shrink-0 bg-white rounded-full z-[120] shadow-sm pointer-events-auto border border-gray-100"
                      aria-label="刪除對話"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
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


