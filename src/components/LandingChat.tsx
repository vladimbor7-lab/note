import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export const LandingChat = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Привет! 👋 Я ваш персональный ИИ-турагент. Куда планируете полететь?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          model: 'gemini' 
        })
      });

      const data = await response.json();
      
      if (data.error) {
        // Fallback for demo if API fails (e.g. no keys)
        console.warn("API Error, using fallback response:", data.error);
        setTimeout(() => {
           setMessages(prev => [...prev, { role: 'assistant', content: 'Я пока работаю в демо-режиме (нет API ключей), но я бы предложил вам отличные варианты в ОАЭ! 🇦🇪 Например, Rixos Premium Saadiyat или Atlantis The Royal. Хотите узнать о них подробнее?' }]);
           setIsLoading(false);
        }, 1000);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Простите, что-то пошло не так. Попробуйте еще раз.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] w-full max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-slate-900 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white relative">
          <Bot size={20} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
        </div>
        <div>
          <div className="font-bold text-white">AIAIAI Assistant</div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Online • Claude 3.5
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Например: Турция в октябре..."
            className="w-full bg-slate-100 border-none rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
             <Sparkles size={10} /> Powered by Claude 3.5 Sonnet
           </span>
        </div>
      </div>
    </div>
  );
};
