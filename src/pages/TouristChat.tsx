import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { generateTravelResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  links?: { title: string; uri: string }[];
}

export const TouristChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! 👋 Я твой **ИИ-помощник по турам**. \n\nРаботаю с базой **sletat.ru**. Куда хочешь махнуть? ✈️\n\n*(Демо: цены примерные, ссылок нет)*' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    budget: 200000,
    nights: 7,
    destination: '',
    departureCity: 'Москва',
    meals: 'all',
    stars: 'any',
    hotelRating: 4.0,
    adults: 2,
    children: 0,
    beachType: 'any',
    wifi: false,
    firstLine: false,
    pool: false,
    allInclusive: false,
    aquaPark: false,
    kidsClub: false,
    heatedPool: false,
    gym: false,
    sortBy: 'popular',
    pricePerPerson: false,
    directFlight: false,
    baggage: true,
    beachDistance: 'any',
    roomType: 'any',
    spa: false,
    animation: false,
    searchType: 'tours', // 'tours' | 'hotels'
    isHot: false,
    dateStart: '2026-03-03',
    dateEnd: '2026-03-12',
    nightsMin: 6,
    nightsMax: 14,
    flightClass: 'economy'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('botSettings');
    if (savedSettings) {
      const { welcomeMessage } = JSON.parse(savedSettings);
      if (welcomeMessage) {
        setMessages([{ role: 'assistant', content: welcomeMessage }]);
      }
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const userMessage = messageToSend;
    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Get settings
      const savedSettings = localStorage.getItem('botSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      const systemPrompt = settings.systemPrompt || `
        Ты - профессиональный ИИ-турагент (база sletat.ru). 
        Оформляй ответы КРАСИВО и структурировано:
        - Используй жирный шрифт для названий отелей и цен.
        - Используй списки для перечисления преимуществ.
        - Добавляй подходящие эмодзи.
        - Пиши живым, человечным языком, но профессионально.
        - В конце всегда напоминай про демо-режим, примерные цены и отсутствие ссылок.

        ВАЖНО: Если турист в своем сообщении явно указывает новые параметры (например, "смени бюджет на 100к" или "хочу в Турцию"), ПРИОРИТЕТИЗИРУЙ это над текущими фильтрами из контекста. Подтверждай, что ты учел новые пожелания.
      `;
      const tone = settings.tone || 'friendly';
      const useEmoji = settings.useEmoji !== undefined ? settings.useEmoji : true;

      const prompt = `
        ${systemPrompt}
        
        Настройки тона: ${tone}
        Использовать эмодзи: ${useEmoji ? 'Да' : 'Нет'}

        ТЕКУЩИЕ ФИЛЬТРЫ ТУРИСТА (учитывай их при подборе):
        - Тип поиска: ${filters.searchType === 'tours' ? 'Туры с перелетом' : 'Только отели'}
        - Горящие туры: ${filters.isHot ? 'ДА' : 'Нет'}
        - Город вылета: ${filters.departureCity}
        - Даты вылета: с ${filters.dateStart} по ${filters.dateEnd}
        - Ночей: от ${filters.nightsMin} до ${filters.nightsMax}
        - Класс перелета: ${filters.flightClass === 'economy' ? 'Эконом' : 'Бизнес'}
        - Бюджет: до ${filters.budget} руб.
        - Направление: ${filters.destination || 'Не указано'}
        - Питание: ${filters.meals}
        - Звездность: ${filters.stars}
        - Мин. рейтинг отеля: ${filters.hotelRating}
        - Гости: ${filters.adults} взр, ${filters.children} дет.
        - Тип пляжа: ${filters.beachType === 'any' ? 'Любой' : filters.beachType}
        - Сортировка: ${filters.sortBy}
        - Цена указана за: ${filters.pricePerPerson ? 'человека' : 'весь тур'}
        - Прямой рейс: ${filters.directFlight ? 'Да' : 'Нет'}
        - Багаж: ${filters.baggage ? 'Включен' : 'Нет'}
        - Расстояние до пляжа: ${filters.beachDistance}
        - Тип номера: ${filters.roomType}
        - Доп. условия: ${[
          filters.wifi ? 'Wi-Fi' : '',
          filters.firstLine ? 'Первая линия' : '',
          filters.pool ? 'Бассейн' : '',
          filters.allInclusive ? 'Все включено' : '',
          filters.aquaPark ? 'Аквапарк' : '',
          filters.kidsClub ? 'Детский клуб' : '',
          filters.heatedPool ? 'Подогреваемый бассейн' : '',
          filters.gym ? 'Тренажерный зал' : '',
          filters.spa ? 'Спа и велнес' : '',
          filters.animation ? 'Анимация' : ''
        ].filter(Boolean).join(', ') || 'Нет'}

        История диалога:
        ${messages.map(m => `${m.role === 'user' ? 'Турист' : 'Ассистент'}: ${m.content}`).join('\n')}
        Турист: ${userMessage}
        
        Отвечай кратко, по делу. Опирайся на базу sletat.ru.
      `;

      const reply = await generateTravelResponse(prompt);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: reply
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, произошла ошибка. Попробуйте еще раз.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Demo Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-[10px] sm:text-xs text-amber-700 font-medium">
          ⚠️ Режим демонстрации: данные о ценах и вылетах могут быть неактуальны.
        </p>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="font-bold text-slate-900">Менеджер для туристов (Sletat.ru)</h1>
          <p className="text-xs text-slate-500">Онлайн • Отвечает мгновенно</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showFilters ? 'Закрыть фильтры' : 'Фильтры'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Filter Sidebar */}
        <div className={`${showFilters ? 'w-full sm:w-80 border-r' : 'w-0'} bg-white transition-all duration-300 overflow-y-auto overflow-x-hidden flex-shrink-0 z-20 absolute sm:relative h-full shadow-xl sm:shadow-none`}>
          <div className="p-4 space-y-6 w-full sm:w-80">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <span>🎯</span> Параметры
              </h2>
              <button 
                onClick={() => setFilters({
                  budget: 200000,
                  nights: 7,
                  destination: '',
                  departureCity: 'Москва',
                  meals: 'all',
                  stars: 'any',
                  hotelRating: 4.0,
                  adults: 2,
                  children: 0,
                  beachType: 'any',
                  wifi: false,
                  firstLine: false,
                  pool: false,
                  allInclusive: false,
                  aquaPark: false,
                  kidsClub: false,
                  heatedPool: false,
                  gym: false,
                  sortBy: 'popular',
                  pricePerPerson: false,
                  directFlight: false,
                  baggage: true,
                  beachDistance: 'any',
                  roomType: 'any',
                  spa: false,
                  animation: false,
                  searchType: 'tours',
                  isHot: false,
                  dateStart: '2026-03-03',
                  dateEnd: '2026-03-12',
                  nightsMin: 6,
                  nightsMax: 14,
                  flightClass: 'economy'
                })}
                className="text-[10px] text-blue-600 hover:underline"
              >
                Сбросить
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Search Type Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setFilters({...filters, searchType: 'tours'})}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${filters.searchType === 'tours' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Туры
                </button>
                <button 
                  onClick={() => setFilters({...filters, searchType: 'hotels'})}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${filters.searchType === 'hotels' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Отели
                </button>
              </div>

              {/* Hot Tours Toggle */}
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-xs font-medium text-orange-700 flex items-center gap-1">
                  <span>🔥</span> Горящие туры
                </span>
                <button 
                  onClick={() => setFilters({...filters, isHot: !filters.isHot})}
                  className={`w-10 h-5 rounded-full transition-colors relative ${filters.isHot ? 'bg-orange-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filters.isHot ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Departure City */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Город вылета</label>
                <select 
                  value={filters.departureCity}
                  onChange={(e) => setFilters({...filters, departureCity: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Москва">Москва</option>
                  <option value="Екатеринбург">Екатеринбург</option>
                  <option value="Санкт-Петербург">Санкт-Петербург</option>
                  <option value="Казань">Казань</option>
                  <option value="Новосибирск">Новосибирск</option>
                  <option value="Самара">Самара</option>
                  <option value="Уфа">Уфа</option>
                  <option value="Тюмень">Тюмень</option>
                  <option value="Челябинск">Челябинск</option>
                  <option value="Сочи">Сочи</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-400 uppercase">Вылет с</label>
                  <input 
                    type="date" 
                    value={filters.dateStart}
                    onChange={(e) => setFilters({...filters, dateStart: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-400 uppercase">По</label>
                  <input 
                    type="date" 
                    value={filters.dateEnd}
                    onChange={(e) => setFilters({...filters, dateEnd: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Nights Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ночей: {filters.nightsMin} - {filters.nightsMax}</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={filters.nightsMin}
                    onChange={(e) => setFilters({...filters, nightsMin: parseInt(e.target.value)})}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={filters.nightsMax}
                    onChange={(e) => setFilters({...filters, nightsMax: parseInt(e.target.value)})}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Flight Class */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Класс</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFilters({...filters, flightClass: 'economy'})}
                    className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-all ${filters.flightClass === 'economy' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Эконом
                  </button>
                  <button 
                    onClick={() => setFilters({...filters, flightClass: 'business'})}
                    className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-all ${filters.flightClass === 'business' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Бизнес
                  </button>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Бюджет: {filters.budget.toLocaleString()} ₽</label>
                <input 
                  type="range" 
                  min="30000" 
                  max="1000000" 
                  step="10000"
                  value={filters.budget}
                  onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Nights */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ночей: {filters.nights}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={filters.nights}
                  onChange={(e) => setFilters({...filters, nights: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Куда летим?</label>
                <input 
                  type="text"
                  placeholder="Страна, город..."
                  value={filters.destination}
                  onChange={(e) => setFilters({...filters, destination: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Hotel Rating */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Рейтинг отеля: от {filters.hotelRating}</label>
                <input 
                  type="range" 
                  min="3.0" 
                  max="5.0" 
                  step="0.1"
                  value={filters.hotelRating}
                  onChange={(e) => setFilters({...filters, hotelRating: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Stars */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Звездность</label>
                <div className="flex gap-2">
                  {['any', '3', '4', '5'].map(star => (
                    <button
                      key={star}
                      onClick={() => setFilters({...filters, stars: star})}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        filters.stars === star 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {star === 'any' ? 'Все' : `${star}*`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Взрослых</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={filters.adults}
                    onChange={(e) => setFilters({...filters, adults: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Детей</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="10"
                    value={filters.children}
                    onChange={(e) => setFilters({...filters, children: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Питание</label>
                <select 
                  value={filters.meals}
                  onChange={(e) => setFilters({...filters, meals: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Любое</option>
                  <option value="RO">Без питания (RO)</option>
                  <option value="BB">Завтраки (BB)</option>
                  <option value="HB">Завтрак + ужин (HB)</option>
                  <option value="FB">Полный пансион (FB)</option>
                  <option value="AI">Все включено (AI)</option>
                  <option value="UAI">Ультра все включено (UAI)</option>
                </select>
              </div>

              {/* Beach Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Тип пляжа</label>
                <select 
                  value={filters.beachType}
                  onChange={(e) => setFilters({...filters, beachType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="any">Любой</option>
                  <option value="песок">Песчаный</option>
                  <option value="галька">Галечный</option>
                  <option value="песчано-галечный">Песчано-галечный</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Сортировать по</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="popular">Популярности</option>
                  <option value="price">Цене (сначала дешевле)</option>
                  <option value="rating">Рейтингу</option>
                </select>
              </div>

              {/* Price Mode */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Цена за человека</span>
                <button 
                  onClick={() => setFilters({...filters, pricePerPerson: !filters.pricePerPerson})}
                  className={`w-10 h-5 rounded-full transition-colors relative ${filters.pricePerPerson ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filters.pricePerPerson ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Beach Distance */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">До пляжа</label>
                <select 
                  value={filters.beachDistance}
                  onChange={(e) => setFilters({...filters, beachDistance: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="any">Любое</option>
                  <option value="<100m">&lt; 100м</option>
                  <option value="<500m">&lt; 500м</option>
                  <option value="<1km">&lt; 1км</option>
                </select>
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Тип номера</label>
                <select 
                  value={filters.roomType}
                  onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="any">Любой</option>
                  <option value="standard">Стандарт</option>
                  <option value="deluxe">Делюкс</option>
                  <option value="family">Семейный</option>
                </select>
              </div>

              {/* Advanced */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Дополнительно</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'wifi', label: 'Wi-Fi в номере', icon: '📶' },
                    { id: 'firstLine', label: 'Первая линия', icon: '🏖️' },
                    { id: 'pool', label: 'Бассейн', icon: '🏊' },
                    { id: 'allInclusive', label: 'Все включено', icon: '🍹' },
                    { id: 'aquaPark', label: 'Аквапарк', icon: '🎢' },
                    { id: 'kidsClub', label: 'Детский клуб', icon: '👶' },
                    { id: 'heatedPool', label: 'Подогрев бассейна', icon: '🔥' },
                    { id: 'gym', label: 'Тренажерный зал', icon: '💪' },
                    { id: 'spa', label: 'Спа и велнес', icon: '🧖' },
                    { id: 'animation', label: 'Анимация', icon: '🎭' },
                    { id: 'directFlight', label: 'Только прямой рейс', icon: '✈️' },
                    { id: 'baggage', label: 'Багаж включен', icon: '🧳' }
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={(filters as any)[item.id]}
                        onChange={(e) => setFilters({...filters, [item.id]: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {item.icon} {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const filterSummary = `Обновил фильтры: ${filters.searchType === 'tours' ? 'Туры' : 'Отели'}, ${filters.isHot ? 'ГОРЯЩИЕ! ' : ''}Вылет из ${filters.departureCity}, ${filters.destination || 'Любое направление'}, Даты: ${filters.dateStart}-${filters.dateEnd}, ${filters.nightsMin}-${filters.nightsMax} ночей, ${filters.adults}+${filters.children} чел, Класс: ${filters.flightClass}, Бюджет: ${filters.budget}₽, Питание: ${filters.meals}, Звезды: ${filters.stars}*, Рейтинг: ${filters.hotelRating}+, Пляж: ${filters.beachType}, До пляжа: ${filters.beachDistance}, Номер: ${filters.roomType}, Сорт: ${filters.sortBy}, Цена за: ${filters.pricePerPerson ? 'чел' : 'тур'}. Доп: ${[
                  filters.wifi ? 'Wi-Fi' : '',
                  filters.firstLine ? '1-я линия' : '',
                  filters.pool ? 'бассейн' : '',
                  filters.allInclusive ? 'AI' : '',
                  filters.aquaPark ? 'аквапарк' : '',
                  filters.kidsClub ? 'детский клуб' : '',
                  filters.heatedPool ? 'подогрев' : '',
                  filters.gym ? 'зал' : '',
                  filters.spa ? 'спа' : '',
                  filters.animation ? 'анимация' : '',
                  filters.directFlight ? 'прямой рейс' : '',
                  filters.baggage ? 'багаж' : ''
                ].filter(Boolean).join(', ') || 'нет'}. Что предложишь?`;
                handleSend(filterSummary);
                if (window.innerWidth < 640) setShowFilters(false);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <span>🚀</span> Применить и отправить
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 p-4 overflow-y-auto w-full space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                <div className={`markdown-content ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className={`font-bold ${msg.role === 'user' ? 'text-white underline' : 'text-blue-600'}`} {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mb-1" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              {msg.links && msg.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.links.map((link, lIdx) => (
                    <a 
                      key={lIdx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      <span>🔗</span> {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Quick Filter Info */}
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] flex items-center gap-1">
                <span>🛫</span> {filters.departureCity}
              </div>
              {filters.isHot && (
                <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-[10px] flex items-center gap-1 animate-pulse">
                  <span>🔥</span> Горящий
                </div>
              )}
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                <span>💰</span> {filters.budget.toLocaleString()}₽
              </div>
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                <span>🌙</span> {filters.nightsMin}-{filters.nightsMax}н
              </div>
              {filters.destination && (
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] flex items-center gap-1">
                  <span>📍</span> {filters.destination}
                </div>
              )}
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                <span>🍽️</span> {filters.meals}
              </div>
              {filters.stars !== 'any' && (
                <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                  <span>⭐</span> {filters.stars}*
                </div>
              )}
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                <span>📈</span> {filters.hotelRating}+
              </div>
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-500 flex items-center gap-1">
                <span>📅</span> {filters.dateStart}
              </div>
              {filters.directFlight && (
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] flex items-center gap-1">
                  <span>✈️</span> Прямой
                </div>
              )}
              {filters.baggage && (
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] flex items-center gap-1">
                  <span>🧳</span> Багаж
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение или измените фильтры (напр. 'бюджет 100к')..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
