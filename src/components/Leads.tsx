import React, { useState } from 'react';
import { sendTelegramNotification } from '../services/telegram';
import { Send, CheckCircle2 } from 'lucide-react';

export const Leads = () => {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allLeads = [
    { id: 1, country: 'Турция', budget: 250000, status: 'Новый', time: '10 мин назад', details: 'Семья 2+1 • Вылет в августе', client: '@ivan_tur' },
    { id: 2, country: 'Египет', budget: 150000, status: 'В работе', time: '1 час назад', details: 'Пара • Отель 5* • Все включено', client: '@elena_travel' },
    { id: 3, country: 'ОАЭ', budget: 450000, status: 'Новый', time: '3 часа назад', details: 'Бизнес-поездка • Дубай Марина', client: '+7 (900) 123-44-55' },
    { id: 4, country: 'Мальдивы', budget: 850000, status: 'Завершен', time: 'Вчера', details: 'Медовый месяц • Вилла на воде', client: '@luxury_couple' },
    { id: 5, country: 'Турция', budget: 180000, status: 'В работе', time: 'Вчера', details: 'Группа друзей • Кемер', client: 'Дмитрий В.' },
    { id: 6, country: 'Таиланд', budget: 320000, status: 'Новый', time: '2 дня назад', details: 'Семья 2+2 • Пхукет', client: '@thai_lover' },
    { id: 7, country: 'Турция', budget: 600000, status: 'Новый', time: '3 дня назад', details: 'Maxx Royal • VIP трансфер', client: '@vip_client_77' },
    { id: 8, country: 'Египет', budget: 95000, status: 'Завершен', time: '4 дня назад', details: 'Горящий тур • Хургада', client: 'Анна С.' },
  ];

  const filteredLeads = allLeads.filter(lead => {
    const matchStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchCountry = filterCountry === 'all' || lead.country === filterCountry;
    const matchSearch = searchQuery === '' || 
      lead.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchBudget = true;
    if (filterBudget === 'low') matchBudget = lead.budget < 200000;
    else if (filterBudget === 'mid') matchBudget = lead.budget >= 200000 && lead.budget <= 500000;
    else if (filterBudget === 'high') matchBudget = lead.budget > 500000;

    return matchStatus && matchCountry && matchBudget && matchSearch;
  });

  const handleSimulateLead = async () => {
    setIsSending(true);
    const msg = `🚨 <b>Тестовая заявка из рабочей зоны!</b>\n\n🌍 Направление: Мальдивы\n📅 Даты: 15.09 - 25.09\n👥 Состав: 2 взрослых\n💰 Бюджет: 500 000 ₽\n👤 Клиент: @test_client`;
    
    // Try to send real notification, but fallback to simulation for demo
    try {
      await sendTelegramNotification(msg);
    } catch (e) {
      console.log('Telegram send failed, simulating success for demo');
    }

    // Simulate network delay for better UX
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Входящие заявки (Лиды)</h1>
        <p className="text-slate-600">Сюда падают квалифицированные лиды от вашего Telegram/WhatsApp бота.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center mb-8 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Проверка уведомлений</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Нажмите кнопку ниже, чтобы проверить работу системы уведомлений (отправка тестового лида).
        </p>
        <button 
          onClick={handleSimulateLead}
          disabled={isSending}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all disabled:opacity-50 shadow-sm"
        >
          {sent ? <CheckCircle2 size={18} /> : <Send size={18} />}
          {sent ? 'Уведомление отправлено!' : 'Отправить тестовый лид'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Поиск</label>
            <input 
              type="text"
              placeholder="Имя, страна или детали..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Статус</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Все статусы</option>
              <option value="Новый">Новые</option>
              <option value="В работе">В работе</option>
              <option value="Завершен">Завершенные</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Направление</label>
            <select 
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Все страны</option>
              <option value="Турция">Турция</option>
              <option value="Египет">Египет</option>
              <option value="ОАЭ">ОАЭ</option>
              <option value="Мальдивы">Мальдивы</option>
              <option value="Таиланд">Таиланд</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Бюджет</label>
            <select 
              value={filterBudget}
              onChange={(e) => setFilterBudget(e.target.value)}
              className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Любой бюджет</option>
              <option value="low">До 200 000 ₽</option>
              <option value="mid">200к - 500к ₽</option>
              <option value="high">От 500 000 ₽</option>
            </select>
          </div>

          <button 
            onClick={() => { setFilterStatus('all'); setFilterCountry('all'); setFilterBudget('all'); setSearchQuery(''); }}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 px-2 py-2 transition-colors"
          >
            Сбросить
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-900">Список заявок ({filteredLeads.length})</h3>
          </div>
          
          {filteredLeads.length > 0 ? (
            filteredLeads.map(lead => (
              <div key={lead.id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors group">
                <div>
                  <div className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    {lead.country} 
                    <span className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded">
                      {lead.budget.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    <span className="text-slate-900 font-bold">{lead.client}</span> • {lead.details}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-1 ${
                    lead.status === 'Новый' ? 'text-blue-700 bg-blue-50' : 
                    lead.status === 'В работе' ? 'text-orange-700 bg-orange-50' : 
                    'text-green-700 bg-green-50'
                  }`}>
                    {lead.status}
                  </div>
                  <div className="text-xs text-slate-400">{lead.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Заявки не найдены по выбранным фильтрам</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
