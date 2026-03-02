
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { getChatHistory, saveChatMessage, deleteChatSession } from '../services/storageService';
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

  useEffect(() => {
    const loadSessions = async () => {
      const history = await getChatHistory(user.uid);
      const sorted = Object.entries(history).map(([id, msgs]: [string, any]) => ({
        id,
        lastMessage: msgs[msgs.length - 1]?.content || 'Empty Chat',
        timestamp: msgs[msgs.length - 1]?.timestamp || 0
      })).sort((a, b) => b.timestamp - a.timestamp);
      setSessions(sorted);

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
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext: {
            name: user.name,
            stage: user.isPostpartum ? 'postpartum' : 'pregnancy',
            language: lang
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const data = await response.json();
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: Date.now()
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveChatMessage(user.uid, currentChatId, finalMessages, onSyncStatus);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t.error,
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
      setSessions(Object.entries(history).map(([sid, msgs]: [string, any]) => ({
        id: sid,
        lastMessage: msgs[msgs.length - 1]?.content || 'Empty Chat',
        timestamp: msgs[msgs.length - 1]?.timestamp || 0
      })));
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
    <div className="flex flex-col h-screen bg-dama-bg relative">
      <header className="p-4 bg-white/80 backdrop-blur-md flex justify-between items-center border-b border-dama-sakura/10 sticky top-0 z-10">
        <button onClick={() => setShowHistory(true)} className="p-2 text-dama-sakura hover:bg-dama-sakura/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">history</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-dama-sakura rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-sm">pets</span>
          </div>
          <h2 className="font-bold text-dama-brown">{t.title}</h2>
        </div>
        <button onClick={handleNewChat} className="p-2 text-dama-matcha hover:bg-dama-matcha/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">add_comment</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-center px-10">
            <span className="material-symbols-outlined text-6xl mb-4 text-dama-sakura">chat_bubble</span>
            <p className="text-sm font-bold text-dama-brown">{t.welcome}</p>
            <p className="text-[10px] mt-2 leading-relaxed">{t.suggestion}</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-[28px] shadow-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-dama-sakura text-white rounded-tr-none' : 'bg-white text-dama-brown rounded-tl-none border border-dama-sakura/5'}`}>
                {renderFormattedText(m.content)}
                <p className={`text-[8px] mt-1 opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white p-4 rounded-[28px] rounded-tl-none border border-dama-sakura/5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-dama-sakura/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-dama-sakura/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-dama-sakura/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-dama-sakura/10 pb-28">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full bg-dama-bg border-none rounded-full py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-dama-sakura shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-dama-sakura text-white shadow-md' : 'bg-dama-brown/10 text-dama-brown/20'}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md animate-in slide-in-from-left duration-300">
          <header className="p-4 flex items-center border-b border-dama-sakura/10">
            <button onClick={() => setShowHistory(false)} className="p-2 text-dama-brown">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="flex-1 text-center font-bold text-dama-brown">{t.history}</h2>
            <div className="w-10"></div>
          </header>
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-64px)] pb-32">
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => { onSelectChat(s.id); setShowHistory(false); }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${chatId === s.id ? 'bg-dama-sakura/5 border-dama-sakura/20' : 'bg-white border-dama-sakura/5 hover:border-dama-sakura/20'}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-dama-bg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-dama-sakura text-lg">chat</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-dama-brown truncate">{s.lastMessage}</p>
                  <p className="text-[10px] text-dama-brown/30 mt-0.5">
                    {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button onClick={(e) => handleDeleteSession(e, s.id)} className="p-2 text-dama-brown/20 hover:text-red-400">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
