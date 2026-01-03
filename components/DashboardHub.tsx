
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, StartupRecord, ProjectTrack, TaskRecord, TRACK_CONFIG, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { playPositiveSound } from '../services/audioService';
import { StaffPortal } from './StaffPortal';
import { CoFounderPortal } from './CoFounderPortal';
import { MentorshipPage } from './MentorshipPage';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  onNavigateToStage: (stage: any) => void;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout, onNavigateToStage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [startups, setStartups] = useState<StartupRecord[]>([]);
  const [myStartup, setMyStartup] = useState<StartupRecord | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);

  useEffect(() => {
    const allStartups = storageService.getAllStartups();
    setStartups(allStartups);

    if (user.role === 'STARTUP' && user.startupId) {
      const startup = allStartups.find(s => s.projectId === user.startupId);
      if (startup) setMyStartup(startup);
      const userTasks = storageService.getUserTasks(user.uid);
      setTasks(userTasks);
    }
  }, [user]);

  const navItems = useMemo(() => {
    const items = [{ id: 'overview', label: 'الرئيسية', icon: '🏠' }];
    
    if (user.role === 'ADMIN') {
      items.push(
        { id: 'admin-portal', label: 'بوابة الإدارة', icon: '👑' },
        { id: 'startups', label: 'المشاريع', icon: '🚀' },
        { id: 'analytics', label: 'تحليلات', icon: '📊' }
      );
    } else if (user.role === 'PARTNER') {
      items.push(
        { id: 'partner-hub', label: 'بوابة الشركاء', icon: '🤝' },
        { id: 'my-trials', label: 'تجارب الشراكة', icon: '🧪' }
      );
    } else if (user.role === 'MENTOR') {
      items.push(
        { id: 'mentor-hub', label: 'طلبات الإرشاد', icon: '📝' },
        { id: 'my-mentees', label: 'رواد الأعمال', icon: '👥' }
      );
    } else { // STARTUP
      items.push(
        { id: 'roadmap', label: 'خارطة الطريق', icon: '🗺️' },
        { id: 'partner-match', label: 'بحث عن شريك', icon: '🤝' },
        { id: 'tasks', label: 'مهامي', icon: '📁' }
      );
    }
    return items;
  }, [user.role]);

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
    <div className="min-h-screen bg-slate-950 text-white flex font-sans" dir="rtl">
      <style>{`
        .sidebar-item-active { background: var(--accent-color, #2563eb); color: white; box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb, 37, 99, 235), 0.2); }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .sidebar-accent { --accent-color: ${accent === 'emerald' ? '#10b981' : accent === 'purple' ? '#a855f7' : accent === 'indigo' ? '#6366f1' : '#2563eb'}; }
      `}</style>

      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] border-l border-white/5 flex flex-col p-6 sticky top-0 h-screen sidebar-accent">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className={`w-12 h-12 bg-${accent}-600 rounded-2xl flex items-center justify-center text-white shadow-2xl font-black italic`}>BD</div>
          <div>
            <h1 className="text-xl font-black leading-none">بيزنس ديفلوبرز</h1>
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
          <button onClick={onLogout} className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.05),transparent_50%)]">
        <header className="h-24 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-12 shrink-0 z-40">
          <div>
            <h2 className="text-3xl font-black">{navItems.find(n => n.id === activeTab)?.label}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Smart Acceleration Ecosystem v3.0</p>
          </div>
          <div className="flex gap-4">
             <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">المستندات المركزية</button>
             <div className="w-px h-10 bg-white/5 mx-2"></div>
             <button className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-slate-400 hover:text-white">⚙️</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div className="animate-fade-in-up space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                       <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">إجمالي التفاعل اليومي</p>
                       <h3 className="text-6xl font-black tracking-tighter">٨٤٪</h3>
                       <div className="mt-8 h-2 w-full bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white transition-all duration-1000" style={{ width: '84%' }}></div>
                       </div>
                    </div>
                    <div className="p-10 glass-card rounded-[3rem] flex flex-col justify-between group hover:border-blue-500/50 transition-all">
                       <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الإشعارات الجديدة</p>
                          <span className="text-2xl group-hover:rotate-12 transition-transform">🔔</span>
                       </div>
                       <h3 className="text-5xl font-black mt-4">٠٧</h3>
                       <p className="text-[10px] font-bold text-blue-500 mt-4 underline cursor-pointer">عرض كافة التنبيهات</p>
                    </div>
                    <div className="p-10 glass-card rounded-[3rem] flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
                       <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الوضع التنفيذي</p>
                          <span className="text-2xl">⚡</span>
                       </div>
                       <h3 className="text-5xl font-black mt-4">Active</h3>
                       <p className="text-[10px] font-bold text-emerald-500 mt-4 uppercase">System running nominal</p>
                    </div>
                 </div>

                 {/* Welcome Message for Roles */}
                 <div className="bg-white/5 border border-white/5 p-12 rounded-[4rem] text-center space-y-6">
                    <h3 className="text-4xl font-black">أهلاً بك، {user.name.split(' ')[0]}</h3>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                       {user.role === 'ADMIN' ? 'أنت في مركز التحكم الرئيسي. يمكنك مراقبة كافة المسارات والتدخل عند الحاجة لضمان جودة المخرجات.' :
                        user.role === 'PARTNER' ? 'بصفتك شريك، فرصتك تكمن في التكامل. تصفح المشاريع المتاحة وابحث عن "الفجوة" التي يمكنك سدها.' :
                        user.role === 'MENTOR' ? 'خبرتك هي وقود هذه المسرعة. بانتظارك عدة طلبات مراجعة تتطلب لمستك الاستشارية العميقة.' :
                        'رحلة البناء مستمرة. مشروعك حالياً في مرحلة حاسمة تتطلب تركيزاً كاملاً على نموذج الربح.'}
                    </p>
                 </div>
              </div>
            )}

            {/* Embed Role-Specific Main Components */}
            {activeTab === 'admin-portal' && <StaffPortal onBack={() => setActiveTab('overview')} />}
            
            {activeTab === 'partner-hub' && (
              <CoFounderPortal 
                userUid={user.uid} 
                userRole="PARTNER" 
                onBack={() => setActiveTab('overview')} 
              />
            )}

            {activeTab === 'partner-match' && (
              <CoFounderPortal 
                userUid={user.uid} 
                userRole="STARTUP" 
                startup={myStartup || undefined}
                onBack={() => setActiveTab('overview')} 
              />
            )}

            {activeTab === 'mentor-hub' && (
              <MentorshipPage onBack={() => setActiveTab('overview')} user={user} />
            )}

            {/* Fallback for other tabs */}
            {!['overview', 'admin-portal', 'partner-hub', 'partner-match', 'mentor-hub'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-40 opacity-20 select-none">
                 <div className="text-9xl mb-8">🏗️</div>
                 <h3 className="text-4xl font-black uppercase tracking-widest">Section Under Build</h3>
                 <p className="font-bold mt-2">V3.5 Feature Set Loading...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
