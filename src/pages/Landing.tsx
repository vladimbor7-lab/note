import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInterface } from '../components/SearchInterface';
import { HotelResults } from '../components/HotelResults';
import { MessageCircle, Check, Zap, Globe, Shield } from 'lucide-react';
import { Header } from '../components/Header';
import '../landing.css';

export const Landing = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = React.useState({
    departure: 'Москва',
    destination: '',
    type: 'tours'
  });
  const [hotels, setHotels] = useState<any[]>([]);

  const handleHeroSearch = () => {
    const params = new URLSearchParams({
      dest: heroSearch.destination,
      departure: heroSearch.departure,
      type: heroSearch.type
    });
    navigate(`/selection?${params.toString()}`);
  };

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* NAV */}
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              AITravel
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              Ваш ИИ-ассистент, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">который продает туры.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Пока вы отдыхаете. Автоматическая упаковка подборок из Отправкин.ру в WhatsApp. ИИ-консультация для ваших туристов 24/7.
            </p>

            {/* Professional Search Bar Removed */}
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => navigate('/selection')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                Менеджер для туристов
              </button>
              <button onClick={() => navigate('/dashboard')} className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:border-slate-300">
                Демо кабинета агента
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                Психотипы клиентов
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                Генерация постов
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
                Виджеты и ТГ-боты
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - INTERACTIVE CHAT */}
          <div className="relative flex justify-center lg:justify-end">
             {/* Background blobs */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             
             {/* The Chat Widget Container */}
             <div className="relative z-10 w-full max-w-lg lg:max-w-xl">
                <SearchInterface onHotelsFound={setHotels} />
             </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Сравнение</div>
            <h2 className="text-4xl font-black text-slate-900">Почему Claude 3.5 <em className="text-blue-600 not-italic">лучше ChatGPT</em></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 opacity-70">
              <div className="font-bold text-slate-500 mb-4">Обычный AI (ChatGPT)</div>
              <div className="text-sm leading-relaxed text-slate-600 mb-6">
                "Отель Rixos Premium Belek расположен в Белеке. В отеле есть бассейн, ресторан и спа. Номера оборудованы кондиционером. Пляж находится в 100 метрах. Хороший выбор для отдыха."
              </div>
              <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">Сухо и скучно</div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-600 relative transform md:-translate-y-4">
              <div className="absolute -top-3 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">Рекомендуем</div>
              <div className="font-bold text-slate-900 mb-4">AITravel (Claude 3.5)</div>
              <div className="text-sm leading-relaxed text-slate-900 mb-6">
                "✨ <b>Rixos Premium Belek — это не просто отель, это стиль жизни.</b><br/><br/>
                Представьте: вы просыпаетесь на вилле, а через 5 минут уже пьете кофе с видом на сосновый лес. Для детей — легендарный Land of Legends (бесплатно!), для вас — тишина в Anjana Spa.<br/><br/>
                🍸 <b>Фишка:</b> Здесь подают тот самый Godiva Chocolate в лобби."
              </div>
              <div className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">Продает эмоции</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Возможности</div>
            <h2 className="text-4xl font-black text-slate-900">Киллер-фичи для <em className="text-blue-600 not-italic">профи</em></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-6">🧠</div>
              <h3 className="text-xl font-bold mb-3">Психотипы ИИ</h3>
              <p className="text-slate-600 leading-relaxed">Менеджер подстраивается под клиента: рациональный, эмоциональный, люкс или семейный подход.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl mb-6">📝</div>
              <h3 className="text-xl font-bold mb-3">Генератор контента</h3>
              <p className="text-slate-600 leading-relaxed">Создавайте продающие посты для соцсетей из обычных ссылок на отели за считанные секунды.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-6">🔌</div>
              <h3 className="text-xl font-bold mb-3">Легкая интеграция</h3>
              <p className="text-slate-600 leading-relaxed">Установите виджет на сайт или создайте Telegram-бота для общения с туристами в один клик.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Тарифы</div>
            <h2 className="text-4xl font-black text-slate-900">Стратегия <em className="text-blue-600 not-italic">Low Entry — High Value</em></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xl mb-1">Start (Free)</div>
              <div className="text-slate-500 text-sm mb-6">Попробовать</div>
              <div className="text-4xl font-black text-slate-900 mb-6">0 ₽</div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> 2 ссылки из Отправкина/день</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Gemini 1.5 Flash</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Тест ИИ-упаковки</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors">Попробовать</button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-white relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">Самый выгодный</div>
              <div className="font-bold text-white text-xl mb-1">Expert</div>
              <div className="text-slate-400 text-sm mb-6">Основной продукт</div>
              <div className="text-4xl font-black text-white mb-6">1 990 ₽<span className="text-lg text-slate-500 font-normal">/мес</span></div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> <b>Безлимит по ссылкам</b></div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> ИИ-консультант для туристов</div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> Функция "Дожим клиента"</div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> Стелс-режим</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">Подключить</button>
            </div>

            {/* Agency */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xl mb-1">Agency</div>
              <div className="text-slate-500 text-sm mb-6">Команда / VIP</div>
              <div className="text-4xl font-black text-slate-900 mb-6">4 900 ₽<span className="text-lg text-slate-500 font-normal">/мес</span></div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Всё из Expert</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> До 3-х менеджеров</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Логотип на страницах туристов</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors">Подключить</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg">A</div>
            <div className="font-bold text-xl tracking-tight">AI<em className="text-blue-600 not-italic">Travel</em></div>
          </a>
          <div className="text-slate-500 text-sm">
            © 2026 AITravel · Интеграция с Sletat.ru
          </div>
        </div>
      </footer>
    </div>
  );
};
