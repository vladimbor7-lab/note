import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-12 transition-transform">T</div>
          <div className="font-bold text-xl tracking-tight">AIAIAI<em className="text-blue-600 not-italic">Travel</em></div>
        </a>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <span onClick={() => navigate('/dashboard')} className="hover:text-blue-600 cursor-pointer transition-colors">Демо агента</span>
          <a href="/selection" className="hover:text-blue-600 transition-colors">Менеджер для туристов</a>
          <a href="/#features" className="hover:text-blue-600 transition-colors">Возможности</a>
          <a href="/#pricing" className="hover:text-blue-600 transition-colors">Тарифы</a>
        </div>
        <a href="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5">
          Войти (Агент) →
        </a>
      </div>
    </nav>
  );
};
