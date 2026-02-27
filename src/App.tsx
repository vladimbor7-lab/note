import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Globe, 
  Menu,
  X,
  ArrowRight,
  BarChart3,
  Layers,
  Sparkles,
  ChevronRight,
  Send,
  Search,
  MessageSquare,
  Users,
  MapPin,
  Calendar,
  Moon,
  Star,
  Coffee,
  Filter,
  ExternalLink,
  Hotel
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './components/SEO';
import { GoogleGenAI } from "@google/genai";

// --- Constants ---
const MODEL_NAME = "gemini-3-flash-preview";

let genAIClient: GoogleGenAI | null = null;
const getGenAI = () => {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it to your environment variables.");
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Платформа', href: '#platform' },
    { name: 'Демо', href: '#demo' },
    { name: 'Кейсы', href: '#customers' },
    { name: 'Тарифы', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-8'
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-tight"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black hover:bg-violet-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5">
            Начать работу
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-black text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="w-full bg-violet-500 text-white py-4 rounded-2xl font-black text-lg">
                Начать работу
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ label, title, centered = false }: { label: string, title: string, centered?: boolean }) => (
  <div className={centered ? 'text-center' : ''}>
    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
      <Sparkles size={12} className="text-violet-400" />
      <span>{label}</span>
    </div>
    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight uppercase">
      {title}
    </h2>
  </div>
);

// --- Main App ---

