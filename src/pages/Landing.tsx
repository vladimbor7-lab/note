import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInterface } from '../components/SearchInterface';
import { HotelResults } from '../components/HotelResults';
import { MessageCircle, Check, Zap, Globe, Shield, Github } from 'lucide-react';
import { Header } from '../components/Header';
import '../landing.css';

export const Landing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<any[]>([]);

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen flex flex-col">
      {/* NAV */}
      <Header />

      {/* HERO */}
      <section className="flex-1 pt-24 pb-12 px-4 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mx-auto grid gap-8 items-center text-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Демо-версия
            </div>
            <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
              ИИ для подбора туров <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Ваш персональный турагент</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
              Попробуйте нашего демо-бота прямо сейчас. Он подберет лучшие отели и туры, учитывая ваши пожелания.
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <a 
                href="https://github.com/vladimbor7-lab/Ii" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Github size={16} />
                <span>Смотреть на GitHub</span>
              </a>
            </div>
          </div>

          {/* CHAT INTERFACE - CENTERED */}
          <div className="w-full max-w-2xl mx-auto relative z-20 shadow-2xl rounded-2xl overflow-hidden border border-slate-200/60">
             <SearchInterface onHotelsFound={setHotels} />
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10"></div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg">A</div>
            <div className="font-bold text-xl tracking-tight">AI<em className="text-blue-600 not-italic">Travel</em></div>
          </a>
          <div className="text-slate-500 text-sm">
            © 2026 AITravel · Демонстрационный бот
          </div>
        </div>
      </footer>
    </div>
  );
};
