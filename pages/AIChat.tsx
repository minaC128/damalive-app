
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, ChatSession } from '../types';
import { getXiaoDaResponse } from '../services/geminiService';
import { saveChat, getAllData } from '../services/storageService';


const AIChat: React.FC<{
  user: UserProfile,
  chatId: string | null,
  onSelectChat: (id: string) => void,
  onClearChatId: () => void,
  onSyncStatus: any
}> = ({ user, chatId, onSelectChat, onClearChatId, onSyncStatus }) => {
  const [session, setSession] = useState<ChatSession>({
    id: Date.now().toString(),
    title: '新對話',
    timestamp: new Date().toLocaleTimeString(),
    messages: []
  });
  const [historyList, setHistoryList] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始化載入歷史紀錄與當前對話
  useEffect(() => {
    const loadData = async () => {
      const data = await getAllData(user.uid);
      setHistoryList(data.history);

      if (chatId) {
        const found = data.history.find((h: ChatSession) => h.id === chatId);
        if (found) {
          setSession(found);
          return;
        }
      }

      // 如果沒有選中的 chatId，預設載入最新一筆或保持新對話狀態
      if (data.history && data.history.length > 0 && !chatId) {
        const latest = data.history[0];
        setSession(latest);
        onSelectChat(latest.id);
      } else if (!chatId) {
        setSession({
          id: Date.now().toString(),
          title: '新對話',
          timestamp: new Date().toLocaleTimeString(),
          messages: []
        });
      }
    };
    loadData();
  }, [chatId, user.uid]);

  // 當訊息更新時儲存對話，並同步更新歷史紀錄清單
  useEffect(() => {
    const syncSave = async () => {
      if (session.messages.length > 0) {
        await saveChat(user.uid, session, onSyncStatus);
        // 即時刷新歷史紀錄清單，讓「諮詢紀錄」隨時保持最新
        const data = await getAllData(user.uid);
        setHistoryList(data.history);
      }
    };
    syncSave();

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session.messages, user.uid]);

  const handleCreateNewChat = () => {
    const newId = Date.now().toString();
    setSession({
      id: newId,
      title: '新對話',
      timestamp: new Date().toLocaleTimeString(),
      messages: []
    });
    setInput('');
    onClearChatId();
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    setInput('');



    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 如果是第一則訊息，自動更新標題以便在紀錄清單中辨識
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      title: prev.messages.length === 0 ? (currentInput.length > 15 ? currentInput.slice(0, 15) + '...' : currentInput) : prev.title
    }));

    setLoading(true);

    const history = session.messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const { text, isEmergency } = await getXiaoDaResponse(currentInput, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: text || "小達正在努力思考中...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency
    };

    setSession(prev => ({ ...prev, messages: [...prev.messages, modelMsg] }));
    setLoading(false);
  };

  // 渲染格式化文字 (粗體與換行)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-80px)] bg-[#FAF7F2] animate-in slide-in-from-right duration-300 relative"
      style={{
        backgroundImage: 'radial-gradient(#F2CECE 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* 頂部標題列 */}
      <div className="p-4 bg-white border-b border-dama-sakura/10 flex items-center justify-between z-10 shadow-sm">
        <button
          onClick={() => setShowHistory(true)}
          className="flex flex-col items-center justify-center active:scale-90 transition-transform"
        >
          <div className="text-dama-sakura/40">
            <span className="material-symbols-outlined text-2xl">history</span>
          </div>
          <span className="text-[8px] font-bold text-dama-sakura/60">紀錄</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-dama-sakura flex items-center justify-center text-white shadow-sm ring-1 ring-dama-sakura/20">
            <span className="material-symbols-outlined text-2xl">pets</span>
          </div>
          <div className="text-left">
            <h2 className="font-bold text-dama-brown text-sm">小達 AI 護理顧問</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-dama-matcha rounded-full animate-pulse"></span>
              <p className="text-[8px] text-dama-matcha font-bold uppercase tracking-wider">溫柔守護中</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateNewChat}
          className="flex flex-col items-center justify-center active:scale-90 transition-transform"
        >
          <div className="text-dama-matcha/40">
            <span className="material-symbols-outlined text-2xl">add_box</span>
          </div>
          <span className="text-[8px] font-bold text-dama-matcha/60">新對話</span>
        </button>
      </div>

      {/* 聊天內容區 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {session.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-10 animate-in fade-in duration-700">
            <div className="mb-8 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-dama-brown/10 rotate-12 -ml-4">pets</span>
              <span className="material-symbols-outlined text-4xl text-dama-brown/10 -rotate-12 mt-4 ml-2">pets</span>
            </div>
            <p className="text-sm font-bold text-dama-brown/40 leading-relaxed mb-8">
              「哈囉！我是小達，<br />今天有什麼想聊聊的嗎？🧸」
            </p>
            <div className="flex flex-col gap-3 w-full max-w-[200px] mx-auto">
              {['懷孕初期飲食', '什麼是葉酸？', '最近很焦慮'].map(t => (
                <button
                  key={t}
                  onClick={() => setInput(t)}
                  className="text-[10px] px-4 py-2 rounded-full border border-dama-sakura/10 bg-white/60 text-dama-brown/50 hover:bg-dama-sakura/10 hover:text-dama-sakura transition-all font-bold shadow-sm active:scale-95"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {session.messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] px-5 py-3.5 rounded-2xl shadow-sm text-[13px] leading-relaxed ${m.role === 'user'
                ? 'bg-[#f5d8c6] text-dama-brown rounded-tr-sm'
                : m.isEmergency
                  ? 'bg-red-50 border-2 border-red-200 text-red-800 rounded-tl-sm'
                  : 'bg-white border border-dama-sakura/10 text-dama-brown/90 rounded-tl-sm shadow-md'
              }`}>
              <div className="whitespace-pre-wrap">
                {renderFormattedText(m.text)}
              </div>
              <div className={`text-[8px] mt-2 opacity-50 font-bold flex items-center gap-1 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-[10px] text-dama-brown/30 font-bold ml-2 animate-in fade-in">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-dama-sakura rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-dama-sakura rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-dama-sakura rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* 輸入區域 */}
      <div className="p-6 bg-transparent">
        <div className="flex gap-3 items-center bg-white/95 backdrop-blur-sm rounded-full p-2 pl-6 shadow-xl border border-dama-sakura/10">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="溫柔提問..."
            className="flex-1 bg-transparent border-none py-2 text-sm focus:ring-0 placeholder:text-dama-brown/20 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${!input.trim() || loading
                ? 'bg-dama-brown/5 text-dama-brown/20'
                : 'bg-dama-sakura text-white'
              }`}
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>

      {/* 諮詢紀錄對話框 */}
      {showHistory && (
        <div className="absolute inset-0 z-[60] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-dama-brown/40 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl p-8 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-400 no-scrollbar">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 z-10">
              <h3 className="font-bold text-dama-brown text-lg">諮詢紀錄</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 rounded-full bg-dama-bg flex items-center justify-center text-dama-brown/40 hover:bg-dama-sakura/10 hover:text-dama-sakura transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3 pb-4">
              {historyList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                  <span className="material-symbols-outlined text-5xl mb-3">chat_bubble_outline</span>
                  <p className="text-sm font-bold italic tracking-wider">尚無歷史對話</p>
                </div>
              ) : (
                historyList.map((h: ChatSession) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      onSelectChat(h.id);
                      setShowHistory(false);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex justify-between items-center group ${chatId === h.id ? 'bg-dama-sakura/10 border-dama-sakura shadow-sm' : 'bg-dama-bg border-transparent hover:border-dama-sakura/30'
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${chatId === h.id ? 'text-dama-sakura' : 'text-dama-brown'}`}>
                        {h.title || '新對話'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-dama-brown/30 font-bold uppercase tracking-tight">{h.timestamp}</span>
                        <span className="text-[10px] text-dama-brown/20">•</span>
                        <span className="text-[10px] text-dama-brown/30 font-bold">{h.messages.length} 則訊息</span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity ${chatId === h.id ? 'text-dama-sakura opacity-100' : 'text-dama-brown/20'}`}>
                      arrow_forward_ios
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* 快速開始新對話按鈕 */}
            <button
              onClick={handleCreateNewChat}
              className="w-full mt-4 py-4 rounded-3xl border-2 border-dashed border-dama-sakura/30 text-dama-sakura font-bold text-xs flex items-center justify-center gap-2 hover:bg-dama-sakura/5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              開始新的諮詢
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
