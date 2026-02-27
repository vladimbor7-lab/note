import React, { useState } from 'react';
import { sendTelegramNotification } from '../services/telegram';
import { Send, CheckCircle2 } from 'lucide-react';

export const Leads = () => {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSimulateLead = async () => {
    setIsSending(true);
    const msg = `🚨 <b>Тестовая заявка из рабочей зоны!</b>\n\n🌍 Направление: Мальдивы\n📅 Даты: 15.09 - 25.09\n👥 Состав: 2 взрослых\n💰 Бюджет: 500 000 ₽\n👤 Клиент: @test_client`;
    
    const success = await sendTelegramNotification(msg);
    setIsSending(false);
    if (success) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Входящие заявки (Лиды)</h1>
        <p className="text-white/50">Сюда падают квалифицированные лиды от вашего Telegram/WhatsApp бота.</p>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Проверка интеграции с Telegram</h3>
        <p className="text-white/50 mb-6 max-w-md mx-auto">
          Нажмите кнопку ниже, чтобы сымитировать поступление новой заявки. Бот отправит сообщение в ваш Telegram (ID: 1372666245).
        </p>
        <button 
          onClick={handleSimulateLead}
          disabled={isSending}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all disabled:opacity-50"
        >
          {sent ? <CheckCircle2 size={18} /> : <Send size={18} />}
          {sent ? 'Отправлено в Telegram!' : 'Отправить тестовый лид'}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Последние заявки</h3>
        {[
          { id: 1, country: 'Турция', budget: '250 000 ₽', status: 'Новый', time: '10 мин назад' },
          { id: 2, country: 'Египет', budget: '150 000 ₽', status: 'В работе', time: '1 час назад' },
        ].map(lead => (
          <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-lg">{lead.country} <span className="text-white/40 text-sm font-normal ml-2">{lead.budget}</span></div>
              <div className="text-sm text-white/40 mt-1">Семья 2+1 • Вылет в августе</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-violet-400 bg-violet-400/10 px-2 py-1 rounded inline-block mb-1">{lead.status}</div>
              <div className="text-xs text-white/30">{lead.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
