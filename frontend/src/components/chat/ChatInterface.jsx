import { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ChatInterface() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: t('data.chat_msg_1', "Hello. I have analyzed your assessment results, skill gaps, and current trajectory. I am ready to guide you. What specific question do you have about your path?"),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.id !== 1).map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/api/chat/process', { message: text, history });
      if (res.data.success) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: res.data.data.response }]);
      } else throw new Error();
    } catch {
      toast.error(t('auth.err_general', 'System error. Please retry.'));
    } finally { 
      setIsTyping(false); 
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' ? (
              // AI: Prose-style with left accent border (NO bubble)
              <div className="max-w-3xl border-l-2 border-violet-500/50 pl-5 py-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-2">{t('chat.sys_resp', 'System Response')}</span>
                <p className="text-zinc-100 text-[15px] leading-relaxed whitespace-pre-wrap font-body">
                  {msg.content}
                </p>
              </div>
            ) : (
              // User: Compact pill alignment right
              <div className="max-w-[80%] bg-zinc-800/80 px-4 py-3 rounded-2xl rounded-tr-sm border border-zinc-700/50">
                <p className="text-zinc-300 text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="max-w-3xl border-l-2 border-violet-500/50 pl-5 py-1 animate-pulse">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-2">{t('chat.processing', 'Processing')}</span>
            <div className="w-1.5 h-4 bg-violet-400 mt-1" /> {/* Blinking cursor substitute */}
          </div>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {/* Command prompt style input at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="max-w-3xl mx-auto flex items-end gap-2 bg-zinc-900 border border-zinc-700 focus-within:border-violet-500/50 rounded-xl overflow-hidden transition-colors shadow-2xl">
          <div className="flex items-center justify-center w-10 shrink-0 text-violet-500 font-display font-medium text-lg pb-3">
            &gt;
          </div>
          <textarea
            value={input}
            rows={1}
            disabled={isTyping}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isTyping ? t('chat.processing_placeholder', "Processing...") : t('chat.init_query', "Initialize query...")}
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 px-0 py-3.5 outline-none resize-none text-sm font-body leading-relaxed max-h-[120px] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-[52px] flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:bg-zinc-800/50 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
