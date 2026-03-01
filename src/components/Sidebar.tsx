import React from 'react';
import { Sparkles, Users, CreditCard, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menu = [
    { id: 'generator', icon: Sparkles, label: 'ИИ-Копирайтер' },
    { id: 'leads', icon: Users, label: 'Заявки (Лиды)' },
    { id: 'tariffs', icon: CreditCard, label: 'Подписка' },
    { id: 'settings', icon: Settings, label: 'Настройки бота' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen p-6 flex flex-col shadow-sm">
      <a href="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-black">T</div>
        <span className="text-xl font-black text-slate-900 tracking-tight">TRAVEL<span className="text-blue-700">AI</span></span>
      </a>
      
      <nav className="flex-1 space-y-2">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">А</div>
          <div>
            <div className="text-sm font-bold text-slate-900">Агентство</div>
            <div className="text-xs text-slate-500">Тариф: ПРО</div>
          </div>
        </div>
      </div>
    </div>
  );
};
