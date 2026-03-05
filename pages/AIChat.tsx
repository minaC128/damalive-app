
import React, { useState, useEffect, useRef } from 'react';
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

  // Helper function to map history to sorted sessions
  const mapHistoryToSessions = (history: Record<string, ChatMessage[]>) => {
    return Object.entries(history)
      .map(([id, msgs]: [string, any]) => {
        const lastMsg = msgs[msgs.length - 1];
        // Ensure timestamp is a valid number
        const ts = lastMsg?.timestamp ? Number(lastMsg.timestamp) : 0;
        return {
          id,
          lastMessage: lastMsg?.content || 'Empty Chat',
          timestamp: isNaN(ts) ? 0 : ts
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  useEffect(() => {
    const loadSessions = async () => {
      const history = await getChatHistory(user.uid);
      setSessions(mapHistoryToSessions(history));

      if (chatId && history[chatId]) {
        setMessages(history[chatId]);
      } else if (!chatId) {
        setMessages([]);
      }
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
    }
  };

  const handleNewChat = () => {
    onClearChatId();
    setMessages([]);
    setShowHistory(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(tc.delete + '?')) {
      await deleteChatSession(user.uid, id, onSyncStatus);
      if (chatId === id) handleNewChat();
      const history = await getChatHistory(user.uid);
      setSessions(mapHistoryToSessions(history));
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|- .*?\n)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-dama-sakura block my-1">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-dama-brown/80 my-1">{part.slice(2)}</li>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-dotted-grid relative overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-white flex justify-between items-center border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <button
          onClick={() => setShowHistory(true)}
          className="flex flex-col items-center gap-0.5 text-[#D4A5A5] hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-2xl">history</span>
          <span className="text-[10px] font-bold">紀錄</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFB7B7] rounded-full flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-xl">pets</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-gray-700 text-lg leading-tight">小達 AI 護理顧問</h1>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#69C181] rounded-full"></span>
                <span className="text-[#69C181] text-[10px] font-bold">溫柔守護中</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex flex-col items-center gap-0.5 text-[#69C181] hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-2xl">add_box</span>
          <span className="text-[10px] font-bold">新對話</span>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
            <span className="material-symbols-outlined text-7xl mb-4 text-dama-sakura">chat_bubble</span>
            <p className="text-base font-bold text-dama-brown">{t.welcome}</p>
            <p className="text-xs mt-2 leading-relaxed">{t.suggestion}</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] p-4 px-6 rounded-[24px] shadow-sm text-[15px] leading-relaxed relative ${m.role === 'user'
                ? 'bg-[#FDE3D2] text-gray-700 rounded-tr-none'
                : 'bg-white text-gray-700 rounded-tl-none border border-white shadow-md'
                }`}>
                {renderFormattedText(m.content)}
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
            <div className="bg-white p-4 px-6 rounded-[24px] rounded-tl-none shadow-md border border-white">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#FFB7B7] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#FFB7B7] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#FFB7B7] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-24 left-0 right-0 p-4 z-20 pointer-events-none">
        <div className="max-w-md mx-auto relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-1 pointer-events-auto overflow-hidden">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="溫柔提問..."
            className="flex-1 bg-transparent border-none rounded-full py-4 pl-6 pr-14 text-sm focus:ring-0 placeholder-gray-300 font-medium text-gray-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${input.trim()
              ? 'bg-[#F0F2F5] text-gray-400'
              : 'bg-gray-50 text-gray-200'
              }`}
          >
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="absolute inset-0 z-50 bg-[#faf7f5] animate-in slide-in-from-left duration-300 flex flex-col">
          <header className="p-4 bg-white flex items-center border-b border-gray-100 shadow-sm sticky top-0">
            <button onClick={() => setShowHistory(false)} className="p-2 text-gray-600 hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </button>
            <h2 className="flex-1 text-center font-bold text-[#5c4d4d] text-lg mr-10">聊天歷史紀錄</h2>
          </header>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar pb-32">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                <span className="material-symbols-outlined text-6xl mb-4">chat_bubble</span>
                <p className="text-sm font-bold">還沒有對話紀錄</p>
              </div>
            ) : (
              sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => { onSelectChat(s.id); setShowHistory(false); }}
                  className={`p-6 bg-white rounded-[32px] border transition-all cursor-pointer flex items-center gap-5 relative group shadow-sm hover:shadow-md ${chatId === s.id ? 'border-[#FFB7C5]' : 'border-transparent'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-[#fdf2f2] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#FFB7B7] text-3xl">chat_bubble</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-[#5c4d4d] truncate pr-4">{s.lastMessage}</p>
                    <p className="text-sm text-gray-300 font-medium mt-1 uppercase">
                      {s.timestamp && !isNaN(s.timestamp)
                        ? `${new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} ${new Date(s.timestamp).toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                        : '剛剛'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, s.id)}
                    className="p-2 text-gray-200 hover:text-red-400 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-2xl">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
