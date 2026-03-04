import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Zap, Globe, Plus, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateTravelResponse } from '../services/gemini';

const POPULAR_COUNTRIES = ['Турция', 'Египет', 'ОАЭ', 'Тайланд', 'Мальдивы'];
const MEAL_OPTIONS = [
  { id: 'any', label: 'Любое' },
  { id: 'AI', label: 'Все вкл.' },
  { id: 'HB', label: 'Завтрак+Ужин' },
  { id: 'BB', label: 'Завтраки' }
];
const STAR_OPTIONS = [
  { id: 'any', label: 'Любые' },
  { id: '3', label: '3*' },
  { id: '4', label: '4*' },
  { id: '5', label: '5*' }
];

export const LandingChat = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, links?: {title: string, uri: string}[]}[]>([
    { role: 'assistant', content: 'Привет! 👋 Я твой **ИИ-помощник по турам**. \n\nРаботаю с базой **sletat.ru**. Куда хочешь махнуть? ✈️\n\n*(Демо: цены примерные, ссылок нет)*' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState(200000);
  const [nights, setNights] = useState({ min: 6, max: 14 });
  const [destination, setDestination] = useState('');
  const [departureCity, setDepartureCity] = useState('Москва');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [searchType, setSearchType] = useState<'tours' | 'hotels' | 'hot'>('tours');
  const [stars, setStars] = useState('any');
  const [meals, setMeals] = useState('any');
  const [rating, setRating] = useState(4.0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input;
    if (!messageToSend.trim()) return;

    const userMessage = messageToSend;
    if (!overrideMessage) setInput('');
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

        [ТЕКУЩИЕ ПАРАМЕТРЫ ПОИСКА]
        - Тип: ${searchType === 'tours' ? 'Туры с перелетом' : searchType === 'hotels' ? 'Только отели' : 'Горящие туры'}
        - Из города: ${departureCity}
        - Куда: ${destination || 'Не указано'}
        - Бюджет: до ${budget} руб
        - Ночей: от ${nights.min} до ${nights.max}
        - Состав: ${adults} взр + ${kids} дет
        - Звезды: ${stars === 'any' ? 'Любые' : stars + '*'}
        - Питание: ${meals === 'any' ? 'Любое' : meals}
        - Мин. рейтинг: ${rating}

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
    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-200 overflow-hidden flex flex-col h-[650px] w-full max-w-lg mx-auto transform hover:scale-[1.01] transition-all duration-500">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white relative shadow-lg shadow-blue-600/20 rotate-3">
            <Sparkles size={24} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <div className="font-black text-white text-lg tracking-tight">AITravel <span className="text-blue-500">Concierge</span></div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Система активна • v2.4
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
           <div className="text-[10px] text-white/40 font-black uppercase tracking-tighter">Powered by</div>
           <div className="text-xs text-white/80 font-bold flex items-center gap-1">
              Gemini 1.5 <Zap size={10} className="text-blue-400 fill-blue-400" />
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
              {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
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
              <Sparkles size={14} />
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
      <div className="p-6 bg-white border-t border-slate-100 space-y-4">
        {/* Search Bar Style Filters */}
        <div className="bg-slate-900 p-4 rounded-[1.5rem] space-y-3 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-colors"></div>
          
          <div className="flex items-center justify-between text-[10px] text-white/60 font-black uppercase tracking-widest px-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">откуда</span>
              <select 
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="bg-transparent border-none text-white font-black outline-none cursor-pointer hover:text-blue-400 transition-colors"
              >
                <option value="Москва" className="text-slate-900">Москва</option>
                <option value="Екатеринбург" className="text-slate-900">Екатеринбург</option>
                <option value="СПб" className="text-slate-900">СПб</option>
                <option value="Казань" className="text-slate-900">Казань</option>
              </select>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <input type="radio" name="st" checked={searchType === 'tours'} onChange={() => setSearchType('tours')} className="w-2.5 h-2.5 accent-blue-500" />
                <span>Туры</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <input type="radio" name="st" checked={searchType === 'hotels'} onChange={() => setSearchType('hotels')} className="w-2.5 h-2.5 accent-blue-500" />
                <span>Отели</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <input type="radio" name="st" checked={searchType === 'hot'} onChange={() => setSearchType('hot')} className="w-2.5 h-2.5 accent-blue-500" />
                <span>Горящие</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 flex items-center gap-3 shadow-sm transition-all relative z-10">
              <div className="text-blue-500">
                 <Globe size={14} />
              </div>
              <input 
                type="text" 
                placeholder="Куда летим? (Страна, город, отель)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 bg-transparent text-xs font-bold outline-none text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {POPULAR_COUNTRIES.map(country => (
                <button
                  key={country}
                  onClick={() => setDestination(country)}
                  className={`text-[9px] px-2 py-1 rounded-lg font-black transition-all ${
                    destination === country 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col justify-center">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter mb-0.5">Ночей</span>
              <div className="flex items-center gap-1">
                <input 
                  type="number" value={nights.min} 
                  onChange={(e) => setNights({...nights, min: parseInt(e.target.value)})}
                  className="bg-transparent w-full text-[10px] font-black text-white outline-none"
                />
                <span className="text-slate-700">-</span>
                <input 
                  type="number" value={nights.max} 
                  onChange={(e) => setNights({...nights, max: parseInt(e.target.value)})}
                  className="bg-transparent w-full text-[10px] font-black text-white outline-none"
                />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col justify-center">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter mb-1">Туристы</span>
              <div className="flex items-center justify-between gap-1 text-[10px] font-black text-white">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-4 h-4 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"><Minus size={10} /></button>
                  <span className="w-2 text-center">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="w-4 h-4 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"><Plus size={10} /></button>
                  <span className="text-[8px] text-slate-500">взр</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setKids(Math.max(0, kids - 1))} className="w-4 h-4 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"><Minus size={10} /></button>
                  <span className="w-2 text-center">{kids}</span>
                  <button onClick={() => setKids(kids + 1)} className="w-4 h-4 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"><Plus size={10} /></button>
                  <span className="text-[8px] text-slate-500">дет</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleSend(`Найди туры: ${searchType === 'tours' ? 'с перелетом' : searchType === 'hotels' ? 'отели' : 'горящие'}, из ${departureCity} в ${destination || 'любое место'}, на ${nights.min}-${nights.max} ночей, ${adults} взр + ${kids} дет.`)}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Поиск
            </button>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap gap-1.5">
              {STAR_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setStars(opt.id)}
                  className={`flex-1 text-[9px] py-1.5 rounded-lg font-black transition-all border ${
                    stars === opt.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MEAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMeals(opt.id)}
                  className={`flex-1 text-[9px] py-1.5 rounded-lg font-black transition-all border ${
                    meals === opt.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси что угодно про отдых..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 opacity-40">
           <div className="h-px bg-slate-300 flex-1"></div>
           <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] whitespace-nowrap">
              AITravel Intelligence System
           </span>
           <div className="h-px bg-slate-300 flex-1"></div>
        </div>
      </div>
    </div>
  );
};
