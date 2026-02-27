import React from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-black mb-6">Ваш красивый Лендинг</h1>
      <p className="text-white/50 max-w-2xl mb-10 text-lg">
        Здесь должен быть тот самый код на 1300 строк с анимациями, демо-чатом и тарифами, который мы написали ранее. 
        <br/><br/>
        Вам нужно просто скопировать старый код из истории GitHub и вставить его в этот файл (<code>src/pages/Landing.tsx</code>).
      </p>
      
      <div className="flex gap-4">
        <Link to="/dashboard" className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 rounded-xl font-black transition-all">
          Перейти в Рабочую зону (Dashboard)
        </Link>
      </div>
    </div>
  );
};
