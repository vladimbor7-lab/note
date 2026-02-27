import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Sparkles, Zap, MessageSquare, CheckCircle2, 
  ChevronDown, ArrowRight, Globe, 
  Menu, X, PlayCircle, Send
} from 'lucide-react';

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      q: "Заменит ли бот живого менеджера?",
      a: "Нет, бот не заменяет менеджера, а забирает на себя 80% рутины. Он квалифицирует лида (узнает даты, бюджет, состав) и передает менеджеру готовую заявку. Менеджеру остается только закрыть сделку."
    },
    {
      q: "Как работает интеграция со Слетать.ру?",
      a: "Бот имеет прямой доступ к базе туров Слетать.ру. Когда клиент просит тур в Турцию на 10 дней, ИИ мгновенно парсит актуальные цены и выдает 3-5 лучших вариантов с фото и ссылками."
    },
    {
      q: "Можно ли подключить бота к WhatsApp и Telegram?",
      a: "Да! Бот работает в WhatsApp, Telegram, VK и виджетом на сайте. Все диалоги могут дублироваться в вашу CRM (U-ON, Битрикс24, amoCRM)."
    },
    {
      q: "Смогу ли я сам настроить бота?",
      a: "Абсолютно. У нас есть удобная Рабочая зона (Dashboard), где вы можете в один клик менять настройки, тарифы и смотреть статистику заявок."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500/30">
      <SEO 
        title="Travel AI | Нейросеть и чат-бот для турагентств с интеграцией Слетать.ру"
        description="Увеличьте продажи туров на 40% с помощью ИИ-ассистента. Автоматический подбор туров через Слетать.ру, ответы клиентам 24/7, интеграция с U-ON и Битрикс24."
      />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/20">
              T
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              TRAVEL<span className="text-violet-500">AI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Преимущества</a>
            <a href="#demo" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Демо</a>
            <a href="#faq" className="text-sm font-bold text-white/60 hover:text-white transition-colors">FAQ</a>
            <a href="#pricing" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Тарифы</a>
            <Link to="/dashboard" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black hover:bg-violet-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5">
              Войти в кабинет
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-violet-400" />
            <span>B2B Copilot для туризма</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8"
          >
            Чат-бот для <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              турагентств
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            ИИ-ассистент с интеграцией Слетать.ру. Подбирает туры, отвечает клиентам 24/7, прогревает лиды и передает готовые заявки менеджерам в WhatsApp и CRM.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard" className="w-full sm:w-auto bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
              Попробовать бесплатно <ArrowRight size={20} />
            </Link>
            <a href="#demo" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Смотреть демо
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Почему мы лучше CRM?</h2>
            <p className="text-white/50 text-lg">Мы не заставляем вас заполнять таблицы. Мы автоматизируем общение.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "ИИ-Копирайтер", desc: "Превращает сухой текст от туроператора в красивый продающий пост для WhatsApp за 1 секунду." },
              { icon: Zap, title: "Квалификация лидов", desc: "Бот сам узнает у клиента даты, бюджет и состав туристов, пока вы спите." },
              { icon: Globe, title: "Слетать.ру под капотом", desc: "Мгновенный поиск актуальных цен и туров по всем туроператорам прямо в чате." }
            ].map((f, i) => (
              <div key={i} className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-violet-500/50 transition-colors">
                <div className="w-14 h-14 bg-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mb-6">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Как это выглядит для клиента</h2>
              <p className="text-white/50 text-lg mb-8 leading-relaxed">
                Ваш клиент пишет в WhatsApp или Telegram. Бот моментально отвечает, задает правильные вопросы и предлагает варианты. Никакого ожидания ответа менеджера.
              </p>
              <ul className="space-y-4 mb-8">
                {['Отвечает за 2 секунды', 'Понимает голосовые сообщения', 'Присылает фото отелей', 'Передает контакты вам'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                    <CheckCircle2 size={20} className="text-violet-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-violet-500 hover:text-white transition-colors">
                Настроить своего бота <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 rounded-[40px] blur-3xl" />
              <div className="relative bg-[#1a1a1a] border border-white/10 rounded-[40px] p-6 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                  <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <div className="font-bold text-lg">Travel AI Бот</div>
                    <div className="text-xs text-green-400">В сети</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div className="flex justify-end">
                    <div className="bg-violet-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                      Хочу в Турцию в августе, 2 взрослых, бюджет 200к. Что посоветуете?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[#2a2a2a] text-white px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm">
                      Отличный выбор! Август — прекрасное время для Турции. 🌊<br/><br/>
                      Я подобрал для вас 3 отличных варианта в ваш бюджет:<br/><br/>
                      <b>1. Rixos Premium Belek 5*</b><br/>
                      Ультра всё включено. Шикарный пляж.<br/>
                      💰 195 000 ₽<br/><br/>
                      Оформить заявку на этот тур?
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <input type="text" placeholder="Написать сообщение..." className="w-full bg-[#2a2a2a] border border-white/10 rounded-full px-6 py-4 text-sm outline-none" disabled />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white" disabled>
                    <Send size={18} className="-ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">Частые вопросы</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  className="w-full px-6 py-5 text-left font-bold flex items-center justify-between"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown size={20} className={`text-white/50 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-white/60 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Простые тарифы</h2>
            <p className="text-white/50 text-lg">Окупается с первой проданной путевки</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Ассистент", price: "2 900 ₽", desc: "Квалификация лидов в Telegram/VK", features: ["Telegram/VK бот", "Сбор контактов", "Уведомления менеджеру"] },
              { name: "ПРО", price: "6 900 ₽", desc: "Интеграция с WhatsApp и саммари", features: ["Всё из Ассистента", "WhatsApp интеграция", "Распознавание аудио", "ИИ-Копирайтер"], popular: true },
              { name: "Премиум", price: "15 000 ₽", desc: "Полная автоматизация агентства", features: ["Всё из ПРО", "Интеграция с CRM", "Подбор туров Слетать.ру", "Персональный менеджер"] }
            ].map((plan, i) => (
              <div key={i} className={`bg-[#111] border ${plan.popular ? 'border-violet-500 scale-105 z-10' : 'border-white/10'} rounded-3xl p-8 relative`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Хит продаж</div>}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <div className="text-4xl font-black mb-4">{plan.price}<span className="text-lg text-white/40 font-normal">/мес</span></div>
                <p className="text-white/50 mb-8 h-12">{plan.desc}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 size={18} className="text-violet-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard" className={`block text-center w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-violet-500 hover:bg-violet-600 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                  Выбрать тариф
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-500 rounded flex items-center justify-center text-white font-black text-xs">T</div>
            <span className="font-black tracking-tighter">TRAVEL<span className="text-violet-500">AI</span></span>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 Travel AI. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
