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
        <h1 className="text-4xl font-black text-white mb-4">Тарифы</h1>
        <p className="text-white/50 text-lg">Выберите идеальный план для вашего агентства</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name} className={`bg-[#141414] border ${plan.popular ? 'border-violet-500' : 'border-white/10'} rounded-3xl p-8 relative`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Хит продаж</div>}
            <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
            <div className="text-3xl font-black text-white mb-4">{plan.price}<span className="text-sm text-white/40 font-normal">/мес</span></div>
            <p className="text-white/50 text-sm mb-8 h-16">{plan.desc}</p>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                  <Check size={16} className="text-violet-400" />
                  {f}
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-violet-500 hover:bg-violet-600 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
              Выбрать тариф
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
