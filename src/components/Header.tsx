import { useNavigate, Link } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-12 transition-transform">A</div>
          <div className="font-bold text-xl tracking-tight">AI<em className="text-blue-600 not-italic">Travel</em></div>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <Link to="/selection" className="text-blue-600 font-bold transition-colors">Менеджер для туристов</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Демо агента</Link>
          <a href="/#features" className="hover:text-blue-600 transition-colors">Возможности</a>
          <a href="/#pricing" className="hover:text-blue-600 transition-colors">Тарифы</a>
        </div>
        <Link to="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5">
          Войти (Агент) →
        </Link>
      </div>
    </nav>
  );
};
