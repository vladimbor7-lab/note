import React from 'react';
import { Check } from 'lucide-react';

export const Tariffs = () => {
  const plans = [
    {
      name: "Пробный",
      price: "0 ₽",
      desc: "Попробуйте качество текстов и сленг ИИ. Идеально для теста.",
      features: [
        "3 генерации в сутки",
        "Базовая модель (Gemini Flash)",
        "Посты для соцсетей",
        "Анализ Отправкина (базовый)"
      ],
      cta: "Попробовать",
      popular: false
    },
    {
      name: "Агент-Про",
      price: "1 490 ₽",
      desc: "Ваш основной инструмент. Пишет как человек, дожимает клиентов.",
      features: [
        "Claude 3.5 Sonnet (Топ качество)",
        "50-100 запросов в день",
        "Анализ ссылок Отправкина",
        "Функция «Дожим клиента» (WhatsApp)",
        "Кнопка «Реновация»",
        "Стелс-режим (скрыть отель)"
      ],
      popular: true,
      cta: "Подключить"
    },
    {
      name: "Агентство",
      price: "4 900 ₽",
      desc: "Для команд. Общая база знаний и обучение продажам.",
      features: [
        "До 5 сотрудников",
        "Общая база знаний",
        "Приоритетная поддержка",
        "Обучение: Продажи через ИИ",
        "Все функции Агент-Про"
      ],
      cta: "Подключить команду",
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Тарифы</h1>
        <p className="text-slate-600 text-lg">Стратегия Low Entry — High Value. Окупается с одной продажи.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white border ${plan.popular ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm'} rounded-3xl p-8 relative flex flex-col`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Самый выгодный
              </div>
            )}
            <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
            <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}<span className="text-sm text-slate-500 font-normal">/мес</span></div>
            <p className="text-slate-600 text-sm mb-8 min-h-[40px]">{plan.desc}</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className={`mt-0.5 ${plan.popular ? "text-blue-600" : "text-slate-400"}`}><Check size={16} /></div>
                  <span dangerouslySetInnerHTML={{ __html: f.replace('Claude 3.5 Sonnet', '<b>Claude 3.5 Sonnet</b>') }}></span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8 text-slate-400 text-sm">
        Оплата картой любого банка РФ (СБП). Работаем с самозанятыми и ИП.
      </div>
    </div>
  );
};
