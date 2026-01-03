
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { playPositiveSound } from '../services/audioService';
import { StaffPortal } from './StaffPortal';
import { MentorshipPage } from './MentorshipPage';
import { Language, getTranslation } from '../services/i18nService';
import { TemplateLibrary } from './TemplateLibrary';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  onNavigateToStage: (stage: any) => void;
  lang: Language;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout, onNavigateToStage, lang }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const t = getTranslation(lang);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('dashboard_theme_mode') as any) || 'light');

  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDark]);

  const navItems = useMemo(() => {
    const items = [
      { id: 'overview', label: t.dashboard.home, icon: '🏠' },
      { id: 'templates', label: 'مختبر القوالب', icon: '📝' }
    ];
    
    if (user.role === 'ADMIN') {
      items.push(
        { id: 'admin-portal', label: t.roles.admin, icon: '👑' },
        { id: 'analytics', label: t.dashboard.lab, icon: '📊' }
      );
    } else if (user.role === 'PARTNER') {
      items.push({ id: 'partner-hub', label: t.nav.partner, icon: '🤝' });
    } else if (user.role === 'MENTOR') {
      items.push({ id: 'mentor-hub', label: t.nav.mentorship, icon: '🧠' });
    } else { // STARTUP
      items.push(
        { id: 'roadmap', label: t.nav.roadmap, icon: '🗺️' },
        { id: 'partner-match', label: t.nav.partner, icon: '🤝' }
      );
    }
    return items;
  }, [user.role, t]);

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    localStorage.setItem('dashboard_theme_mode', newMode);
    playPositiveSound();
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-700`} dir={t.dir}>
      {/* Dynamic Navigation Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 z-50 transition-all duration-700 ease-in-out glass border-black/5 dark:border-white/5 flex flex-col m-4 rounded-[2.5rem] shadow-premium
        ${isSidebarOpen ? 'w-72' : 'w-0 lg:w-24 overflow-hidden'}`}
      >
        <div className="p-8 flex items-center gap-4 border-b border-black/5 dark:border-white/5 mb-6">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 shrink-0 font-black italic text-xl">BD</div>
          {isSidebarOpen && (
            <div className="truncate animate-fade-in">
              <h1 className="text-lg font-black leading-none dark:text-white text-slate-900">{t.brand}</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2 opacity-80">v3.0 Executive</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); playPositiveSound(); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl font-black text-xs transition-all group relative overflow-hidden
                ${activeTab === item.id 
                  ? `bg-primary text-white shadow-2xl shadow-blue-500/40 translate-x-${t.dir === 'rtl' ? '-2' : '2'}` 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <span className={`text-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${activeTab === item.id ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="truncate whitespace-nowrap">{item.label}</span>}
              {activeTab === item.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-black/5 dark:border-white/5 space-y-4">
          <button 
            onClick={toggleTheme} 
            className="w-full py-4 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase text-slate-500 hover:text-primary transition-all flex items-center justify-center gap-3"
          >
             {isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
          </button>
          <button 
            onClick={onLogout} 
            className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all flex items-center justify-center gap-3 group"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
            {isSidebarOpen && <span>{t.dashboard.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Primary Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-24 glass border-b border-black/5 dark:border-white/5 flex items-center justify-between px-10 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-black/5 dark:border-white/10 active:scale-90"
            >
              <svg className={`w-6 h-6 text-slate-500 transition-transform duration-500 ${!isSidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-black dark:text-white text-slate-900 leading-none tracking-tight">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Session Control</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-black dark:text-white text-slate-900 leading-none">{user.name}</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1.5">{user.role} Profile</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black shadow-xl">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {activeTab === 'overview' && (
              <div className="animate-fade-up space-y-12 pb-20">
                 <div className="card-premium p-16 text-center space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-0 group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                      <h3 className="text-5xl md:text-6xl font-black dark:text-white text-slate-900 tracking-tighter">
                        {t.dashboard.welcome} <span className="text-primary">{user.name.split(' ')[0]}</span>!
                      </h3>
                      <p className="text-slate-500 text-xl font-medium max-w-3xl mx-auto leading-relaxed mt-6">
                         أهلاً بك في الجيل الجديد من مسرعات الأعمال. مشروعك الآن يخضع لتحليل Gemini 3 لضمان أعلى معايير الجاهزية الاستثمارية.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 relative z-10">
                       {[
                         { label: 'نسبة الإنجاز', value: '45%', icon: '📈' },
                         { label: 'المهام المعلقة', value: '03', icon: '⏳' },
                         { label: 'تقييم AI', value: 'B+', icon: '🤖' }
                       ].map((stat, i) => (
                         <div key={i} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-inner">
                            <span className="text-3xl block mb-4">{stat.icon}</span>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h4>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="card-premium p-10 space-y-6 border-l-8 border-l-primary">
                       <h4 className="text-2xl font-black">أحدث التوصيات</h4>
                       <p className="text-slate-500 leading-relaxed font-medium">بناءً على نشاطك الأخير، يوصي الموجه الذكي بمراجعة "نموذج العمل" ليتناسب مع توجهات السوق في عام 2025.</p>
                       <button className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                         ابدأ المراجعة الآن →
                       </button>
                    </div>
                    <div className="card-premium p-10 space-y-6 border-l-8 border-l-emerald-500">
                       <h4 className="text-2xl font-black">جاهزية الاستثمار</h4>
                       <p className="text-slate-500 leading-relaxed font-medium">لقد حققت تقدماً ملحوظاً في المستوى التقني. أنت الآن في المنطقة الخضراء لـ 60% من المستثمرين في قطاعك.</p>
                       <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[60%] rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'templates' && <TemplateLibrary userRole={user.role} isDark={isDark} />}
            {activeTab === 'admin-portal' && <StaffPortal onBack={() => setActiveTab('overview')} />}
            {activeTab === 'mentor-hub' && <MentorshipPage onBack={() => setActiveTab('overview')} user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};
