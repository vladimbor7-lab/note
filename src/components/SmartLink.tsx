import React, { useState } from 'react';
import { Sparkles, Copy, Check, Zap, Globe, Users, MessageSquare } from 'lucide-react';

export const SmartLink = () => {
  const [psy, setPsy] = useState('emotional');
  const [audience, setAudience] = useState('Семья с детьми');
  const [tone, setTone] = useState('friendly');
  const [budget, setBudget] = useState('300000');
  const [nights, setNights] = useState('7');
  const [stars, setStars] = useState('5');
  const [meals, setMeals] = useState('AI');
  const [destination, setDestination] = useState('Турция');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [wishes, setWishes] = useState('');
  const [agentId, setAgentId] = useState('agent_' + Math.random().toString(36).substr(2, 9));
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const baseUrl = window.location.origin + '/selection';
    const params = new URLSearchParams({
      agent: agentId,
      psy: psy,
      aud: audience,
      tone: tone,
      budget: budget,
      nights: nights,
      stars: stars,
      meals: meals,
      dest: destination,
      adults: adults,
      kids: children,
      wish: wishes
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Генератор Smart-ссылок</h1>
        <p className="text-slate-600">Создайте персональную ссылку для клиента. Бот подстроится под его психотип и ваши настройки.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
            <Zap size={20} className="text-blue-600" />
            Настройки ссылки
          </h3>

          <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe size={14} /> Психотип клиента
              </label>
              <select 
                value={psy}
                onChange={(e) => setPsy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              >
                <option value="emotional">Эмоциональный (Вайб и чувства)</option>
                <option value="rational">Рациональный (Цифры и выгода)</option>
                <option value="luxury">Премиальный (Статус и сервис)</option>
                <option value="family">Семейный (Забота и дети)</option>
                <option value="skeptic">Скептик (Пруфы и гарантии)</option>
                <option value="adventurer">Искатель (Драйв и актив)</option>
                <option value="romantic">Романтик (Виды и эстетика)</option>
                <option value="business">Бизнес (Комфорт и скорость)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users size={14} /> Целевая аудитория
              </label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              >
                <option value="Семья с детьми">Семья с детьми</option>
                <option value="Молодая пара">Молодая пара</option>
                <option value="Молодежь (тусовки)">Молодежь (тусовки)</option>
                <option value="Пенсионеры">Пенсионеры</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MessageSquare size={14} /> Тон общения бота
              </label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              >
                <option value="friendly">Дружелюбный 😊</option>
                <option value="expert">Экспертный 🧐</option>
                <option value="provocative">Дерзкий 🔥</option>
                <option value="concise">Лаконичный ⚡</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap size={14} /> Направление
              </label>
              <input 
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Турция, ОАЭ..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                💰 Бюджет (до)
              </label>
              <input 
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                🌙 Ночей
              </label>
              <input 
                type="number"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                ⭐ Звездность
              </label>
              <select 
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              >
                <option value="5">5 звезд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="any">Любая</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                🍽️ Питание
              </label>
              <select 
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              >
                <option value="AI">Все включено</option>
                <option value="UAI">Ультра все включено</option>
                <option value="FB">Полный пансион</option>
                <option value="HB">Завтрак + ужин</option>
                <option value="BB">Только завтрак</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                👥 Взрослых
              </label>
              <input 
                type="number"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                👶 Детей
              </label>
              <input 
                type="number"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              📝 Пожелания клиента (скрыто от него)
            </label>
            <textarea 
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Например: Любят тишину, нужен хороший Wi-Fi, хотят рядом с центром..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors text-sm h-20 resize-none"
            />
          </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">S</div>
              <span className="font-bold text-sm tracking-tight uppercase">Smart Selection</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Ваша ссылка готова</h3>
            <p className="text-slate-400 text-sm mb-6">
              Бот автоматически применит выбранный психотип <b>{psy}</b> и тон <b>{tone}</b> при общении с клиентом.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 border border-white/10 rounded-xl p-3 font-mono text-xs break-all">
              {generateLink()}
            </div>
            <button 
              onClick={handleCopy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Скопировано!' : 'Копировать Smart-ссылку'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-blue-600" />
          Как это работает?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <p className="text-sm font-bold text-slate-900">Выбираете параметры</p>
            <p className="text-xs text-slate-500 leading-relaxed">Настраиваете психотип и тон под конкретного клиента или группу.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <p className="text-sm font-bold text-slate-900">Отправляете ссылку</p>
            <p className="text-xs text-slate-500 leading-relaxed">Клиент переходит по ссылке и видит вашу подборку отелей.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <p className="text-sm font-bold text-slate-900">ИИ дожимает продажу</p>
            <p className="text-xs text-slate-500 leading-relaxed">Бот общается с клиентом, отрабатывает возражения и помогает выбрать лучший вариант.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
