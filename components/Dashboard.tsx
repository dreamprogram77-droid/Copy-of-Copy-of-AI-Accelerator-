
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LevelData, UserProfile, DIGITAL_SHIELDS, SECTORS, TaskRecord, SERVICES_CATALOG, ServiceItem, ServicePackage, ServiceRequest, OpportunityAnalysis, ProgramRating } from '../types';
import { storageService } from '../services/storageService';
import { discoverOpportunities, suggestIconsForLevels } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { ProgramEvaluation } from './ProgramEvaluation';

interface DashboardProps {
  user: UserProfile;
  levels: LevelData[];
  onSelectLevel: (id: number) => void;
  onShowCertificate: () => void;
  onLogout?: () => void;
  onOpenProAnalytics?: () => void;
  onUpdateLevelUI?: (id: number, icon: string, color: string) => void;
  onAISuggestIcons?: () => Promise<void>;
}

const NAV_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: '🏠' },
  { id: 'bootcamp', label: 'المنهج التدريبي', icon: '📚' },
  { id: 'tasks', label: 'المهام والتسليمات', icon: '📝' },
  { id: 'opportunity_lab', label: 'مختبر الفرص', icon: '🧭' },
  { id: 'services', label: 'خدمات التنفيذ', icon: '🛠️' }, 
  { id: 'startup_profile', label: 'الملف الشخصي', icon: '📈' },
];

