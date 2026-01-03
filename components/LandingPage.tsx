
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Footer } from './Footer';

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
  onPartnerConcept: () => void;
  onAIMentorConcept: () => void;
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, onPathFinder, onRoadmap, onTools, onAchievements, 
  onMentorship, onIncubation, onMemberships, onLegalClick, onLogin,
  onPartnerConcept, onAIMentorConcept,
  lang, onLanguageChange
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} dir={t.dir}>
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'}`}></div>
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-opacity duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-500/5'}`}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3 glass border-b border-black/5 dark:border-white/5' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-black tracking-tight leading-none uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.brand}</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 opacity-80">Virtual Accelerator</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8 items-center">
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
                <button onClick={onIncubation} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 hover:text-primary transition-all">شركة محتضنة</button>
                <button onClick={onPartnerConcept} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 hover:text-emerald-500 transition-all">شريك</button>
                <button onClick={onMentorship} className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 hover:text-purple-500 transition-all">مرشد</button>
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>

            <button onClick={onAIMentorConcept} className="text-[11px] font-black text-primary flex items-center gap-2 hover:opacity-70 transition-opacity">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               {t.nav.aiMentor}
            </button>
            <button onClick={onTools} className="text-[11px] font-black text-slate-500 hover:text-primary transition-all">{t.nav.tools}</button>
            
            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} variant="minimal" />

            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-lg">
              {isDark ? '☀️' : '🌙'}
            </button>

            <button onClick={onLogin} className={`text-[11px] font-black ${isDark ? 'text-white' : 'text-slate-900'} hover:text-primary transition-all`}>{t.nav.login}</button>
            <button onClick={onStart} className="bg-primary text-white px-6 py-3 rounded-2xl text-[11px] font-black hover:opacity-90 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">ابدأ الآن</button>
          </div>

          {/* Mobile Menu Trigger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass border-t border-black/5 dark:border-white/5 p-6 space-y-6 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onIncubation} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black text-center">المحتضنين</button>
              <button onClick={onPartnerConcept} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black text-center">الشركاء</button>
            </div>
            <div className="space-y-4">
              <button onClick={onTools} className="block w-full text-right text-sm font-black p-2">{t.nav.tools}</button>
              <button onClick={onRoadmap} className="block w-full text-right text-sm font-black p-2">{t.nav.roadmap}</button>
              <button onClick={onLogin} className="block w-full text-right text-sm font-black p-2 text-primary">{t.nav.login}</button>
            </div>
            <button onClick={onStart} className="w-full bg-primary text-white py-4 rounded-2xl font-black">ابدأ مجاناً</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 animate-fade-up text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t.subtitle}</span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.hero.title} <br/> 
              <span className="text-gradient">{t.hero.titleAccent}</span>
            </h1>
            
            <p className={`text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium opacity-70 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <button onClick={onStart} className="px-10 py-5 bg-primary hover:opacity-90 text-white text-lg font-black rounded-3xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                <span>{t.hero.cta}</span>
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-[-4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button onClick={onRoadmap} className={`px-10 py-5 glass border border-black/5 dark:border-white/10 rounded-3xl text-lg font-black transition-all hover:bg-slate-100 dark:hover:bg-white/5 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                اكتشف الخارطة
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className={`relative p-1 rounded-[3rem] ${isDark ? 'bg-slate-800' : 'bg-white shadow-2xl'}`}>
                   <div className="p-8 md:p-12 space-y-12">
                      <div className="flex justify-between items-center">
                         <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         </div>
                         <div className="flex gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                         </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-3/4"></div>
                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-1/2"></div>
                        <div className="h-20 bg-primary/5 dark:bg-white/5 rounded-3xl flex items-center justify-center">
                           <p className="text-primary font-black text-xs uppercase tracking-widest animate-pulse">AI Strategic Scan Active...</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-4xl md:text-5xl font-black tracking-tight">مساراتنا الاستراتيجية</h2>
               <p className="text-slate-500 font-medium max-w-2xl mx-auto">منظومة ريادية متكاملة صممت لتلبي طموحاتك في كل مرحلة من مراحل نمو مشروعك.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'شركة محتضنة', desc: 'ابدأ رحلة نضج مشروعك من الفكرة إلى الاستثمار تحت إشراف نخبة من الموجهين.', icon: '🚀', color: 'blue', action: onIncubation },
                 { title: 'شريك مؤسس', desc: 'استثمر خبراتك في مشاريع ناشئة واعدة مقابل حصص ملكية استراتيجية.', icon: '🤝', color: 'emerald', action: onPartnerConcept },
                 { title: 'مرشد خبير', desc: 'كن جزءاً من قصة نجاح المبتكرين الجدد وشارك خبراتك مع مجتمعنا المتنامي.', icon: '🧠', color: 'purple', action: onMentorship }
               ].map((item, i) => (
                 <div key={i} onClick={item.action} className="card-premium p-10 cursor-pointer group flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 ${isDark ? 'bg-white/5 shadow-inner' : 'bg-slate-50'}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{item.desc}</p>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:translate-x-[-5px] transition-transform flex items-center gap-2">
                       ابدأ الآن 
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3} /></svg>
                    </span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Unified Luxury Footer */}
      <Footer 
        lang={lang}
        onLanguageChange={onLanguageChange}
        onIncubation={onIncubation}
        onPartnerConcept={onPartnerConcept}
        onMentorship={onMentorship}
        onTools={onTools}
        onRoadmap={onRoadmap}
        onAIMentorConcept={onAIMentorConcept}
        onLogin={onLogin || (() => {})}
        onStart={onStart}
      />
    </div>
  );
};
