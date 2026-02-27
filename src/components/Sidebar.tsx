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
    <div className="w-64 bg-[#0a0a0a] border-r border-white/10 h-screen p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-white font-black">T</div>
        <span className="text-xl font-black text-white tracking-tight">TRAVEL<span className="text-violet-500">AI</span></span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-violet-500/10 text-violet-400' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">А</div>
          <div>
            <div className="text-sm font-bold text-white">Агентство</div>
            <div className="text-xs text-white/40">Тариф: ПРО</div>
          </div>
        </div>
      </div>
    </div>
  );
};
