import React, { useState } from 'react';
import { Sparkles, Copy, Check, Eye, EyeOff, MessageCircle } from 'lucide-react';

export const Generator = () => {
  const [rawText, setRawText] = useState('');
  const [otpravkinLink, setOtpravkinLink] = useState('');
  const [blacklist, setBlacklist] = useState('');
  const [audience, setAudience] = useState('Семья с детьми');
  const [profile, setProfile] = useState('Обычный турист');
  const [stealthMode, setStealthMode] = useState(false);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (mode: 'default' | 'objection' | 'specs' = 'default') => {
    if (!rawText && !otpravkinLink && mode === 'default') return;
    setIsGenerating(true);
    try {
      let prompt = '';

      if (mode === 'objection') {
        prompt = `
          Ты - опытный турагент. Клиент возражает: "Я видел этот отель дешевле" или сомневается в цене.
          Твоя задача: Мягко и экспертно отработать возражение, используя данные с otpravkin.ru.
          
          Входные данные:
          - Отель/Контекст: ${rawText || otpravkinLink || 'Не указан'}
          - Психотип клиента: ${profile}

          Инструкция:
          1. Объясни разницу в цене (категория номера, вид из окна, тип питания, перелет регулярным рейсом vs чартер).
          2. Используй технику "Да, но...": "Да, цена может отличаться, но в моем предложении включен индивидуальный трансфер..."
          3. Не спорь, а приводи аргументы ценности.
          4. Стиль: Уверенный, спокойный, заботливый.
        `;
      } else if (mode === 'specs') {
        prompt = `
          Ты - аналитик отелей. Твоя задача: Вытащить сухие факты для агента (шпаргалка) с сайта otpravkin.ru.
          
          Входные данные:
          - Ссылка/Текст: ${otpravkinLink || rawText}
          
          Инструкция:
          1. Если есть ссылка, проанализируй её содержимое (используй Google Search для otpravkin.ru).
          2. Выдай краткий список фактов (bullet points):
             - 📅 Год постройки / Реновации
             - 🏖 Тип пляжа (песок/галька, вход)
             - 📏 Площадь территории
             - ✈️ Расстояние до аэропорта
             - 👶 Фишки для детей
             - 🍸 Нюансы (напр. "слабый Wi-Fi", "много лестниц")
          3. Без воды, только факты.
        `;
      } else {
        // Default mode (Post generation)
        prompt = `
          Ты - профессиональный турагент, работающий на базе данных otpravkin.ru.
          Твоя задача - создать продающий, эмоциональный пост для WhatsApp на основе предоставленных данных.
          
          Входные данные:
          - Описание/Запрос: ${rawText}
          - Ссылка на подборку (Отправкин.ру): ${otpravkinLink || 'Не указана'}
          - Аудитория: ${audience}
          - Психотип клиента: ${profile}
          - Стелс-режим: ${stealthMode ? 'ВКЛЮЧЕН (Не называй отели! Описывай их так, чтобы клиент влюбился, но не мог найти сам. Используй фразы "Этот отель...", "Роскошная пятерка в Белеке..." и т.д.)' : 'ВЫКЛЮЧЕН (Называй отели открыто)'}
          - Черный список отелей (НЕ ПРЕДЛАГАТЬ): ${blacklist || 'Нет'}

          Инструкция:
          1. Если есть ссылка на Отправкин.ру, проанализируй её (используй Google Search для поиска актуальных цен и деталей на otpravkin.ru) и выдели их концепции.
             - Если ссылка на подборку из нескольких отелей, напиши: "Я проанализировал вашу подборку. Отель №1 идеален для..., а №3 сейчас на акции".
             - Сгенерируй "Текст-мост": "Мария (или имя клиента), здравствуйте! Я подготовил для вас варианты... Самый интересный — [Название/Описание], там... Посмотрите детали по ссылке: ${otpravkinLink}".
          2. Структурируй текст: Заголовок, Главные фишки, Для кого подходит, Цена (ОБЯЗАТЕЛЬНО РЕАЛЬНАЯ С OTPRAVKIN.RU), Призыв к действию.
          3. Используй emoji, но умеренно.
          4. Учитывай психотип:
             - "Мамочка-паникер": упор на безопасность, питание, врачей.
             - "Любитель лакшери": упор на бренды, сервис, эксклюзив.
             - "Экономный скептик": упор на выгоду и честные отзывы.
          5. В конце текста ОБЯЗАТЕЛЬНО добавь подпись мелким шрифтом или курсивом: 
             "🤖 Анализ проведен нейросетью AIAIAI на базе реальных данных otpravkin.ru"
        `;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, model: 'gemini' })
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

  const handleShare = () => {
    const link = `${window.location.origin}/selection`;
    navigator.clipboard.writeText(link);
    alert(`Ссылка для туриста скопирована: ${link}\n\nОтправьте её клиенту, чтобы он увидел "Умную подборку".`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">ИИ-Копирайтер (Gemini 1.5)</h1>
          <p className="text-slate-600">Вставьте ссылку на Отправкин.ру или описание отеля. Нейросеть сделает продающий пост.</p>
        </div>
        <button 
          onClick={handleShare}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
        >
          <Sparkles size={16} />
          Создать Smart-ссылку
        </button>
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Психотип (Gemini)</label>
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

          {/* Otprovin Link Input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ссылка на подборку (Отправкин.ру)</label>
            <input 
              type="text"
              value={otpravkinLink}
              onChange={(e) => setOtpravkinLink(e.target.value)}
              placeholder="https://otpravkin.ru/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-700 transition-colors text-sm"
            />
          </div>

          {/* Blacklist Input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Черный список отелей (База знаний)</label>
            <textarea 
              value={blacklist}
              onChange={(e) => setBlacklist(e.target.value)}
              placeholder="Отели, которые я ненавижу и не продаю..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-700 transition-colors text-sm h-20 resize-none"
            />
          </div>

          {/* Input Area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[200px] shadow-sm relative">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Доп. пожелания / Описание</label>
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
              placeholder="Например: нужно сделать акцент на питании..."
              className="flex-1 bg-transparent resize-none text-slate-900 outline-none placeholder:text-slate-400 text-sm leading-relaxed"
            />
            {stealthMode && (
              <div className="absolute bottom-4 right-4 bg-slate-900 text-white text-xs px-3 py-1 rounded-full opacity-80 pointer-events-none">
                Названия отелей будут скрыты
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => handleGenerate('default')}
              disabled={isGenerating || (!rawText && !otpravkinLink)}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {isGenerating ? <span className="animate-pulse">Gemini пишет пост...</span> : <><Sparkles size={18} /> Сгенерировать пост</>}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleGenerate('objection')}
                disabled={isGenerating}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                🛡 Отработка возражения
              </button>
              <button 
                onClick={() => handleGenerate('specs')}
                disabled={isGenerating || !otpravkinLink}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                📋 Спецификация отеля
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[600px] relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Результат</label>
            {result && (
              <button onClick={handleCopy} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-bold">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-y-auto space-y-6">
            {result ? (
              <>
                {/* Section 1: WhatsApp Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <MessageCircle size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Для WhatsApp (Агенту)</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                    {result}
                  </div>
                </div>

                {/* Section 2: Smart Link */}
                {otpravkinLink && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <Sparkles size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Для Туриста (Smart Link)</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                      <div className="text-sm text-blue-900 font-medium truncate">
                        {window.location.origin}/selection
                      </div>
                      <button 
                        onClick={handleShare}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        Копировать ссылку
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 ml-1">
                      Отправьте эту ссылку клиенту. Там его ждет персональный ИИ-гид по этой подборке.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-8">
                <Sparkles size={32} className="mb-3 opacity-20" />
                <p>Здесь появится результат.</p>
                <p className="text-xs mt-2 opacity-60">Вставьте ссылку на Отправкин.ру, чтобы получить текст и Smart-ссылку.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

