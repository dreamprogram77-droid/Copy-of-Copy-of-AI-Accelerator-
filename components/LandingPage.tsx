
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onStart: () => void;
  onPathFinder: () => void;
  onSmartFeatures: () => void;
  onGovDashboard: () => void;
  onRoadmap: () => void;
  onTools: () => void;
  onAchievements: () => void;
  onMentorship: () => void;
  onIncubation: () => void;
  onMemberships: () => void;
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, onPathFinder, onRoadmap, onTools, onAchievements, 
  onMentorship, onIncubation, onMemberships, onLegalClick, onLogin,
  lang, onLanguageChange
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const t = getTranslation(lang);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden scroll-smooth ${isDark ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-500`} dir={t.dir}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .hero-glow {
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, ${isDark ? '0.15' : '0.1'}), transparent 70%);
        }
        .nav-blur { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)'}; }
        .feature-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .feature-card:hover { transform: translateY(-10px) scale(1.02); background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 1)'}; }
        .dark .feature-card:hover { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3); }
        .feature-card:hover { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 nav-blur border-b border-black/5 dark:border-white/5 shadow-2xl' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all group-hover:rotate-12">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tight leading-none uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.brand}</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{t.subtitle}</span>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8 items-center text-xs font-black uppercase tracking-widest">
            <button onClick={onIncubation} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">{t.nav.incubation}</button>
            <button onClick={onMemberships} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">{t.nav.memberships}</button>
            <button onClick={onRoadmap} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">{t.nav.roadmap}</button>
            <button onClick={onTools} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">{t.nav.tools}</button>
            
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
            
            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} variant="minimal" />

            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button onClick={onLogin} className={`${isDark ? 'text-white' : 'text-slate-900'} hover:text-blue-500 transition-all`}>{t.nav.login}</button>
            <button onClick={onStart} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95">{t.nav.startFree}</button>
          </div>

          <button className={`lg:hidden p-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className={`space-y-10 animate-fade-in-up ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] font-black border uppercase tracking-widest ${isDark ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              {t.subtitle}
            </div>
            
            <h1 className={`text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.hero.title} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-500">{t.hero.titleAccent}</span>
            </h1>
            
            <p className={`text-xl max-w-xl leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.hero.desc}
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 pt-6 ${t.dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
              <button onClick={onStart} className="px-14 py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                <span>{t.hero.cta}</span>
                <svg className={`w-7 h-7 transition-transform ${t.dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-[5rem] blur-3xl -z-10 opacity-50 animate-float"></div>
             <div className={`p-8 rounded-[5rem] border shadow-3xl backdrop-blur-2xl relative overflow-hidden group ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="p-12 space-y-12">
                   <div className="flex justify-between items-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className={`h-6 w-3/4 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>
                      <div className={`h-4 w-1/2 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}></div>
                      <div className={`h-32 w-full rounded-[2rem] border flex items-center justify-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                         <p className="text-slate-400 font-bold text-sm">AI Analyzing Market Data...</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