export default function App() {
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', plan: 'Pro' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Привет! Я Роман, ваш ИИ-ассистент. Я помогу вам подобрать идеальный тур с фото и подробностями. Куда отправимся?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    from: 'Москва',
    to: 'Турция',
    dateStart: '2026-02-27',
    dateEnd: '2026-03-08',
    nightsMin: 6,
    nightsMax: 14,
    adults: 2,
    children: 0,
    budget: 1500,
    stars: '4*',
    meals: 'Все включено',
    currency: 'EUR',
    flightType: 'Регулярный',
    beachLine: 'Любая',
    rating: '4.0+',
    operator: 'Все'
  });
  const [isSletatConnected, setIsSletatConnected] = useState(false);
  const [isSletatModalOpen, setIsSletatModalOpen] = useState(false);
  const [isSletatConnecting, setIsSletatConnecting] = useState(false);
  const [sletatConnectSuccess, setSletatConnectSuccess] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [sletatForm, setSletatForm] = useState({ login: '', password: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const agencyId = "ag_" + Math.random().toString(36).substring(2, 10);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add a hidden instruction to the first message or every message to ensure AI uses Markdown for images/links
    const instruction = "\n(Пожалуйста, отвечай в формате Markdown. Если предлагаешь отели, обязательно добавляй фото отеля в формате ![Название](ссылка_на_фото) и кнопку просмотра тура в формате [Learn more](https://example.com))";
    
    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = getGenAI();
      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: "Ты — Роман, профессиональный ИИ-ассистент для турагентств. Твоя цель — помогать клиентам подбирать идеальные туры. Отвечай вежливо, профессионально и на русском языке. Всегда используй Markdown для форматирования. Если предлагаешь отели, обязательно добавляй фото отеля в формате ![Название](ссылка_на_фото) и кнопку просмотра тура в формате [Learn more](https://example.com). Используй качественные фото отелей из интернета (например, с picsum.photos или других открытых источников)."
        },
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
      });

      const response = await chat.sendMessage({ message: text + instruction });
      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error.message?.includes('GEMINI_API_KEY') 
        ? 'Ошибка: Не настроен ключ API. Пожалуйста, добавьте GEMINI_API_KEY в настройки Vercel.'
        : 'Извините, произошла ошибка. Попробуйте позже.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSletatConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSletatConnecting(true);
    
    // Simulate API call and encryption
    setTimeout(() => {
      setIsSletatConnecting(false);
      setSletatConnectSuccess(true);
      
      // Close modal after showing success
      setTimeout(() => {
        setIsSletatConnected(true);
        setIsSletatModalOpen(false);
        setSletatConnectSuccess(false);
        setSletatForm({ login: '', password: '' });
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg selection:bg-violet-500 selection:text-white">
      <SEO 
        title="Travel AI | Платформа маркетинга на базе ИИ для турагентств"
        description="Масштабируйте свое турагентство с помощью ведущей в мире маркетинговой платформы на базе ИИ. Автоматизируйте ответы, оптимизируйте бронирования и растите 24/7."
      />
      
      <Navbar />

      <AnimatePresence>
        {isSletatModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSletatModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[3rem] p-10 border border-white/10 shadow-2xl overflow-hidden min-h-[450px] flex flex-col justify-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl -z-10" />
              
              <button 
                onClick={() => setIsSletatModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <AnimatePresence mode="wait">
                {isSletatConnecting ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-6" />
                    <h3 className="text-2xl font-black text-white mb-2">Проверка доступов...</h3>
                    <p className="text-white/50">Связываемся с серверами Слетать.ру</p>
                  </motion.div>
                ) : sletatConnectSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Демо-доступ активирован!</h3>
                    <p className="text-white/50 mb-6">Это демонстрационный режим. В реальной версии платформы здесь происходит проверка логина и пароля через официальный API Слетать.ру. Сейчас мы просто включили для вас отображение ссылок, чтобы вы могли оценить функционал.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Hotel className="text-violet-400" size={32} />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Подключить Слетать.ру</h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        Чтобы открыть тур и получить рабочие ссылки, подключите свой аккаунт Слетать.ру. Это займёт 30 секунд.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                          <Zap size={18} className="text-amber-400" />
                          Как это работает в реальности?
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">
                          В рабочей версии платформы здесь находятся поля для ввода логина и пароля от Слетать.ру. Агентство вводит свои данные один раз, мы надежно их шифруем (AES-256) и используем для генерации прямых ссылок на туры в чате.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-white/30 uppercase tracking-widest">
                          <span className="w-full h-px bg-white/10"></span>
                          Демо-режим
                          <span className="w-full h-px bg-white/10"></span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSletatConnect()}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3"
                      >
                        Понятно, включить демо-режим 🚀
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWidgetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWidgetModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[3rem] p-10 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl -z-10" />
              
              <button 
                onClick={() => setIsWidgetModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="text-violet-400" size={32} />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Код вашего виджета</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Скопируйте этот код и вставьте его перед закрывающим тегом <code className="bg-white/10 px-2 py-1 rounded text-violet-300">&lt;/head&gt;</code> на вашем сайте. Виджет автоматически привяжется к вашему агентству.
                </p>
              </div>

              <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/10 relative group">
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-white/30">HTML</div>
                <pre className="text-sm font-mono text-white/80 overflow-x-auto whitespace-pre-wrap">
                  <span className="text-fuchsia-400">&lt;script</span> <span className="text-violet-300">src</span>=<span className="text-emerald-300">"https://travelai.ru/widget.js"</span> <span className="text-violet-300">data-agency-id</span>=<span className="text-emerald-300">"{agencyId}"</span><span className="text-fuchsia-400">&gt;&lt;/script&gt;</span>
                </pre>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-black text-sm transition-all"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 md:pt-64 md:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[160px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white/80 text-xs font-bold mb-8 backdrop-blur-md">
              <Sparkles size={14} className="text-violet-400" />
              <span>ИИ НОВОГО ПОКОЛЕНИЯ ДЛЯ ТУРАГЕНТСТВ</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-10">
              AI-АССИСТЕНТ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 animate-gradient">ДЛЯ ТУРАГЕНТСТВ</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
              Умный помощник, который подбирает туры, отвечает клиентам 24/7, повышает конверсию и автоматизирует работу агентства.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white text-black px-10 py-5 rounded-full text-xl font-black hover:bg-violet-500 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-white/10"
              >
                Попробовать демо
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-white font-bold text-lg hover:text-violet-400 transition-colors flex items-center gap-2">
                Узнать больше <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section (Chat Bot + Filters) */}
      <section id="demo" className="py-32 px-6 bg-black/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#6d28d9,transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {!isSletatConnected && (
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl text-amber-400 text-sm font-bold mb-8 animate-pulse">
                <Zap size={16} />
                <span>Работаете в демо-режиме. Подключите аккаунт Слетать.ру для актуальных цен и ссылок.</span>
                <button 
                  onClick={() => setIsSletatModalOpen(true)}
                  className="ml-4 bg-amber-500 text-black px-4 py-1 rounded-lg text-xs font-black hover:bg-amber-400 transition-colors"
                >
                  Подключить
                </button>
              </div>
            )}
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
              УМНЫЙ ПОИСК И <span className="text-violet-500">AI-ПОДБОР</span>
            </h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
              Используйте фильтры для точного поиска или просто напишите Роману свои пожелания.
            </p>
          </div>

          {/* Search Filters Panel */}
          <div className="glass rounded-[2rem] p-8 mb-12 border border-white/10 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Откуда
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.from}
                  onChange={e => setSearchFilters({...searchFilters, from: e.target.value})}
                >
                  <option className="bg-zinc-900">Москва</option>
                  <option className="bg-zinc-900">Санкт-Петербург</option>
                  <option className="bg-zinc-900">Екатеринбург</option>
                  <option className="bg-zinc-900">Новосибирск</option>
                  <option className="bg-zinc-900">Казань</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} /> Куда
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.to}
                  onChange={e => setSearchFilters({...searchFilters, to: e.target.value})}
                >
                  <option className="bg-zinc-900">Турция</option>
                  <option className="bg-zinc-900">Египет</option>
                  <option className="bg-zinc-900">ОАЭ</option>
                  <option className="bg-zinc-900">Таиланд</option>
                  <option className="bg-zinc-900">Мальдивы</option>
                  <option className="bg-zinc-900">Куба</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Вылет (от-до)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[10px] text-white outline-none [color-scheme:dark]"
                    value={searchFilters.dateStart}
                    onChange={e => setSearchFilters({...searchFilters, dateStart: e.target.value})}
                  />
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[10px] text-white outline-none [color-scheme:dark]"
                    value={searchFilters.dateEnd}
                    onChange={e => setSearchFilters({...searchFilters, dateEnd: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Moon size={12} /> Ночей (от-до)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    value={searchFilters.nightsMin}
                    onChange={e => setSearchFilters({...searchFilters, nightsMin: parseInt(e.target.value)})}
                  />
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    value={searchFilters.nightsMax}
                    onChange={e => setSearchFilters({...searchFilters, nightsMax: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Users size={12} /> Взрослых
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.adults}
                  onChange={e => setSearchFilters({...searchFilters, adults: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5].map(n => <option key={n} className="bg-zinc-900" value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Users size={12} /> Детей
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.children}
                  onChange={e => setSearchFilters({...searchFilters, children: parseInt(e.target.value)})}
                >
                  {[0,1,2,3].map(n => <option key={n} className="bg-zinc-900" value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t border-white/5">
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                    Бюджет (до {searchFilters.budget} {searchFilters.currency})
                  </label>
                  <select 
                    className="bg-transparent text-[10px] font-black text-violet-400 uppercase outline-none"
                    value={searchFilters.currency}
                    onChange={e => setSearchFilters({...searchFilters, currency: e.target.value})}
                  >
                    <option className="bg-zinc-900">RUB</option>
                    <option className="bg-zinc-900">USD</option>
                    <option className="bg-zinc-900">EUR</option>
                  </select>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="100"
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  value={searchFilters.budget}
                  onChange={e => setSearchFilters({...searchFilters, budget: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Star size={12} /> Отель
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.stars}
                  onChange={e => setSearchFilters({...searchFilters, stars: e.target.value})}
                >
                  <option className="bg-zinc-900">Любые</option>
                  <option className="bg-zinc-900">3* и выше</option>
                  <option className="bg-zinc-900">4* и выше</option>
                  <option className="bg-zinc-900">5*</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Coffee size={12} /> Питание
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.meals}
                  onChange={e => setSearchFilters({...searchFilters, meals: e.target.value})}
                >
                  <option className="bg-zinc-900">Любое</option>
                  <option className="bg-zinc-900">Завтраки</option>
                  <option className="bg-zinc-900">Полупансион</option>
                  <option className="bg-zinc-900">Все включено</option>
                  <option className="bg-zinc-900">Ультра все вкл.</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} /> Рейс
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.flightType}
                  onChange={e => setSearchFilters({...searchFilters, flightType: e.target.value})}
                >
                  <option className="bg-zinc-900">Любой</option>
                  <option className="bg-zinc-900">Регулярный</option>
                  <option className="bg-zinc-900">Чартер</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={12} /> Рейтинг
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.rating}
                  onChange={e => setSearchFilters({...searchFilters, rating: e.target.value})}
                >
                  <option className="bg-zinc-900">Любой</option>
                  <option className="bg-zinc-900">3.5+</option>
                  <option className="bg-zinc-900">4.0+</option>
                  <option className="bg-zinc-900">4.5+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-6 border-t border-white/5 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  Пляжная линия
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.beachLine}
                  onChange={e => setSearchFilters({...searchFilters, beachLine: e.target.value})}
                >
                  <option className="bg-zinc-900">Любая</option>
                  <option className="bg-zinc-900">1-я линия</option>
                  <option className="bg-zinc-900">2-я линия</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                  Оператор
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                  value={searchFilters.operator}
                  onChange={e => setSearchFilters({...searchFilters, operator: e.target.value})}
                >
                  <option className="bg-zinc-900">Все</option>
                  <option className="bg-zinc-900">Coral Travel</option>
                  <option className="bg-zinc-900">Anex Tour</option>
                  <option className="bg-zinc-900">Pegas Touristik</option>
                  <option className="bg-zinc-900">Tez Tour</option>
                  <option className="bg-zinc-900">Biblio Globus</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <button 
                  onClick={() => {
                    const filterSummary = `Подобрать тур: из ${searchFilters.from} в ${searchFilters.to}, вылет ${searchFilters.dateStart} - ${searchFilters.dateEnd}, на ${searchFilters.nightsMin}-${searchFilters.nightsMax} ночей, ${searchFilters.adults} взр. + ${searchFilters.children} реб., бюджет до ${searchFilters.budget} ${searchFilters.currency}, отель ${searchFilters.stars}, питание ${searchFilters.meals}, рейтинг ${searchFilters.rating}, ${searchFilters.beachLine} пляжная линия.`;
                    handleSendMessage(filterSummary);
                  }}
                  className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2 group"
                >
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  Отправить параметры в чат
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">
                ПОЗНАКОМЬТЕСЬ С <span className="text-violet-500">РОМАНОМ</span>
              </h2>
              <p className="text-xl text-white/60 mb-10 font-medium">
                Наш ИИ-ассистент мгновенно подбирает туры, отвечает на вопросы о отелях и собирает данные для менеджеров. Попробуйте прямо сейчас!
              </p>
              <div className="space-y-6">
                {[
                  'Ответ за 10 секунд',
                  'Интеграция с базой Sletat',
                  'Автоматический сбор параметров тура',
                  'Передача горячих лидов в CRM'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80">
                    <div className="w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 glass rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Filter size={18} className="text-violet-400" />
                  <span className="text-white font-black uppercase text-xs tracking-widest">Активные фильтры</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(searchFilters).map(([key, val]) => (
                    <span key={key} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-bold">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-[3rem] p-1 overflow-hidden shadow-2xl shadow-violet-500/10 border border-white/10">
              <div className="bg-white/5 p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                    <Hotel size={20} />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">Роман</div>
                    <div className="text-violet-400 text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                      Онлайн
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${
                      msg.role === 'user' 
                        ? 'bg-violet-600 text-white rounded-tr-none' 
                        : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                    }`}>
                      <div className="markdown-body prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => {
                              const hasDiv = React.Children.toArray(children).some(
                                (child) => React.isValidElement(child) && (child.type === 'div' || (typeof child.type === 'string' && child.type === 'div'))
                              );
                              return hasDiv ? <div className="mb-4 last:mb-0">{children}</div> : <p className="mb-4 last:mb-0">{children}</p>;
                            },
                            img: ({ src, alt }) => (
                              <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-black/20 group relative">
                                <img 
                                  src={src} 
                                  alt={alt} 
                                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" 
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                  <Star size={10} className="text-amber-400 fill-amber-400" />
                                  <span className="text-[10px] font-black">4.8</span>
                                </div>
                              </div>
                            ),
                            a: ({ href, children }) => (
                              <button 
                                onClick={(e) => {
                                  if (!isSletatConnected) {
                                    e.preventDefault();
                                    setIsSletatModalOpen(true);
                                  } else {
                                    window.open(href, '_blank');
                                  }
                                }}
                                className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 px-4 py-2 rounded-xl transition-all mt-2 no-underline border border-violet-500/30 font-black text-[10px] uppercase tracking-widest cursor-pointer"
                              >
                                {children || 'Learn more'} <ExternalLink size={12} />
                              </button>
                            )
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const filterSummary = `Подобрать тур: из ${searchFilters.from} в ${searchFilters.to}, вылет ${searchFilters.dateStart} - ${searchFilters.dateEnd}, на ${searchFilters.nightsMin}-${searchFilters.nightsMax} ночей, ${searchFilters.adults} взр. + ${searchFilters.children} реб., бюджет до ${searchFilters.budget} ${searchFilters.currency}, отель ${searchFilters.stars}, питание ${searchFilters.meals}, рейтинг ${searchFilters.rating}, ${searchFilters.beachLine} пляжная линия.`;
                      handleSendMessage(filterSummary);
                    }}
                    className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg hover:bg-violet-500/20 transition-colors flex items-center gap-2"
                  >
                    <Filter size={12} /> Применить фильтры
                  </button>
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-white/20"
                    placeholder="Напишите сообщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  />
                  <button 
                    onClick={() => handleSendMessage(inputValue)}
                    className="w-12 h-12 bg-violet-500 text-white rounded-xl flex items-center justify-center hover:bg-violet-600 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="platform" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">Что умеет ассистент</h2>
              <div className="space-y-8">
                <div className="glass p-8 rounded-3xl border border-white/10">
                  <ul className="grid grid-cols-1 gap-4 text-white/70 font-medium">
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Подбор туров по 20+ параметрам: страна, даты, бюджет, отели, питание, рейтинг, авиакомпании.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Ответы на вопросы клиентов в режиме 24/7.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Сбор контактов и передача заявок менеджеру.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Работа с возражениями и уточняющими вопросами.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Создание персональных подборок.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Рекомендации по странам, сезонам, отелям.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Объяснение условий: визы, страховка, перелёт, багаж.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-violet-500 mt-1 shrink-0" /> Поддержка клиентов до и после покупки.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">Примеры диалогов</h2>
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="self-end bg-violet-600 text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                    Хочу тур в Турцию на 7–10 дней, бюджет до 1500€.
                  </div>
                  <div className="self-start bg-white/10 text-white/90 p-4 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-white/5">
                    Отлично! Уточните, пожалуйста, вылет из какого города и сколько человек?
                  </div>
                  <div className="self-end bg-violet-600 text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                    2 взрослых, вылет из Хельсинки.
                  </div>
                  <div className="self-start bg-white/10 text-white/90 p-4 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-white/5">
                    Подобрал 3 варианта отелей 4–5★ в вашем бюджете. Хотите посмотреть?
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-fuchsia-400 font-black mb-4 uppercase text-sm tracking-widest">Почему это лучше обычного чат-бота</h4>
                  <ul className="space-y-2 text-white/50 text-xs font-bold">
                    <li>• Понимает контекст и ведёт диалог как живой менеджер</li>
                    <li>• Делает подборы, а не просто отвечает</li>
                    <li>• Обучается на данных агентства</li>
                    <li>• Не требует скриптов и ручной настройки</li>
                    <li>• Работает стабильно и предсказуемо</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">Для кого создан этот ассистент</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Турагентства', desc: 'Которые хотят увеличить поток заявок.' },
              { title: 'Менеджеры', desc: 'Которым нужно разгрузить рутину.' },
              { title: 'Владельцы', desc: 'Стремящиеся к автоматизации.' },
              { title: 'Онлайн-агентства', desc: 'Которым нужен AI-бот на сайт или в Telegram.' },
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/10 text-center">
                <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide Section */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">Интеграция за 15 минут</h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
              Travel AI легко встраивается в ваши текущие бизнес-процессы.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: 'Telegram-бот',
                desc: 'Создайте бота в BotFather и вставьте токен в нашу панель. Ассистент начнет отвечать мгновенно.',
                icon: <MessageSquare className="text-sky-400" />,
                status: 'Активно'
              },
              {
                title: 'Виджет на сайт',
                desc: 'Просто добавьте одну строку JS-кода в <head> вашего сайта. Полная кастомизация под ваш бренд.',
                icon: <Search className="text-violet-400" />,
                status: 'Активно',
                action: () => setIsWidgetModalOpen(true),
                actionText: 'Сгенерировать код'
              },
              {
                title: 'CRM (передача заявок)',
                desc: 'Автоматическая передача лидов в AmoCRM, Bitrix24 или U-ON. Все данные клиента в карточке.',
                icon: <Layers className="text-fuchsia-400" />,
                status: 'Активно'
              },
              {
                title: 'Слетать.ру',
                desc: 'Актуальные цены, рабочие ссылки, подбор туров и бронирование через официальный API.',
                icon: <Hotel className="text-amber-400" />,
                status: isSletatConnected ? 'Подключено' : 'Не подключено',
                action: !isSletatConnected ? () => setIsSletatModalOpen(true) : undefined
              }
            ].map((step, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all group relative">
                <div className="absolute top-6 right-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    step.status === 'Активно' || step.status === 'Подключено' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {step.status}
                  </span>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{step.desc}</p>
                {step.action && (
                  <button 
                    onClick={step.action}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-xs font-black transition-all border border-white/10"
                  >
                    {step.actionText || 'Подключить'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Bento Grid Features (Benefits) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
              Преимущества для бизнеса
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 glass rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-3xl -z-10 group-hover:bg-violet-500/20 transition-colors" />
              <div>
                <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="text-violet-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Рост конверсии</h3>
                <p className="text-lg text-white/50 max-w-md">
                  Рост конверсии до 40% за счёт мгновенных ответов. Клиент получает ответ за 10 секунд.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    className="h-full bg-violet-500"
                  />
                </div>
                <span className="text-sm font-black text-violet-400 whitespace-nowrap">+40% Конверсия</span>
              </div>
            </div>

            <div className="md:col-span-4 glass rounded-[3rem] p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8">
                <Clock className="text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Снижение нагрузки</h3>
              <p className="text-white/50">
                Снижение нагрузки на менеджеров. Автоматизация первичного общения разгружает от рутины.
              </p>
            </div>

            <div className="md:col-span-4 glass rounded-[3rem] p-10 flex flex-col justify-between">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8">
                <Users className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Повышение доверия</h3>
                <p className="text-white/50">
                  Профессиональные и быстрые ответы повышают доверие клиентов.
                </p>
              </div>
            </div>

            <div className="md:col-span-8 glass rounded-[3rem] p-12 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-14 h-14 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-8">
                  <Globe className="text-fuchsia-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Работа 24/7</h3>
                <p className="text-lg text-white/50">
                  Ваше агентство работает без выходных и праздников, захватывая ночной трафик.
                </p>
              </div>
              <div className="relative h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
                <Sparkles className="text-white/20 w-24 h-24 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            label="Процесс" 
            title="Как работает ассистент" 
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-20">
            {[
              { n: '01', t: 'Запрос', d: 'Клиент пишет запрос или вопрос.' },
              { n: '02', t: 'Уточнение', d: 'Ассистент уточняет детали и предлагает варианты.' },
              { n: '03', t: 'Выбор', d: 'Клиент выбирает подходящий тур.' },
              { n: '04', t: 'Лид', d: 'Ассистент собирает контакты.' },
              { n: '05', t: 'Сделка', d: 'Заявка передаётся менеджеру для закрытия сделки.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-white/5 mb-4">{step.n}</div>
                <h4 className="text-xl font-black text-white mb-2">{step.t}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{step.d}</p>
                {i < 4 && <div className="hidden md:block absolute top-6 -right-4 text-white/10"><ChevronRight size={24} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div>
              <div className="text-8xl font-black tracking-tighter mb-4">10с</div>
              <div className="text-xl font-bold text-black/40 uppercase tracking-widest">Время ответа</div>
              <p className="mt-4 text-lg text-black/60">Мгновенное вовлечение, которое удерживает клиентов от ухода к конкурентам.</p>
            </div>
            <div>
              <div className="text-8xl font-black tracking-tighter mb-4">24/7</div>
              <div className="text-xl font-bold text-black/40 uppercase tracking-widest">Доступность</div>
              <p className="mt-4 text-lg text-black/60">Ваше агентство никогда не спит. Собирайте лиды, пока ваша команда отдыхает.</p>
            </div>
            <div>
              <div className="text-8xl font-black tracking-tighter mb-4">3ч</div>
              <div className="text-xl font-bold text-black/40 uppercase tracking-widest">Экономия времени</div>
              <p className="mt-4 text-lg text-black/60">Освободите своих менеджеров для закрытия сделок, а не для ввода данных.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/30 rounded-full blur-[180px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-12 uppercase">
            ГОТОВЫ ПРОТЕСТИРОВАТЬ?
          </h2>
          <p className="text-xl text-white/60 mb-12 font-medium">
            Напишите любой запрос — ассистент ответит как реальный менеджер турагентства.
          </p>
          <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-2xl">
            {!isSubmitted ? (
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-white/20"
                    placeholder="Название агентства"
                    value={leadForm.name}
                    onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-white/20"
                    placeholder="Телефон / Telegram"
                    value={leadForm.phone}
                    onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  />
                </div>
                <button className="w-full bg-violet-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-violet-600 shadow-2xl shadow-violet-500/20 transition-all">
                  Начать сейчас
                </button>
                <p className="text-white/30 text-sm font-medium">
                  Присоединяйтесь к 100+ агентствам, растущим с Travel AI.
                </p>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Успех!</h3>
                <p className="text-white/60 text-xl mb-10">Наша команда свяжется с вами в течение 24 часов для настройки пилота.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-violet-400 font-black text-lg hover:text-white transition-colors"
                >
                  Вернуться назад
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                  T
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  TRAVEL<span className="text-violet-500">AI</span>
                </span>
              </div>
              <p className="text-white/40 leading-relaxed font-medium">
                Маркетинговая платформа на базе ИИ для туристических агентств нового поколения.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Платформа</h4>
                <ul className="space-y-4 text-white/40 text-sm font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Функции</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Интеграции</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Компания</h4>
                <ul className="space-y-4 text-white/40 text-sm font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Клиенты</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Юридическая информация</h4>
                <ul className="space-y-4 text-white/40 text-sm font-bold">
                  <li><a href="#" className="hover:text-white transition-colors">Конфиденциальность</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Условия</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Безопасность</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white/20 text-xs font-black uppercase tracking-widest">
              © 2026 Travel AI. Все права защищены.
            </div>
            <div className="flex gap-8">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <a key={social} href="#" className="text-white/20 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
