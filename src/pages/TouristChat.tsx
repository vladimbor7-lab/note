import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const TouristChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! Я ваш персональный ИИ-турагент. Куда планируете полететь? 🌍' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('botSettings');
    if (savedSettings) {
      const { welcomeMessage } = JSON.parse(savedSettings);
      if (welcomeMessage) {
        setMessages([{ role: 'assistant', content: welcomeMessage }]);
      }
    }
    scrollToBottom();
  }, []);

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
      // Get settings
      const savedSettings = localStorage.getItem('botSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      const systemPrompt = settings.systemPrompt || 'Ты - дружелюбный ИИ-турагент. Твоя цель - помочь туристу выбрать тур.';
      const tone = settings.tone || 'friendly';
      const useEmoji = settings.useEmoji !== undefined ? settings.useEmoji : true;

      const prompt = `
        ${systemPrompt}
        
        Настройки тона: ${tone}
        Использовать эмодзи: ${useEmoji ? 'Да' : 'Нет'}

        История диалога:
        ${messages.map(m => `${m.role === 'user' ? 'Турист' : 'Ассистент'}: ${m.content}`).join('\n')}
        Турист: ${userMessage}
        
        Отвечай кратко, по делу.
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt, 
          model: 'gemini' 
        })
      });

      const data = await response.json();
      
      if (data.error) {
         console.warn("API Error, using fallback response:", data.error);
         // Fallback for demo
         setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Я пока работаю в демо-режиме (нет API ключей), но я бы предложил вам отличные варианты! 🌴 Скажите, какой у вас бюджет?' }]);
            setIsLoading(false);
         }, 1000);
         return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, произошла ошибка. Попробуйте еще раз.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="font-bold text-slate-900">ИИ-Турагент</h1>
          <p className="text-xs text-slate-500">Онлайн • Отвечает мгновенно</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-3xl mx-auto w-full space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
