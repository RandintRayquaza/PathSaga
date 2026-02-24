import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, Loader2, StopCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

export default function ChatInterface() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, content: t('chat.welcome_msg'), role: 'assistant' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newMsg = { id: Date.now(), content: userMessage, role: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Calls the real backend route connected to llmService
      const response = await api.post('/api/voice/process', {
        speechText: userMessage,
      });

      if (response.data.success) {
        // The backend returns the text in llmResponse under the data object
        const reply = response.data.data.llmResponse;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, content: reply, role: 'assistant' },
        ]);
      } else {
        throw new Error('Chat API returned failure status');
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback error message for the user so ui doesn't freeze
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: t('chat.error_msg', { defaultValue: 'Sorry, I encountered an error connecting to my server. Please try again later.' }),
          role: 'assistant',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would initialize Web Speech API or MediaRecorder
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[600px] bg-ink-900 border border-ink-800 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-ink-800 bg-ink-950/50 backdrop-blur-md">
        <div className="w-10 h-10 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
          <Bot className="w-5 h-5 text-lime-400" />
        </div>
        <div>
          <h2 className="font-display text-lg text-ink-50">{t('chat.coach_name')}</h2>
          <p className="text-xs text-lime-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></span>
            {t('chat.online')}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ink-950/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' 
                ? 'bg-ink-800 border border-ink-700' 
                : 'bg-lime-400/10 border border-lime-400/20'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-ink-300" />
              ) : (
                <Bot className="w-4 h-4 text-lime-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
              msg.role === 'user'
                ? 'bg-ink-800 border border-ink-700 text-ink-100 rounded-tr-none'
                : 'bg-ink-900 border border-ink-800 text-ink-200 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-lime-400" />
            </div>
            <div className="bg-ink-900 border border-ink-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-ink-950/80 border-t border-ink-800 backdrop-blur-md">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          
          <div className="relative flex-1 bg-ink-900 border border-ink-700 rounded-2xl focus-within:border-lime-400/50 focus-within:ring-1 focus-within:ring-lime-400/20 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('chat.placeholder')}
              className="w-full bg-transparent text-ink-100 placeholder-ink-500 text-sm px-4 py-3.5 resize-none outline-none min-h-[52px] max-h-32 overflow-y-auto rounded-2xl"
              rows="1"
            />
          </div>

          <div className="flex shrink-0 gap-2 mb-1">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-ink-800 text-ink-300 hover:text-lime-400 border border-ink-700 hover:border-lime-400/30'
              }`}
              title={isRecording ? t('chat.stop_rec') : t('chat.use_voice')}
            >
              {isRecording ? <StopCircle className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="submit"
              disabled={(!input.trim() && !isRecording) || isTyping}
              className="p-3 bg-lime-400 text-ink-950 rounded-xl hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Glow effect behind chat */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-lime-400/5 blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}
