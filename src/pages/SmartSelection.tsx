import React, { useState } from 'react';
import { MessageCircle, Phone, Star, MapPin, ShieldCheck, AlertTriangle, Send } from 'lucide-react';
import { generateTravelResponse } from '../services/gemini';

export const SmartSelection = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Здравствуйте! Ваш агент Мария подготовила для вас эту подборку. Я изучил все варианты: Rixos идеален для спокойствия, а Alva Donna — для детей. Что вам важнее?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

      const prompt = `Ты - ИИ-помощник турагента для туриста. Контекст: Турист смотрит подборку (Rixos Premium Belek, Alva Donna, Nirvana). Вопрос туриста: ${input}. 
      Настройки тона: ${tone}. Использовать эмодзи: ${useEmoji ? 'Да' : 'Нет'}.
      Отвечай кратко, честно, продавай ценность. В конце добавь дисклеймер.`;

      const reply = await generateTravelResponse(prompt);
      
      setMessages(prev => [...prev, { role: 'ai', content: reply || 'Извините, я задумался. Спросите еще раз.' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* WHITE LABEL HEADER */}
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
            <h1 className="text-2xl font-black mb-2">🇹🇷 Турция: Бархатный сезон</h1>
            <p className="text-slate-600">Специально для семьи с 2 детьми. Вылет 15.09 на 9 ночей.</p>
          </div>

          {/* HOTEL CARD 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://picsum.photos/seed/rixos/800/400" alt="Hotel" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> 5.0 Rixos Premium
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Rixos Premium Belek</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={14} /> Белек, 1 линия
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">320 000 ₽</div>
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
                  Идеальный выбор для тех, кто ценит статус. <b>Фишка:</b> бесплатный вход в парк The Land of Legends (экономия ~300$ на семью). Питание — эталонное.
                </p>
              </div>

              {/* HONESTY BLOCK */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
                  <AlertTriangle size={16} className="text-orange-500" />
                  Честный нюанс (Ожидание vs Реальность)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Отель огромный, много ходить. Если любите камерность — может быть шумно. Номера Deluxe в основном здании лучше, чем в саду.
                </p>
              </div>
            </div>
          </div>

          {/* HOTEL CARD 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://picsum.photos/seed/alva/800/400" alt="Hotel" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8 Alva Donna
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Alva Donna Exclusive</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={14} /> Белек, 1 линия
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">245 000 ₽</div>
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
                  Топ за свои деньги. Подогреваемые бассейны даже в мае. Анимация — одна из лучших на побережье, дети будут заняты весь день.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: AI CONCIERGE */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 sticky top-24 h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Персональный ИИ-гид
              </div>
              <div className="text-xs text-slate-500 mt-1">Знает всё про эти отели. Спросите про пляж, еду или погоду.</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.content}
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
