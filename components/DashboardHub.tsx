
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { playPositiveSound } from '../services/audioService';
import { StaffPortal } from './StaffPortal';
import { MentorshipPage } from './MentorshipPage';
import { Language, getTranslation } from '../services/i18nService';
import { TemplateLibrary } from './TemplateLibrary'; // New Import

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

  const navItems = useMemo(() => {
    const items = [
      { id: 'overview', label: t.dashboard.home, icon: '🏠' },
      { id: 'templates', label: 'مختبر القوالب', icon: '📝' } // Added Templates
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

  // ... existing style & logic

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500`} dir={t.dir}>
      {/* Sidebar - Same as before but updating navItems */}
      <aside className={`fixed lg:static inset-y-0 z-50 transition-all duration-500 overflow-hidden glass border-black/5 dark:border-white/5 flex flex-col
        ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 lg:w-20 opacity-0 lg:opacity-100'}`}>
        
        <div className="p-6 flex items-center gap-4 border-b border-black/5 dark:border-white/5">
          <div className={`w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 font-black italic`}>BD</div>
          {isSidebarOpen && (
            <div className="truncate">
              <h1 className="text-sm font-black leading-none dark:text-white text-slate-900">{t.brand}</h1>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">v3.0 Core</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); playPositiveSound(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-xs transition-all group relative
                ${activeTab === item.id 
                  ? `bg-primary text-white shadow-lg shadow-blue-500/20` 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === item.id ? '' : 'grayscale opacity-50'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <button onClick={() => { const n = isDark ? 'light' : 'dark'; setThemeMode(n); localStorage.setItem('dashboard_theme_mode', n); }} className="w-full mb-4 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase text-slate-500 hover:text-blue-500">
             {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={onLogout} className={`w-full py-3 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-all flex items-center justify-center gap-2`}>
            {isSidebarOpen ? t.dashboard.logout : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 glass border-b border-black/5 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-black dark:text-white text-slate-900 leading-none">{navItems.find(n => n.id === activeTab)?.label}</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && (
              <div className="animate-fade-up space-y-12">
                 <div className="card-premium p-12 text-center space-y-6 relative overflow-hidden group">
                    <h3 className="text-4xl font-black dark:text-white text-slate-900">{t.dashboard.welcome} {user.name.split(' ')[0]}!</h3>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                       ابدأ في استكمال القوالب الإلزامية لرفع مؤشر الجاهزية الخاص بك.
                    </p>
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
