import React, { useState, useEffect } from 'react';
import { Save, Bot, MessageSquare, Sliders } from 'lucide-react';

export const BotSettings = () => {
  const [settings, setSettings] = useState({
    welcomeMessage: 'Привет! Я ваш персональный ИИ-турагент. Куда планируете полететь? 🌍',
    systemPrompt: 'Ты - дружелюбный ИИ-турагент. Твоя цель - помочь туристу выбрать тур. Отвечай кратко, по делу, предлагай варианты или задавай уточняющие вопросы.',
    tone: 'friendly', // friendly, formal, energetic
    useEmoji: true
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('botSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('botSettings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Настройки ИИ-Бота</h1>
        <p className="text-slate-600">Настройте поведение бота, который общается с туристами на сайте.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Welcome Message */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-600" />
            Приветственное сообщение
          </label>
          <input 
            type="text"
            value={settings.welcomeMessage}
            onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors"
            placeholder="Первое сообщение, которое видит турист"
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Bot size={16} className="text-blue-600" />
            Системная инструкция (Промпт)
          </label>
          <p className="text-xs text-slate-500 mb-2">Опишите, как бот должен себя вести. Например: "Ты эксперт по Турции" или "Ты продаешь только дорогие туры".</p>
          <textarea 
            value={settings.systemPrompt}
            onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors h-32 resize-none"
            placeholder="Инструкция для ИИ..."
          />
        </div>

        {/* Tone & Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Sliders size={16} className="text-blue-600" />
              Тон общения
            </label>
            <select 
              value={settings.tone}
              onChange={(e) => setSettings({...settings, tone: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="friendly">Дружелюбный (по умолчанию)</option>
              <option value="formal">Официально-деловой</option>
              <option value="energetic">Энергичный и продающий</option>
            </select>
          </div>
          
          <div className="flex items-center">
             <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={settings.useEmoji}
                  onChange={(e) => setSettings({...settings, useEmoji: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-bold text-slate-700">Использовать Emoji в ответах 🌟</span>
             </label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <button 
            onClick={() => {
              if (window.confirm('Сбросить настройки к заводским?')) {
                localStorage.removeItem('botSettings');
                setSettings({
                  welcomeMessage: 'Привет! Я ваш персональный ИИ-турагент. Куда планируете полететь? 🌍',
                  systemPrompt: 'Ты - дружелюбный ИИ-турагент. Твоя цель - помочь туристу выбрать тур. Отвечай кратко, по делу, предлагай варианты или задавай уточняющие вопросы.',
                  tone: 'friendly',
                  useEmoji: true
                });
              }
            }}
            className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
          >
            Сбросить настройки
          </button>

          <div className="flex gap-3">
            <button 
              onClick={() => window.open('/chat', '_blank')}
              className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={18} />
              Тест бота
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${isSaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSaved ? 'Сохранено!' : 'Сохранить настройки'}
              {!isSaved && <Save size={18} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
