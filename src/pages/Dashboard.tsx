import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Generator } from '../components/Generator';
import { Leads } from '../components/Leads';
import { Tariffs } from '../components/Tariffs';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'generator' && <Generator />}
        {activeTab === 'leads' && <Leads />}
        {activeTab === 'tariffs' && <Tariffs />}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 mb-4">Настройки бота</h1>
            <p className="text-slate-600">Здесь будут настройки интеграции с WhatsApp и CRM.</p>
          </div>
        )}
      </main>
    </div>
  );
};
