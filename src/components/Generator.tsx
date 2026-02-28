import React, { useState } from 'react';
import { Sparkles, Copy, Check, Eye, EyeOff } from 'lucide-react';

export const Generator = () => {
  const [rawText, setRawText] = useState('');
  const [audience, setAudience] = useState('Семья с детьми');
  const [profile, setProfile] = useState('Обычный турист');
  const [stealthMode, setStealthMode] = useState(false);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!rawText) return;
    setIsGenerating(true);
    try {
      const prompt = `
        Ты - профессиональный турагент, использующий модель Claude 3.5 Sonnet.
        Твоя задача - переписать сухой текст от туроператора или описание отеля в продающий, эмоциональный пост для WhatsApp.
        
        Входные данные:
        - Текст/Ссылка: ${rawText}
        - Аудитория: ${audience}
        - Психотип клиента: ${profile}
        - Стелс-режим: ${stealthMode ? 'ВКЛЮЧЕН (Не называй отель! Описывай его так, чтобы клиент влюбился, но не мог найти сам. Используй фразы "Этот отель...", "Роскошная пятерка в Белеке..." и т.д.)' : 'ВЫКЛЮЧЕН (Называй отель открыто)'}

        Инструкция:
        1. Используй emoji, но не перебарщивай.
        2. Структурируй текст: Заголовок, Главные фишки, Для кого подходит, Цена (если есть), Призыв к действию.
        3. Если это ссылка на Отправкин.ру, проанализируй отели и выдели их концепции (Тихий/Тусовочный/Детский).
        4. Если выбран психотип "Мамочка-паникер" - упор на безопасность, питание, врачей.
        5. Если "Любитель лакшери" - упор на бренды, сервис, эксклюзив.
        6. Если "Экономный скептик" - упор на выгоду и честные отзывы.
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, model: 'claude' })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.reply || '');
    } catch (e) {
      console.error(e);
      setResult('Ошибка генерации. Проверьте API ключ или попробуйте позже.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">ИИ-Копирайтер (Claude 3.5)</h1>
        <p className="text-slate-600">Вставьте ссылку на Отправкин.ру или описание отеля. Нейросеть сделает продающий пост.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Аудитория</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-700 transition-colors text-sm"
              >
                <option value="Семья с детьми">Семья с детьми</option>
                <option value="Молодая пара">Молодая пара</option>
                <option value="Молодежь (тусовки)">Молодежь (тусовки)</option>
                <option value="Пенсионеры">Пенсионеры</option>
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Психотип (Claude)</label>
              <select 
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-700 transition-colors text-sm"
              >
                <option value="Обычный турист">Обычный турист</option>
                <option value="Мамочка-паникер">Мамочка-паникер</option>
                <option value="Любитель лакшери">Любитель лакшери</option>
                <option value="Экономный скептик">Экономный скептик</option>
              </select>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[400px] shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Исходные данные</label>
              <button 
                onClick={() => setStealthMode(!stealthMode)}
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors ${stealthMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {stealthMode ? <EyeOff size={14} /> : <Eye size={14} />}
                {stealthMode ? 'Стелс-режим ВКЛ' : 'Стелс-режим ВЫКЛ'}
              </button>
            </div>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Вставьте ссылку на подборку Отправкин.ру или текст отеля..."
              className="flex-1 bg-transparent resize-none text-slate-900 outline-none placeholder:text-slate-400 text-sm leading-relaxed"
            />
            {stealthMode && (
              <div className="absolute bottom-4 right-4 bg-slate-900 text-white text-xs px-3 py-1 rounded-full opacity-80 pointer-events-none">
                Названия отелей будут скрыты
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !rawText}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isGenerating ? <span className="animate-pulse">Claude пишет пост...</span> : <><Sparkles size={18} /> Сгенерировать</>}
          </button>
        </div>

        {/* Result Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[550px] relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Результат (WhatsApp)</label>
            {result && (
              <button onClick={handleCopy} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-bold">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            )}
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-y-auto">
            {result ? (
              <pre className="text-slate-800 whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-8">
                <Sparkles size={32} className="mb-3 opacity-20" />
                <p>Здесь появится продающий текст.</p>
                <p className="text-xs mt-2 opacity-60">Попробуйте вставить ссылку на отель и включить "Стелс-режим".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

