import React, { useState } from 'react';
import { generateTourPost } from '../services/gemini';
import { Sparkles, Copy, Check } from 'lucide-react';

export const Generator = () => {
  const [rawText, setRawText] = useState('');
  const [audience, setAudience] = useState('Семья с детьми');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!rawText) return;
    setIsGenerating(true);
    try {
      const text = await generateTourPost(rawText, audience);
      setResult(text || '');
    } catch (e) {
      console.error(e);
      setResult('Ошибка генерации. Проверьте API ключ.');
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">ИИ-Копирайтер для WhatsApp</h1>
        <p className="text-slate-600">Вставьте сухой текст от туроператора, и нейросеть превратит его в продающий пост.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Для кого тур?</label>
            <select 
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-700 transition-colors"
            >
              <option value="Семья с детьми">Семья с детьми</option>
              <option value="Молодая пара (романтика)">Молодая пара (романтика)</option>
              <option value="Молодежь (тусовки)">Молодежь (тусовки)</option>
              <option value="Пенсионеры (спокойный отдых)">Пенсионеры (спокойный отдых)</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[400px] shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Текст от туроператора (копипаст)</label>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Вставьте текст сюда... (например: TURKEY, Antalya, Rixos Premium 5*, 10.08-17.08, DBL, UAI, 250000 RUB)"
              className="flex-1 bg-transparent resize-none text-slate-900 outline-none placeholder:text-slate-400 text-sm leading-relaxed"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !rawText}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isGenerating ? <span className="animate-pulse">Магия в процессе...</span> : <><Sparkles size={18} /> Сделать красиво</>}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[550px] relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Готовый пост для клиента</label>
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
              <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-8">
                Здесь появится красивый, отформатированный текст с эмодзи, готовый к отправке в WhatsApp.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
