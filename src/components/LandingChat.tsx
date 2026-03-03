import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateTravelResponse } from '../services/gemini';

export const LandingChat = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, links?: {title: string, uri: string}[]}[]>([
    { role: 'assistant', content: 'Привет! 👋 Я твой **ИИ-помощник по турам**. \n\nРаботаю с базой **sletat.ru**. Куда хочешь махнуть? ✈️\n\n*(Демо: цены примерные, ссылок нет)*' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState(200000);
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
      const enhancedMessage = `
        Ты - профессиональный ИИ-турагент (база sletat.ru). 
        Оформляй ответы КРАСИВО и структурировано:
        - Используй жирный шрифт для названий отелей и цен.
        - Используй списки для перечисления преимуществ.
        - Добавляй подходящие эмодзи.
        - Пиши живым, человечным языком, но профессионально.
        - В конце всегда напоминай про демо-режим, примерные цены и отсутствие ссылок.

        ВАЖНО: Если турист в своем сообщении явно указывает новые параметры (например, "смени бюджет на 100к" или "хочу в Турцию"), ПРИОРИТЕТИЗИРУЙ это над текущими фильтрами из контекста. Подтверждай, что ты учел новые пожелания.

        [Бюджет: до ${budget} руб] 
        Вопрос туриста: ${userMessage}
      `;
      const reply = await generateTravelResponse(enhancedMessage);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: reply
      }]);
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
            Online • Gemini 1.5 Flash
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 text-[10px] text-amber-700 text-center italic">
        Демонстрация ИИ-чата. Данные о вылетах и ценах не являются актуальными.
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className={`font-bold ${msg.role === 'user' ? 'text-white underline' : 'text-blue-600'}`} {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              {msg.links && msg.links.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {msg.links.map((link, lIdx) => (
                    <a 
                      key={lIdx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-white text-blue-600 px-2 py-1 rounded-full border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      🔗 {link.title}
                    </a>
                  ))}
                </div>
              )}
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
      <div className="p-4 bg-white border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">Бюджет: {budget/1000}к</span>
          <input 
            type="range" min="30000" max="1000000" step="10000"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
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
             <Sparkles size={10} /> Powered by Gemini 1.5 Flash
           </span>
        </div>
      </div>
    </div>
  );
};
