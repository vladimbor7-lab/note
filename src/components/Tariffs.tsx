import React from 'react';
import { Check } from 'lucide-react';

export const Tariffs = () => {
  const plans = [
    {
      name: "Ассистент",
      price: "2 900 ₽",
      desc: "Telegram/VK бот. Собирает параметры тура у клиента (квалификация лида), пока вы спите.",
      features: ["Telegram бот", "VK бот", "Квалификация лидов", "Уведомления в CRM"]
    },
    {
      name: "ПРО",
      price: "6 900 ₽",
      desc: "Интеграция с WhatsApp. ИИ распознает голосовые сообщения и делает саммари.",
      features: ["Всё из Ассистента", "Интеграция WhatsApp", "Распознавание голосовых", "Саммари диалогов"],
      popular: true
    },
    {
      name: "Премиум",
      price: "15 000 ₽",
      desc: "ИИ работает на вас. Идеальный копирайтер и генератор подборок из кривого текста ТО.",
      features: ["Всё из ПРО", "ИИ-Копирайтер", "Генерация подборок", "Приоритетная поддержка"]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Тарифы</h1>
        <p className="text-slate-600 text-lg">Выберите идеальный план для вашего агентства</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name} className={`bg-white border ${plan.popular ? 'border-orange-500 shadow-md' : 'border-slate-200 shadow-sm'} rounded-3xl p-8 relative`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Хит продаж</div>}
            <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
            <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}<span className="text-sm text-slate-500 font-normal">/мес</span></div>
            <p className="text-slate-600 text-sm mb-8 h-16">{plan.desc}</p>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                  <Check size={16} className={plan.popular ? "text-orange-500" : "text-blue-600"} />
                  {f}
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
              Выбрать тариф
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
