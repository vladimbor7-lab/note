import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, Moon, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchWidget = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('Москва');
  const [to, setTo] = useState('Турция');
  const [date, setDate] = useState('15.10');
  const [nights, setNights] = useState('7-10');
  const [tourists, setTourists] = useState('2 взр');
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setResults(null);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setResults([
        { id: 1, name: 'Rixos Premium Belek', stars: 5, price: '320 000', rating: 4.9, image: 'https://picsum.photos/seed/rixos/400/200', location: 'Белек, Турция' },
        { id: 2, name: 'Alva Donna Exclusive', stars: 5, price: '245 000', rating: 4.8, image: 'https://picsum.photos/seed/alva/400/200', location: 'Белек, Турция' },
        { id: 3, name: 'Nirvana Cosmopolitan', stars: 5, price: '280 000', rating: 4.7, image: 'https://picsum.photos/seed/nirvana/400/200', location: 'Анталья, Турция' },
      ]);
    }, 1500);
  };

  const Dropdown = ({ title, value, options, onSelect, icon: Icon, name }: any) => (
    <div className="relative">
      <div 
        onClick={() => toggleDropdown(name)}
        className={`bg-slate-50 p-3 rounded-xl border transition-all cursor-pointer group hover:border-blue-400 ${openDropdown === name ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
      >
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 font-bold">
          <Icon size={10} /> {title}
        </div>
        <div className="font-bold text-slate-900 text-sm truncate flex items-center justify-between">
          {value}
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openDropdown === name ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {openDropdown === name && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt: string) => (
            <div 
              key={opt} 
              onClick={() => { onSelect(opt); setOpenDropdown(null); }}
              className="px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between"
            >
              {opt}
              {value === opt && <Check size={14} className="text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
        
        {/* Inputs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Dropdown 
            name="from"
            title="Откуда" 
            value={from} 
            icon={MapPin}
            options={['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Новосибирск']} 
            onSelect={setFrom} 
          />
          <Dropdown 
            name="to"
            title="Куда" 
            value={to} 
            icon={MapPin}
            options={['Турция', 'Египет', 'ОАЭ', 'Таиланд', 'Мальдивы']} 
            onSelect={setTo} 
          />
          <Dropdown 
            name="date"
            title="Вылет" 
            value={date} 
            icon={Calendar}
            options={['15.10', '20.10', '01.11', '10.11', '30.12']} 
            onSelect={setDate} 
          />
          <Dropdown 
            name="nights"
            title="Ночей" 
            value={nights} 
            icon={Moon}
            options={['6-8', '7-10', '9-12', '14+']} 
            onSelect={setNights} 
          />
          <Dropdown 
            name="tourists"
            title="Туристы" 
            value={tourists} 
            icon={Users}
            options={['2 взр', '2 взр + 1 реб', '2 взр + 2 реб', '1 взр']} 
            onSelect={setTourists} 
          />
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Ищем туры...
            </div>
          ) : (
            <>
              <Search size={20} />
              Найти туры
            </>
          )}
        </button>
      </div>

      {/* Results Dropdown */}
      {(results || isSearching) && (
        <div className="mt-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Анализируем цены у 120 туроператоров...</p>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                <div className="font-bold text-blue-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  Найдено 142 тура
                </div>
                <div className="text-xs text-blue-700 font-medium bg-white/50 px-2 py-1 rounded">Топ-3 от ИИ</div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {results?.map(hotel => (
                  <div key={hotel.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/50 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <span className="text-yellow-400">★</span> {hotel.rating}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-sm lg:text-base truncate pr-2">{hotel.name}</h4>
                        <div className="text-right flex-shrink-0">
                          <div className="font-black text-lg text-slate-900 leading-none">{hotel.price} ₽</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <MapPin size={10} /> {hotel.location}
                      </div>
                      
                      <div className="flex gap-2">
                         <button 
                           onClick={() => navigate('/selection')} 
                           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
                         >
                           ✨ Упаковать с ИИ
                         </button>
                         <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                           <Search size={14} />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-xs text-slate-500 hover:text-slate-800 font-bold uppercase tracking-wide transition-colors">Показать еще 139 вариантов</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
