import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchWidget } from '../components/SearchWidget';
import { MessageCircle, Check, Zap, Globe, Shield } from 'lucide-react';
import '../landing.css';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-12 transition-transform">T</div>
            <div className="font-bold text-xl tracking-tight">Travel<em className="text-blue-600 not-italic">AI</em></div>
          </a>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Демо агента</span>
            <a href="/chat" className="hover:text-blue-600 transition-colors">Я турист</a>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Возможности</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Тарифы</span>
          </div>
          <a href="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5">
            Войти (Агент) →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Твой второй мозг для продажи туров
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              Travel-консультант <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">нового поколения</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Интеграция с Отправкин.ру, интеллект Claude 3.5 и мгновенная упаковка подборок в Telegram. Продавайте туры, а не просто копируйте ссылки.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                Попробовать бесплатно
              </button>
              <button onClick={() => navigate('/chat')} className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:border-slate-300">
                Я турист (Бот)
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                Claude 3.5
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                Otprovin
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
                WhatsApp
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - INTERACTIVE WIDGETS */}
          <div className="relative">
             {/* Background blobs */}
             <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             
             {/* The Search Widget Container */}
             <div className="relative z-10 space-y-6">
                <div className="bg-white/60 backdrop-blur-sm border border-white/50 p-6 rounded-3xl shadow-2xl">
                   <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Поиск туров (Демо)</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Live Integration</span>
                   </div>
                   <SearchWidget />
                </div>

                {/* Chat Preview (Small) */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 max-w-sm ml-auto transform translate-x-4">
                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <MessageCircle size={20} />
                   </div>
                   <div>
                      <div className="text-xs text-slate-500 font-bold">WhatsApp</div>
                      <div className="text-sm font-medium text-slate-900">Подборка отправлена туристу</div>
                   </div>
                   <div className="ml-auto text-green-500">
                      <Check size={20} />
                   </div>
                </div>
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
              <div className="font-bold text-slate-900 mb-4">Travel AI (Claude 3.5)</div>
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
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-6">🪄</div>
              <h3 className="text-xl font-bold mb-3">Otprovin Connect</h3>
              <p className="text-slate-600 leading-relaxed">Вставьте ссылку — получите анализ. ИИ мгновенно изучит отели в вашей подборке и выделит главные аргументы для продажи.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl mb-6">💬</div>
              <h3 className="text-xl font-bold mb-3">Human Style</h3>
              <p className="text-slate-600 leading-relaxed">Никаких роботов. Claude 3.5 пишет так тепло и экспертно, что клиенты будут уверены: это написали вы лично.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-6">📱</div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Ready</h3>
              <p className="text-slate-600 leading-relaxed">Готовый оффер в один клик. Идеальное форматирование с эмодзи, которое читается на любом смартфоне.</p>
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
              <div className="font-bold text-slate-900 text-xl mb-1">Free (Trial)</div>
              <div className="text-slate-500 text-sm mb-6">Попробовать</div>
              <div className="text-4xl font-black text-slate-900 mb-6">0 ₽</div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> 3 консультации/день</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Базовая модель</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Анализ Отправкина</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors">Попробовать</button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-white relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">Самый выгодный</div>
              <div className="font-bold text-white text-xl mb-1">Pro (Expert)</div>
              <div className="text-slate-400 text-sm mb-6">Основной продукт</div>
              <div className="text-4xl font-black text-white mb-6">1 990 ₽<span className="text-lg text-slate-500 font-normal">/мес</span></div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> <b>Claude 3.5 Sonnet</b></div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> Безлимит генераций</div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> Функция "Дожим клиента"</div>
                <div className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-blue-400" /> Стелс-режим</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">Подключить</button>
            </div>

            {/* Agency */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xl mb-1">Agency (Team)</div>
              <div className="text-slate-500 text-sm mb-6">Команда / VIP</div>
              <div className="text-4xl font-black text-slate-900 mb-6">4 900 ₽<span className="text-lg text-slate-500 font-normal">/мес</span></div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Всё из Pro</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> До 3-х менеджеров</div>
                <div className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-green-500" /> Общий архив подборок</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors">Подключить</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg">T</div>
            <div className="font-bold text-xl tracking-tight">Travel<em className="text-blue-600 not-italic">AI</em></div>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 Travel AI · Интеграция с Отправкин.ру
          </div>
        </div>
      </footer>
    </div>
  );
};
