
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
  onPartnerConcept: () => void;
  onAIMentorConcept: () => void;
  onForeignInvestment: () => void;
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, onRoadmap, onTools, onMentorship, onIncubation, 
  onMemberships, onPartnerConcept, onLogin, onAchievements,
  onAIMentorConcept,
  lang,
  onLanguageChange
}) => {
  const t = getTranslation(lang);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-500`} dir={t.dir}>
      
      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 ${scrolled ? 'py-4 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-6 w-6 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase leading-none">{t.brand}</h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 font-bold text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
             <button onClick={onIncubation} className="hover:text-blue-600 transition-colors">{t.nav.about}</button>
             <button onClick={onRoadmap} className="hover:text-blue-600 transition-colors">{t.nav.roadmap}</button>
             <button onClick={onTools} className="hover:text-blue-600 transition-colors">{t.nav.tools}</button>
             <button onClick={onAchievements} className="hover:text-blue-600 transition-colors">{t.nav.impact}</button>
             <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
             <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} variant="minimal" />
             <button onClick={onLogin} className="text-slate-900 dark:text-white hover:text-blue-600 transition-colors">{t.nav.login}</button>
             <button onClick={onStart} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95">{t.nav.startFree}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-56 pb-40 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 animate-fade-up">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-100 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              {t.subtitle}
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-slate-950 dark:text-white leading-[0.95] tracking-tighter">
              {t.hero.title} <br/> <span className="text-blue-600">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              {t.hero.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button onClick={onStart} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-700 transition-all active:scale-95">{t.hero.cta}</button>
              <button onClick={onAIMentorConcept} className="px-12 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                 <span>{t.nav.aiMentor}</span>
                 <span className="text-blue-600">🤖</span>
              </button>
            </div>
          </div>

          <div className="relative group stagger-load">
             <div className="aspect-[4/5] rounded-[4rem] bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                  alt="Corporate Building" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                
                <div className="absolute bottom-10 right-10 left-10 p-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 animate-fade-up">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🤖</div>
                      <div>
                         <p className="text-xs font-black dark:text-white text-slate-900">Gemini 3 Pro</p>
                         <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Active Intelligence</p>
                      </div>
                   </div>
                   <p className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {lang === 'ar' ? '"النظام يرصد ارتفاعاً بنسبة ٢٤٪ في جاهزية مشاريع قطاع التقنية هذا الأسبوع."' : 
                       lang === 'en' ? '"System detects 24% increase in fintech readiness this week."' :
                       lang === 'fr' ? '"Le système détecte une augmentation de 24% de la préparation aux fintechs cette semaine."' :
                       '"本周系统检测到金融科技就绪度提高了 24%。"'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-slate-100 dark:border-white/5 text-center">
         <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em]">{t.brand} Hub • 2024</p>
      </footer>
    </div>
  );
};
