import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Generator } from '../components/Generator';
import { Leads } from '../components/Leads';
import { Tariffs } from '../components/Tariffs';
import { BotSettings } from '../components/BotSettings';
import { SmartLink } from '../components/SmartLink';
import { SearchInterface } from '../components/SearchInterface';
import { HotelResults } from '../components/HotelResults';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [hotels, setHotels] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-slate-900">AI Поиск Отелей</h1>
            <SearchInterface onHotelsFound={setHotels} />
          </div>
        )}
        {activeTab === 'generator' && <Generator />}
        {activeTab === 'leads' && <Leads />}
        {activeTab === 'tariffs' && <Tariffs />}
        {activeTab === 'settings' && <BotSettings />}
        {activeTab === 'smartlink' && <SmartLink />}
      </main>
    </div>
  );
};
