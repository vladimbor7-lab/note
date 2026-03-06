import { useState, useRef, useEffect } from 'react';
import { Search, Send, Loader2, Calendar, MapPin, Users } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import ReactMarkdown from 'react-markdown';
import { HotelResults } from './HotelResults';
import { GoogleGenAI } from "@google/genai";
import { searchHotels } from '../services/travelpayouts';

interface SearchInterfaceProps {
  psychotype?: string;
  filters?: {
    maxPrice: number | null;
    stars: number[];
    amenities: string[];
  };
  onHotelsFound?: (hotels: any[]) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hotels?: any[];
}

export function SearchInterface({ psychotype = '', filters = { maxPrice: null, stars: [], amenities: [] }, onHotelsFound }: SearchInterfaceProps) {
  const [quickSearch, setQuickSearch] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep track of the last searched location to provide context for follow-up queries
  const [lastSearchLocation, setLastSearchLocation] = useState<string>('');
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick search - structured form
  const handleQuickSearch = async () => {
    if (!quickSearch.location || !quickSearch.checkIn || !quickSearch.checkOut) {
      alert('Пожалуйста, заполните все поля поиска');
      return;
    }

    let searchQuery = `Найди отель в ${quickSearch.location} с ${quickSearch.checkIn} по ${quickSearch.checkOut} для ${quickSearch.adults} взрослых`;
    
    if (filters.maxPrice) {
      searchQuery += ` с ценой до ${filters.maxPrice} рублей`;
    }
    
    await sendMessage(searchQuery);
  };

  // AI Chat search
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const claudeApiKey = localStorage.getItem('claudeApiKey');
    const travelpayoutsToken = localStorage.getItem('travelpayoutsToken');

    if (!claudeApiKey) {
      // Use Gemini for dynamic responses when no Claude key is set
      const userMessage: Message = { role: 'user', content: textToSend };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
      setIsStreaming(true);

      try {
        // Read settings from localStorage
        const savedSettings = localStorage.getItem('botSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        
        const systemPrompt = settings.systemPrompt || 'Ты - дружелюбный ИИ-турагент. Твоя цель - помочь туристу выбрать тур.';
        const tone = settings.tone || 'friendly';
        const useEmoji = settings.useEmoji !== false;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // 1. Analyze request to extract location and dates
        const analysisPrompt = `
          Extract search parameters from: "${textToSend}"
          Current date: ${new Date().toISOString().split('T')[0]}
          Previous context location: "${lastSearchLocation}"
          
          Return JSON:
          {
            "location": "City name (e.g. Moscow, Sochi). If not found in text, use '${lastSearchLocation}' or null.",
            "checkIn": "YYYY-MM-DD (default to tomorrow if not specified)",
            "checkOut": "YYYY-MM-DD (default to day after tomorrow if not specified)",
            "adults": number (default 2)
          }
        `;

        const analysisResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: analysisPrompt,
          config: { responseMimeType: "application/json" }
        });

        const analysis = JSON.parse(analysisResponse.text || '{}');
        console.log('Search analysis:', analysis);
        
        // Update context if a new location is found
        if (analysis.location) {
          setLastSearchLocation(analysis.location);
        }

        // 2. Fetch real/mock hotels from Travelpayouts service
        let hotels = [];
        try {
           const locationToSearch = analysis.location || lastSearchLocation || quickSearch.location || 'Moscow';
           // Ensure we update the context if we fell back to defaults
           if (locationToSearch && locationToSearch !== lastSearchLocation) {
             setLastSearchLocation(locationToSearch);
           }
           
           hotels = await searchHotels(
             locationToSearch,
             analysis.checkIn || quickSearch.checkIn,
             analysis.checkOut || quickSearch.checkOut,
             analysis.adults || 2,
             travelpayoutsToken || ''
           );
        } catch (e) {
           console.error("Failed to fetch hotels", e);
        }

        // 3. Generate response with hotels context
        const prompt = `
          ${systemPrompt}
          Tone: ${tone}.
          Use Emoji: ${useEmoji}.
          
          User Request: "${textToSend}"
          Found Hotels: ${JSON.stringify(hotels.slice(0, 3))}
          
          Task:
          1. Answer the user.
          2. Briefly mention the found hotels if any.
          3. Encourage them to book via the link.
          
          Output JSON format:
          {
            "message": "Your text response here..."
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const responseText = response.text;
        if (!responseText) throw new Error("No response from AI");
        
        const data = JSON.parse(responseText);

        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          hotels: hotels.length > 0 ? hotels : undefined
        };
        
        setMessages((prev) => [...prev, assistantMessage]);

      } catch (error: any) {
        console.error('Error with Gemini:', error);
        const errorMessage: Message = {
          role: 'assistant',
          content: `Извините, я сейчас не могу найти отели. Попробуйте позже. (${error.message})`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
      return;
    }

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c3625fc2/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: textToSend,
            psychotype,
            conversationHistory: messages,
            claudeApiKey,
            travelpayoutsToken: travelpayoutsToken || '',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        hotels: data.hotels
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Извините, произошла ошибка: ${error.message}. Пожалуйста, проверьте настройки API ключей.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Send className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">AI-ассистент</h3>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              Онлайн <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={() => setMessages([])}
            className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            Новый поиск
          </button>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Куда отправимся? 🌍</h2>
              <p className="text-gray-500 text-sm">Заполните параметры или просто напишите пожелания в чат</p>
            </div>

            {/* Quick Search Form - Integrated */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <div className="space-y-3">
                {/* Location */}
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Куда: Страна, город или отель"
                    value={quickSearch.location}
                    onChange={(e) => setQuickSearch({ ...quickSearch, location: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Check-in */}
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="date"
                      value={quickSearch.checkIn}
                      onChange={(e) => setQuickSearch({ ...quickSearch, checkIn: e.target.value })}
                      className="w-full pl-10 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-600"
                    />
                  </div>

                  {/* Check-out */}
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="date"
                      value={quickSearch.checkOut}
                      onChange={(e) => setQuickSearch({ ...quickSearch, checkOut: e.target.value })}
                      className="w-full pl-10 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-600"
                    />
                  </div>
                </div>

                {/* Adults */}
                <div className="relative group">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={quickSearch.adults}
                    onChange={(e) => setQuickSearch({ ...quickSearch, adults: Number(e.target.value) })}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'взрослый' : 'взрослых'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleQuickSearch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ищу варианты...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Найти туры
                  </>
                )}
              </button>
            </div>

            {/* Example queries */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Романтический отель в Сочи 🍷',
                'Турция все включено с детьми 👨‍👩‍👧‍👦',
                'Глэмпинг в Карелии 🌲',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 rounded-full transition-all shadow-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap markdown-content leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.hotels && msg.hotels.length > 0 && (
                    <div className="mt-4">
                      <HotelResults hotels={msg.hotels} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-xs text-gray-500 font-medium">Анализирую цены...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder={messages.length === 0 ? "Или напишите свой запрос..." : "Задайте уточняющий вопрос..."}
            className="flex-1 pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
