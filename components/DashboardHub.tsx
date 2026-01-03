
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, StartupRecord, TaskRecord, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { playPositiveSound } from '../services/audioService';
import { StaffPortal } from './StaffPortal';
import { CoFounderPortal } from './CoFounderPortal';
import { MentorshipPage } from './MentorshipPage';
import { Language, getTranslation } from '../services/i18nService';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  onNavigateToStage: (stage: any) => void;
  lang: Language;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout, onNavigateToStage, lang }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const t = getTranslation(lang);

  const navItems = useMemo(() => {
    const items = [{ id: 'overview', label: t.dashboard.home, icon: '🏠' }];
    
    if (user.role === 'ADMIN') {
      items.push(
        { id: 'admin-portal', label: t.roles.admin, icon: '👑' },
        { id: 'analytics', label: t.dashboard.lab, icon: '📊' }
      );
    } else if (user.role === 'PARTNER') {
      items.push(
        { id: 'partner-hub', label: t.nav.partner, icon: '🤝' }
      );
    } else if (user.role === 'MENTOR') {
      items.push(
        { id: 'mentor-hub', label: t.nav.mentorship, icon: '📝' }
      );
    } else { // STARTUP
      items.push(
        { id: 'roadmap', label: t.nav.roadmap, icon: '🗺️' },
        { id: 'partner-match', label: t.nav.partner, icon: '🤝' },
        { id: 'tasks', label: t.dashboard.tasks, icon: '📁' }
      );
    }
    return items;
  }, [user.role, t]);

  const getAccentColor = () => {
    switch(user.role) {
      case 'ADMIN': return 'indigo';
      case 'PARTNER': return 'emerald';
      case 'MENTOR': return 'purple';
      default: return 'blue';
    }
  };

  const accent = getAccentColor();

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex font-sans`} dir={t.dir}>
      <style>{`
        .sidebar-item-active { background: var(--accent-color, #2563eb); color: white; box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb, 37, 99, 235), 0.2); }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .sidebar-accent { --accent-color: ${accent === 'emerald' ? '#10b981' : accent === 'purple' ? '#a855f7' : accent === 'indigo' ? '#6366f1' : '#2563eb'}; }
      `}</style>

      {/* Sidebar */}
      <aside className={`w-72 bg-[#0f172a] ${t.dir === 'rtl' ? 'border-l' : 'border-r'} border-white/5 flex flex-col p-6 sticky top-0 h-screen sidebar-accent`}>
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className={`w-12 h-12 bg-${accent}-600 rounded-2xl flex items-center justify-center text-white shadow-2xl font-black italic`}>BD</div>
          <div>
            <h1 className="text-xl font-black leading-none">{t.brand}</h1>
            <p className={`text-[10px] font-bold text-${accent}-500 uppercase tracking-widest mt-1.5`}>{user.role} Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); playPositiveSound(); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group
                ${activeTab === item.id ? 'sidebar-item-active' : 'text-slate-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === item.id ? '' : 'grayscale opacity-50'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="bg-white/5 rounded-3xl p-5 flex items-center gap-4 mb-6">
             <div className={`w-10 h-10 rounded-full bg-${accent}-500/20 text-${accent}-400 flex items-center justify-center font-black border border-${accent}-500/20`}>{user.name?.charAt(0) || 'U'}</div>
             <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user.name}</p>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user.role}</span>
             </div>
          </div>
          <button onClick={onLogout} className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all">{t.dashboard.logout}</button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-12 shrink-0 z-40">
          <div>
            <h2 className="text-3xl font-black">{navItems.find(n => n.id === activeTab)?.label}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Smart Acceleration Ecosystem v3.0</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div className="animate-fade-in-up space-y-12">
                 <div className="bg-white/5 border border-white/5 p-12 rounded-[4rem] text-center space-y-6">
                    <h3 className="text-4xl font-black">{t.dashboard.welcome} {user.name.split(' ')[0]}</h3>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                       {user.role === 'ADMIN' ? 'Control center active.' : 'Growth platform ready.'}
                    </p>
                 </div>
              </div>
            )}

            {activeTab === 'admin-portal' && <StaffPortal onBack={() => setActiveTab('overview')} />}
            {activeTab === 'mentor-hub' && <MentorshipPage onBack={() => setActiveTab('overview')} user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};