const PRESET_COLORS = [
  { name: 'أزرق', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50', ring: 'ring-blue-500' },
  { name: 'أخضر', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', ring: 'ring-emerald-500' },
  { name: 'أحمر', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50', ring: 'ring-rose-500' },
  { name: 'بنفسجي', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50', ring: 'ring-indigo-500' },
  { name: 'برتقالي', bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-50', ring: 'ring-orange-500' },
  { name: 'ذهبي', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', light: 'bg-amber-50', ring: 'ring-amber-500' },
  { name: 'وردي', bg: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-600', light: 'bg-pink-50', ring: 'ring-pink-500' },
  { name: 'سحابي', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500', light: 'bg-slate-50', ring: 'ring-slate-500' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, levels, onSelectLevel, onShowCertificate, onLogout, onOpenProAnalytics, onUpdateLevelUI, onAISuggestIcons }) => {
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('dashboard_theme_mode') as any) || 'light');
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUser);
  const [userTasks, setUserTasks] = useState<TaskRecord[]>([]);
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [submissionFile, setSubmissionFile] = useState<{data: string, name: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzingOpp, setIsAnalyzingOpp] = useState(false);
  const [oppResult, setOppResult] = useState<OpportunityAnalysis | null>(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [editingLevel, setEditingLevel] = useState<LevelData | null>(null);
  const [customIcon, setCustomIcon] = useState('');
  const [customColorName, setCustomColorName] = useState('أزرق');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskFileRef = useRef<HTMLInputElement>(null);

  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      const tasks = storageService.getUserTasks(session.uid);
      setUserTasks(tasks);
      const requests = storageService.getUserServiceRequests(session.uid);
      setUserRequests(requests);

      const startups = storageService.getAllStartups();
      const currentStartup = startups.find(s => s.projectId === session.projectId);
      const usersList = storageService.getAllUsers();
      const currentUserRecord = usersList.find(u => u.uid === session.uid);

      if (currentStartup && currentUserRecord) {
        setUserProfile(prev => ({
          ...prev,
          firstName: currentUserRecord.firstName,
          lastName: currentUserRecord.lastName,
          email: currentUserRecord.email,
          phone: currentUserRecord.phone,
          startupName: currentStartup.name,
          startupDescription: currentStartup.description,
          industry: currentStartup.industry,
          logo: localStorage.getItem(`logo_${session.uid}`) || undefined
        }));
      }

      const existingRating = storageService.getProgramRating(session.uid);
      if (existingRating) setHasRated(true);
      if (progress === 100 && !existingRating) {
        setTimeout(() => setShowRatingModal(true), 3000);
      }
    }
  }, [activeNav, progress]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserProfile(prev => ({ ...prev, logo: base64 }));
        const session = storageService.getCurrentSession();
        if (session) localStorage.setItem(`logo_${session.uid}`, base64);
        playPositiveSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmissionFile({
          data: reader.result as string,
          name: file.name
        });
        playPositiveSound();
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('يرجى رفع ملف بصيغة PDF فقط.');
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    const session = storageService.getCurrentSession();
    if (session) {
      const startups = storageService.getAllStartups();
      const sIndex = startups.findIndex(s => s.projectId === session.projectId);
      if (sIndex > -1) {
        startups[sIndex].name = userProfile.startupName;
        startups[sIndex].description = userProfile.startupDescription;
        startups[sIndex].industry = userProfile.industry;
        localStorage.setItem('db_startups', JSON.stringify(startups));
      }
      storageService.updateUser(session.uid, {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone
      });
    }
    setTimeout(() => {
      setIsSaving(false);
      playCelebrationSound();
      alert('تم حفظ كافة التغييرات بنجاح.');
    }, 800);
  };

  const handleTaskSubmit = () => {
    if (!selectedTask || !submissionFile) return;
    const session = storageService.getCurrentSession();
    storageService.submitTask(session.uid, selectedTask.id, {
      fileData: submissionFile.data,
      fileName: submissionFile.name
    });
    setUserTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'SUBMITTED' } : t));
    setSelectedTask(null);
    setSubmissionFile(null);
    playCelebrationSound();
  };

  const handleRatingSubmit = (rating: ProgramRating) => {
    const session = storageService.getCurrentSession();
    if (session) {
      storageService.saveProgramRating(session.uid, rating);
      setHasRated(true);
      setShowRatingModal(false);
    }
  };

  const handleRunOppAnalysis = async () => {
    setIsAnalyzingOpp(true);
    playPositiveSound();
    try {
      const result = await discoverOpportunities(userProfile.startupName, userProfile.startupDescription, userProfile.industry);
      setOppResult(result);
      playCelebrationSound();
    } catch (e) {
      alert("فشل التحليل الاستراتيجي.");
    } finally {
      setIsAnalyzingOpp(false);
    }
  };

  const handleAISuggest = async () => {
    if (!onAISuggestIcons) return;
    setIsAISuggesting(true);
    playPositiveSound();
    try {
      await onAISuggestIcons();
      playCelebrationSound();
      alert('تم تحديث الأيقونات بناءً على توصيات الذكاء الاصطناعي.');
    } catch (e) {
      alert('فشل في جلب التوصيات.');
    } finally {
      setIsAISuggesting(false);
    }
  };

  const handleAISuggestForSingleLevel = async () => {
    if (!editingLevel) return;
    setIsAISuggesting(true);
    try {
      const iconMap = await suggestIconsForLevels([editingLevel]);
      if (iconMap[editingLevel.id]) {
        setCustomIcon(iconMap[editingLevel.id]);
        playPositiveSound();
      }
    } catch (e) {
      alert('عذراً، فشل الاقتراح التلقائي.');
    } finally {
      setIsAISuggesting(false);
    }
  };

  const handleSaveCustomization = () => {
    if (editingLevel && onUpdateLevelUI) {
      const selectedColorObj = PRESET_COLORS.find(c => c.name === customColorName) || PRESET_COLORS[0];
      onUpdateLevelUI(editingLevel.id, customIcon, selectedColorObj.name);
      setEditingLevel(null);
      playCelebrationSound();
    }
  };

  const getLevelColorSet = (colorName?: string) => {
    return PRESET_COLORS.find(c => c.name === colorName) || PRESET_COLORS[0];
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`} dir="rtl">
      <style>{`
        .sidebar-neo { backdrop-filter: blur(40px); background: ${isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.7)'}; border-left: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .dashboard-header { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(2, 6, 23, 0.6)' : 'rgba(248, 250, 252, 0.6)'}; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .active-nav { background: #2563eb; color: white; box-shadow: 0 12px 30px -10px rgba(37, 99, 235, 0.5); transform: translateX(-6px); }
        .card-neo { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); border: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}; background: ${isDark ? 'rgba(30, 41, 59, 0.25)' : 'rgba(255,255,255,0.9)'}; }
        .card-neo:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1); border-color: rgba(59, 130, 246, 0.4); }
        .timeline-bar { position: relative; }
        .timeline-bar::after { content: ''; position: absolute; top: 22px; left: 0; right: 0; height: 4px; background: ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}; z-index: 0; border-radius: 10px; }
        .timeline-fill { position: absolute; top: 22px; right: 0; height: 4px; background: linear-gradient(to left, #2563eb, #60a5fa); z-index: 1; transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 10px; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
      `}</style>

      {/* Floating Modern Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 lg:static transition-transform duration-700 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} sidebar-neo flex flex-col m-4 rounded-[3rem] shadow-premium`}>
        <div className="p-10 text-center space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-[30px] opacity-10 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-24 h-24 mx-auto relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
              {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-white text-4xl font-black">BD</span>}
            </div>
          </div>
          <div>
            <h2 className={`font-black text-xl truncate tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{userProfile.startupName}</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-emerald-500/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Growth Phase</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-6">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveNav(item.id); setIsMobileMenuOpen(false); playPositiveSound(); }} 
              className={`w-full flex items-center justify-between p-4 rounded-[1.8rem] font-bold text-sm transition-all duration-300 group ${activeNav === item.id ? 'active-nav' : `text-slate-400 hover:bg-blue-600/5 hover:text-blue-500`}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl transition-all duration-300 group-hover:scale-125 ${activeNav === item.id ? '' : 'grayscale opacity-50'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {activeNav === item.id && <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <button onClick={() => { const n = isDark ? 'light' : 'dark'; setThemeMode(n); localStorage.setItem('dashboard_theme_mode', n); }} className={`w-full p-4 rounded-2xl border transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-amber-400' : 'border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-500'} text-[10px] font-black uppercase tracking-widest`}>
             {isDark ? '☀️ Switch Theme' : '🌙 Switch Theme'}
          </button>
          <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/5 rounded-2xl transition-colors">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Experience Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 dashboard-header flex items-center justify-between px-10 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 glass rounded-2xl text-blue-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h2 className={`text-3xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{NAV_ITEMS.find(i => i.id === activeNav)?.label}</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 opacity-80">AI Accelerator v2.8</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={handleAISuggest}
                disabled={isAISuggesting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isAISuggesting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '✨'}
                <span>تحديث الأيقونات (AI)</span>
              </button>
              <button 
                onClick={() => { setIsCustomizeMode(!isCustomizeMode); playPositiveSound(); }}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isCustomizeMode ? 'bg-amber-100 border-amber-400 text-amber-700' : `${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-500 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600'}`}`}
              >
                {isCustomizeMode ? '✨ جاري التخصيص...' : '🎨 تخصيص المسار'}
              </button>
              <button onClick={onOpenProAnalytics} className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 transition-all hover:bg-blue-700">تحليلات PRO</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative">
           {activeNav === 'home' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up pb-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white premium-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                      <p className="text-[11px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">إنجاز المسار التدريبي</p>
                      <h3 className="text-6xl font-black tracking-tighter">{Math.round(progress)}%</h3>
                      <div className="mt-10 bg-white/20 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                      </div>
                   </div>
                   <div className={`p-10 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>الأوسمة المحققة</p>
                        <span className="text-3xl">🛡️</span>
                      </div>
                      <h3 className={`text-6xl font-black mt-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{completedCount}</h3>
                   </div>
                   <div className={`p-10 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>المهام المكتملة</p>
                        <span className="text-3xl">📝</span>
                      </div>
                      <h3 className={`text-6xl font-black mt-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{userTasks.filter(t => t.status === 'SUBMITTED' || t.status === 'APPROVED').length}</h3>
                   </div>
                </div>

                {/* Level Progress Map */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                      <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.6)]"></div>
                      <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>خريطة نضج المشروع</h3>
                   </div>
                   <div className={`p-14 md:p-20 rounded-[4rem] card-neo relative overflow-hidden`}>
                      <div className="timeline-bar px-8 relative z-10">
                         <div className="timeline-fill" style={{ width: `${Math.max(0, (completedCount - 0.5) / (levels.length - 0.5)) * 100}%` }}></div>
                         <div className="flex justify-between items-center relative z-10">
                            {levels.map((level, idx) => {
                              const colorSet = getLevelColorSet(level.customColor);
                              return (
                                <div key={level.id} className="flex flex-col items-center gap-6 group">
                                   <div 
                                      className={`w-14 h-14 rounded-full flex items-center justify-center text-sm border-4 transition-all duration-700 premium-shadow
                                        ${level.isCompleted 
                                          ? `${colorSet.bg} border-white text-white scale-110` 
                                          : level.isLocked ? `${isDark ? 'bg-slate-800 border-slate-900 text-slate-600' : 'bg-slate-100 border-white text-slate-300'}` : `bg-white ${colorSet.border} ${colorSet.text} animate-pulse scale-125 ring-8 ${isDark ? 'ring-blue-500/10' : 'ring-blue-100'}`
                                        }
                                      `}
                                   >
                                      {level.isCompleted ? '✓' : idx + 1}
                                   </div>
                                   <p className={`text-[10px] font-black uppercase tracking-tight text-center max-w-[80px] ${level.isLocked ? 'text-slate-600' : (isDark ? 'text-white' : 'text-slate-900')}`}>
                                      {level.title.split(' ')[0]}
                                   </p>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Vertical Level List */}
                <div className="space-y-8">
                   <div className="flex justify-between items-center px-4">
                      <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>تفاصيل محطات التسريع</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{completedCount} من {levels.length} مكتمل</span>
                   </div>
                   
                   <div className={`rounded-[3.5rem] card-neo overflow-hidden`}>
                      <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                        {levels.map((level) => {
                          const colorSet = getLevelColorSet(level.customColor);
                          const canCustomize = level.id <= 6;
                          
                          return (
                            <div 
                              key={level.id} 
                              onClick={() => !level.isLocked && !isCustomizeMode && onSelectLevel(level.id)} 
                              className={`p-8 flex items-center justify-between transition-all duration-300 ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : (isCustomizeMode ? 'cursor-default' : 'cursor-pointer hover:bg-blue-600/[0.03]')} group`}
                            >
                               <div className="flex items-center gap-8 flex-1 min-w-0">
                                  <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-4xl shrink-0 transition-all premium-shadow ${level.isCompleted ? (colorSet.bg) + ' text-white' : (level.isLocked ? (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300') : colorSet.light + ' ' + colorSet.text)} group-hover:scale-110 group-hover:rotate-3`}>
                                     {level.isCompleted ? '✓' : level.icon}
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-3">
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>LEVEL 0{level.id}</span>
                                      <h4 className={`font-black text-xl transition-colors ${!level.isLocked ? 'group-hover:' + colorSet.text : ''}`}>
                                        {level.title}
                                      </h4>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium truncate mt-1.5 opacity-80">{level.description}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-6 shrink-0 px-6">
                                  {(isCustomizeMode && canCustomize) ? (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingLevel(level); setCustomIcon(level.icon); setCustomColorName(level.customColor || 'أزرق'); playPositiveSound(); }}
                                      className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-black text-[11px] uppercase shadow-xl shadow-amber-500/20 active:scale-90 transition-all hover:bg-amber-600"
                                    >
                                      تعديل المظهر
                                    </button>
                                  ) : (
                                    <>
                                       {level.isLocked ? (
                                          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${isDark ? 'bg-slate-900 border-white/5 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                             <span className="text-xs">🔒</span>
                                             <span className="text-[10px] font-black uppercase tracking-widest">مغلق حالياً</span>
                                          </div>
                                       ) : (
                                          <div className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl border transition-all duration-300 ${level.isCompleted ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1'}`}>
                                             <span className="text-[10px] font-black uppercase tracking-widest">{level.isCompleted ? 'مكتمل بنجاح' : 'دخول المحطة'}</span>
                                             <span className="text-xl leading-none">{level.isCompleted ? '✓' : '→'}</span>
                                          </div>
                                       )}
                                    </>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeNav === 'tasks' && (
             <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {userTasks.map(task => (
                     <div key={task.id} className="p-10 rounded-[3.5rem] card-neo">
                        <div className="flex justify-between items-center mb-8">
                           <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Milestone 0{task.levelId}</span>
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${task.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 border-blue-100' : task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{task.status}</span>
                        </div>
                        <h4 className="text-2xl font-black mb-4 leading-tight">{task.title}</h4>
                        <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">{task.description}</p>
                        {task.status === 'ASSIGNED' && (
                           <button 
                              onClick={() => setSelectedTask(task)} 
                              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                           >
                              تسليم المخرج النهائي (PDF)
                           </button>
                        )}
                        {task.status === 'SUBMITTED' && (
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تم رفع الملف: {task.submission?.fileName}</p>
                              <p className="text-[10px] text-emerald-500 font-bold mt-1">جاري مراجعة المخرج النهائي</p>
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'opportunity_lab' && (
             <div className="max-w-6xl mx-auto space-y-14 animate-fade-in-up pb-20">
                <div className="text-center space-y-6">
                   <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 mx-auto">
                      AI Deep Analysis Engine
                   </div>
                   <h3 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">مختبر الفرص والنمو</h3>
                   <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">استخدم وكلاء Gemini المتطورين لاكتشاف أسواق جديدة غير مخدومة لمشروعك.</p>
                </div>
                {!oppResult && (
                  <div className="flex flex-col items-center py-24 space-y-10">
                     <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-5xl animate-bounce">🧭</div>
                     <button onClick={handleRunOppAnalysis} disabled={isAnalyzingOpp} className="px-16 py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-5">
                        {isAnalyzingOpp ? (
                          <>
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>جاري المسح الاستراتيجي...</span>
                          </>
                        ) : 'تفعيل محرك المسح الاستراتيجي'}
                     </button>
                  </div>
                )}
                {oppResult && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up">
                    <div className="lg:col-span-2 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {oppResult.newMarkets.map((m, i) => (
                            <div key={i} className={`p-10 rounded-[3.5rem] card-neo relative overflow-hidden`}>
                               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem]"></div>
                               <h5 className="text-2xl font-black text-blue-600 mb-6">{m.region}</h5>
                               <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{m.reasoning}</p>
                               <div className="mt-8 flex items-center gap-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ROI Potential:</span>
                                  <span className="text-sm font-black text-emerald-500">{m.potentialROI}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="p-12 bg-gradient-to-br from-indigo-600 to-blue-800 text-white rounded-[4rem] premium-shadow relative overflow-hidden group">
                          <div className="absolute top-[-20px] left-[-20px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">💭</div>
                          <h4 className="text-xl font-black mb-8 relative z-10 flex items-center gap-4">
                             <span className="w-1.5 h-6 bg-white/40 rounded-full"></span>
                             استراتيجية المحيط الأزرق
                          </h4>
                          <p className="italic font-medium text-xl leading-relaxed opacity-95 relative z-10">"{oppResult.blueOceanIdea}"</p>
                       </div>
                    </div>
                  </div>
                )}
             </div>
           )}

           {activeNav === 'services' && (
             <div className="max-w-6xl mx-auto space-y-14 animate-fade-in pb-20">
                <div className="text-center space-y-4">
                   <h3 className="text-5xl font-black tracking-tight">خدمات التنفيذ المتميزة</h3>
                   <p className="text-slate-500 text-lg font-medium">فريق متخصص لنمذجة مخرجاتك الريادية بجودة استثمارية عالمية.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {SERVICES_CATALOG.map(svc => (
                     <div key={svc.id} className={`p-12 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                        <div>
                          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner">{svc.icon}</div>
                          <h4 className="text-2xl font-black mb-4 leading-tight">{svc.title}</h4>
                          <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium line-clamp-3">{svc.description}</p>
                        </div>
                        <button onClick={() => setSelectedService(svc)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg">اكتشف الباقات المتاحة</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'startup_profile' && (
             <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20">
                <div className={`p-14 rounded-[4rem] card-neo space-y-12`}>
                   <div className="flex flex-col md:flex-row gap-16 items-center">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                         <div className="w-48 h-48 rounded-[3.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 overflow-hidden premium-shadow group-hover:border-blue-500 transition-colors">
                           {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-6xl opacity-30">📁</span>}
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[3.5rem] transition-opacity font-black text-xs uppercase tracking-widest">تغيير الشعار</div>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </div>
                      <div className="flex-1 space-y-8 w-full">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">اسم المشروع</label>
                               <input className={`w-full p-5 rounded-2xl border outline-none font-bold ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`} value={userProfile.startupName} onChange={e => setUserProfile({...userProfile, startupName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">القطاع</label>
                               <select className={`w-full p-5 rounded-2xl border outline-none font-bold ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`} value={userProfile.industry} onChange={e => setUserProfile({...userProfile, industry: e.target.value})}>
                                  {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الوصف الاستراتيجي للمشروع</label>
                            <textarea className={`w-full h-40 p-6 rounded-2xl border outline-none font-medium text-base resize-none ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all leading-relaxed`} value={userProfile.startupDescription} onChange={e => setUserProfile({...userProfile, startupDescription: e.target.value})} />
                         </div>
                         <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform active:scale-95">
                            {isSaving ? (
                              <div className="flex items-center justify-center gap-4">
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>جاري الحفظ...</span>
                              </div>
                            ) : 'حفظ التعديلات الاستراتيجية'}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Level Editing Modal */}
        {editingLevel && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
            <div className={`max-w-xl w-full p-14 rounded-[4rem] border shadow-3xl ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="text-3xl font-black tracking-tight">تخصيص: المستوى {editingLevel.id}</h3>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Appearance Configuration</p>
                </div>
                <button onClick={() => setEditingLevel(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">✕</button>
              </div>

              <div className="flex flex-col items-center gap-12">
                <div className={`w-36 h-36 rounded-[3rem] flex items-center justify-center text-7xl shadow-2xl transition-all duration-700 ${getLevelColorSet(customColorName).bg} text-white premium-shadow`}>
                  {customIcon || editingLevel.icon}
                </div>
                <div className="w-full space-y-8">
                  <div className="relative group">
                    <input 
                      className={`w-full p-6 text-5xl text-center rounded-[2.5rem] border-2 outline-none font-serif ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} focus:border-blue-500 transition-all`} 
                      value={customIcon} 
                      onChange={e => setCustomIcon(e.target.value.substring(0,4))} 
                      placeholder="Icon" 
                    />
                    <button 
                      onClick={handleAISuggestForSingleLevel}
                      disabled={isAISuggesting}
                      title="اقتراح أيقونة بالذكاء الاصطناعي"
                      className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
                    >
                      {isAISuggesting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '✨'}
                    </button>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">اختيار هوية اللون</p>
                     <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                       {PRESET_COLORS.map(color => (
                         <button key={color.name} onClick={() => { setCustomColorName(color.name); playPositiveSound(); }} className={`w-10 h-10 rounded-2xl ${color.bg} border-4 transition-all ${customColorName === color.name ? 'border-white ring-4 ' + color.ring + ' scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`} />
                       ))}
                     </div>
                  </div>
                </div>
                <div className="flex gap-4 w-full pt-6">
                  <button onClick={() => setEditingLevel(null)} className="flex-1 py-5 rounded-3xl font-black text-slate-400 hover:text-slate-600 transition-colors">إلغاء</button>
                  <button onClick={handleSaveCustomization} className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-700">حفظ التفضيلات</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Submission Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
            <div className={`max-w-2xl w-full p-12 rounded-[4rem] ${isDark ? 'bg-slate-900 border border-white/5 text-white' : 'bg-white shadow-2xl text-slate-900'} animate-fade-in-up`}>
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black tracking-tight">تسليم: {selectedTask.title}</h3>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Deliverable Submission Portal (PDF Only)</p>
                 </div>
                 <button onClick={() => { setSelectedTask(null); setSubmissionFile(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">✕</button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-8">
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{selectedTask.description}</p>
              </div>
              
              <div 
                onClick={() => taskFileRef.current?.click()}
                className={`w-full h-64 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                  ${submissionFile ? 'bg-emerald-500/5 border-emerald-500' : (isDark ? 'bg-slate-800 border-white/5 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-500/50')}
                `}
              >
                 <input type="file" ref={taskFileRef} className="hidden" accept="application/pdf" onChange={handleTaskFileUpload} />
                 {submissionFile ? (
                   <>
                      <span className="text-5xl mb-4">📄</span>
                      <p className="font-black text-emerald-500 text-lg">{submissionFile.name}</p>
                      <p className="text-xs text-slate-400 mt-2">انقر لتغيير الملف</p>
                   </>
                 ) : (
                   <>
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-6 transform group-hover:scale-110 transition-transform">📁</div>
                      <p className="font-black text-slate-400">انقر هنا لرفع مخرجك النهائي بصيغة PDF</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Maximum Size: 5MB</p>
                   </>
                 )}
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => { setSelectedTask(null); setSubmissionFile(null); }} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors">إغلاق</button>
                <button onClick={handleTaskSubmit} disabled={!submissionFile} className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-95 transition-all hover:bg-blue-700">إرسال المخرج للمراجعة 🚀</button>
              </div>
            </div>
          </div>
        )}

        {showRatingModal && <ProgramEvaluation onClose={() => setShowRatingModal(false)} onSubmit={handleRatingSubmit} />}
      </main>
    </div>
  );
};
