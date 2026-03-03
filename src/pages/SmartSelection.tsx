import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Phone, Star, MapPin, ShieldCheck, AlertTriangle, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateTravelResponse } from '../services/gemini';

export const SmartSelection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const psyParam = queryParams.get('psy') || 'emotional';
  const agentParam = queryParams.get('agent') || 'default';
  const audParam = queryParams.get('aud') || 'Семья с детьми';
  const toneParam = queryParams.get('tone') || 'friendly';
  const budgetParam = queryParams.get('budget') || '300000';
  const nightsParam = queryParams.get('nights') || '7';
  const starsParam = queryParams.get('stars') || '5';
  const mealsParam = queryParams.get('meals') || 'AI';
  const destParam = queryParams.get('dest') || 'Турция';
  const adultsParam = queryParams.get('adults') || '2';
  const kidsParam = queryParams.get('kids') || '0';
  const wishParam = queryParams.get('wish') || '';

  const getInitialMessage = (psy: string) => {
    switch(psy) {
      case 'rational': return 'Привет! 👋 Я **Мария**, твой ИИ-аналитик. \n\nПроверила подборку по **sletat.ru**: \n* **Rixos** — лучший по соотношению цена/качество\n* **Alva Donna** — выгоднее на 25%\n\nКакие параметры сравним? 📊';
      case 'luxury': return 'Добрый день. Я ваш **персональный консьерж**. \n\nПодготовила эксклюзивные варианты: \n* **Rixos Premium** — безупречный сервис и статус\n* **Nirvana** — приватность и роскошь\n\nЖелаете обсудить детали трансфера? 🥂';
      case 'family': return 'Здравствуйте! 👋 Я **Мария**, помогу вашей семье. \n\nПосмотрела отели для деток: \n* **Alva Donna** — лучший мини-клуб и питание\n* **Rixos** — аквапарк мечты\n\nРассказать про детское меню? 👨‍👩‍👧‍👦';
      case 'skeptic': return 'Приветствую. Я **Мария**. \n\nОтобрала варианты с самым высоким рейтингом реальных отзывов: \n* **Rixos** — 9.8/10 по чистоте\n* **Alva Donna** — подтвержденное качество питания\n\nПрислать протоколы безопасности? 🧐';
      case 'adventurer': return 'Хей! 👋 Я **Мария**, твой проводник. \n\nНашла места с драйвом: \n* **Nirvana** — рядом лучшие тропы для хайкинга\n* **Rixos** — доступ ко всем активностям Land of Legends\n\nГотов к приключениям? 🧗‍♂️';
      case 'romantic': return 'Привет... Я **Мария**. ✨ \n\nНашла самые красивые закаты для вас: \n* **Rixos** — ужины у самой кромки воды\n* **Nirvana** — полная приватность в лесу\n\nХотите забронировать столик с видом? 🌅';
      case 'business': return 'Добрый день. Я **Мария**, ваш бизнес-ассистент. \n\nВарианты с идеальной логистикой и связью: \n* **Rixos** — лучший конференц-сервис и Wi-Fi 6\n* **Alva Donna** — 15 минут от аэропорта\n\nНужно подготовить документы для отчетности? 💼';
      default: return 'Привет! 👋 Я **Мария**, твой агент. \n\nГлянула подборку (база **sletat.ru**): \n* **Rixos** — это про релакс\n* **Alva Donna** — для детей\n\nЧто тебе ближе? 😊';
    }
  };

  const [messages, setMessages] = useState([
    { role: 'ai', content: getInitialMessage(psyParam) + '\n\n*(Демо: цены примерные, ссылок нет)*' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filters, setFilters] = useState({
    budget: 300000,
    nights: 7,
    meals: 'AI'
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const savedSettings = localStorage.getItem('botSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      const tone = settings.tone || 'friendly';
      const useEmoji = settings.useEmoji !== undefined ? settings.useEmoji : true;

      const prompt = `Ты - свой человек, ИИ-помощник в подборке туров (база sletat.ru). 
      Контекст подборки: 
      - Направление: ${destParam}
      - Аудитория: ${audParam}
      - Бюджет: ${budgetParam}₽
      - Ночей: ${nightsParam}
      - Состав: ${adultsParam} взр, ${kidsParam} детей
      - Звездность: ${starsParam}*
      - Питание: ${mealsParam}
      - Пожелания от агента (скрыто от туриста, но учти это): ${wishParam}
      
      Вопрос туриста: ${input}. 
      Тон: ${toneParam}. Эмодзи: ${useEmoji ? 'Да' : 'Нет'}. Психотип: ${psyParam}.
      
      ИНСТРУКЦИЯ ПО ПСИХОТИПУ:
      - Если rational: делай упор на цифры, выгоду, инфраструктуру, сравнение фактов.
      - Если emotional: делай упор на атмосферу, чувства, "представьте как вы...", вайб.
      - Если luxury: делай упор на эксклюзивность, сервис, бренды, статус, комфорт.
      - Если family: делай упор на безопасность, детское питание, анимацию, удобство для родителей.
      - Если skeptic: делай упор на факты, рейтинги, отсутствие скрытых доплат, гарантии возврата, реальные отзывы.
      - Если adventurer: делай упор на необычные локации, активный отдых, экскурсии, "не как у всех", драйв.
      - Если romantic: делай упор на эстетику, закаты, уединение, красивые номера, сервис для пар, атмосферу.
      - Если business: делай упор на локацию, Wi-Fi, скорость оформления, комфорт, статус, тишину, отчетные документы.

      Оформляй ответы КРАСИВО и структурировано:
      - Используй жирный шрифт для названий отелей и цен.
      - Используй списки для перечисления преимуществ.
      - Добавляй подходящие эмодзи.
      - Пиши живым, человечным языком, но профессионально.
      - В конце напомни про демо-режим, примерные цены и отсутствие ссылок.
      
      ВАЖНО: Если турист в своем сообщении явно указывает новые параметры (например, "смени бюджет на 100к" или "хочу в Турцию"), ПРИОРИТЕТИЗИРУЙ это над текущими фильтрами из контекста. Подтверждай, что ты учел новые пожелания.`;

      const reply = await generateTravelResponse(prompt);
      
      setMessages(prev => [...prev, { role: 'ai', content: reply || 'Извините, я задумался. Спросите еще раз.' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookingRequest = (hotelName: string) => {
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Новый клиент (из Smart Link)',
      country: destParam,
      budget: `${budgetParam} ₽`,
      details: `Запрос на отель: ${hotelName}. Параметры: ${nightsParam}н, ${mealsParam}, ${adultsParam} взр + ${kidsParam} детей.`,
      status: 'new',
      time: 'Только что',
      source: 'Smart Link'
    };

    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    localStorage.setItem('leads', JSON.stringify([newLead, ...existingLeads]));
    
    alert(`Заявка на отель ${hotelName} отправлена менеджеру! Мы свяжемся с вами в ближайшее время.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* WHITE LABEL HEADER */}
      <div className="bg-amber-50 border-b border-amber-100 py-1 text-center text-[10px] text-amber-600">
        Это демонстрационная страница. Цены и наличие мест в отелях приведены для примера.
      </div>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">TA</div>
            <div>
              <div className="font-bold text-sm">Travel Expert Agency</div>
              <div className="text-xs text-slate-500">Ваш менеджер: Мария Иванова</div>
            </div>
          </a>
          <a href="https://wa.me/" target="_blank" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors">
            <MessageCircle size={16} />
            Связаться
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: SELECTION CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-black mb-2">{destParam}: Подборка для вас</h1>
            <p className="text-slate-600">Специально для: {audParam}. {nightsParam} ночей, {mealsParam}. {adultsParam} взр + {kidsParam} детей.</p>
          </div>

          {/* HOTEL CARD 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
            <div className="h-48 bg-slate-200 relative">
              <img src={`https://picsum.photos/seed/${destParam}1/800/400`} alt="Hotel" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> {starsParam}.0 Рекомендуемый отель
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{destParam} Luxury Resort</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={14} /> {destParam}, 1 линия
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">{parseInt(budgetParam).toLocaleString()} ₽</div>
                  <div className="text-xs text-slate-400">за всех</div>
                </div>
              </div>

              {/* AI INSIGHT BLOCK */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                  <ShieldCheck size={16} />
                  Мнение ИИ-эксперта
                </div>
                <p className="text-sm text-blue-900/80 leading-relaxed">
                  Этот вариант идеально подходит под ваши параметры. <b>Фишка:</b> Высокий рейтинг по питанию и сервису.
                </p>
              </div>

              <button 
                onClick={() => handleBookingRequest(`${destParam} Luxury Resort`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                Оставить заявку на этот отель
              </button>
            </div>
          </div>

          {/* HOTEL CARD 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
            <div className="h-48 bg-slate-200 relative">
              <img src={`https://picsum.photos/seed/${destParam}2/800/400`} alt="Hotel" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> {starsParam}.0 Выгодный вариант
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{destParam} Family Club</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={14} /> {destParam}, 2 линия
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">{(parseInt(budgetParam) * 0.8).toLocaleString()} ₽</div>
                  <div className="text-xs text-slate-400">за всех</div>
                </div>
              </div>

              {/* AI INSIGHT BLOCK */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                  <ShieldCheck size={16} />
                  Мнение ИИ-эксперта
                </div>
                <p className="text-sm text-blue-900/80 leading-relaxed">
                  Более бюджетный, но качественный вариант. Отлично подойдет для {audParam}.
                </p>
              </div>

              <button 
                onClick={() => handleBookingRequest(`${destParam} Family Club`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                Хочу узнать подробнее
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: AI CONCIERGE */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 sticky top-24 h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Персональный ИИ-гид
                </div>
                <div className="text-[10px] text-slate-400">Sletat.ru</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                    <span>Бюджет</span>
                    <span>{filters.budget/1000}к</span>
                  </div>
                  <input 
                    type="range" min="50000" max="1000000" step="10000"
                    value={filters.budget}
                    onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                    <span>Ночей</span>
                    <span>{filters.nights}</span>
                  </div>
                  <input 
                    type="range" min="1" max="21"
                    value={filters.nights}
                    onChange={(e) => setFilters({...filters, nights: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
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
                    {msg.role === 'ai' && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 text-[10px] opacity-50 flex items-center gap-1">
                        <ShieldCheck size={10} />
                        Проверено алгоритмами AIAIAI
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Например: А где лучше пляж?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50 p-1"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
