import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Generator } from '../components/Generator';
import { Leads } from '../components/Leads';
import { Tariffs } from '../components/Tariffs';
import { BotSettings } from '../components/BotSettings';
import { SmartContext } from '../components/SmartContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('smart_context');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'generator' && <Generator />}
        {activeTab === 'smart_context' && <SmartContext />}
        {activeTab === 'leads' && <Leads />}
        {activeTab === 'tariffs' && <Tariffs />}
        {activeTab === 'settings' && <BotSettings />}
      </main>
    </div>
  );
};
