
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
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [requestDetails, setRequestDetails] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [editingLevel, setEditingLevel] = useState<LevelData | null>(null);
  const [customIcon, setCustomIcon] = useState('');
  const [customColorName, setCustomColorName] = useState('أزرق');

  const [oppResult, setOppResult] = useState<OpportunityAnalysis | null>(null);
  const [isAnalyzingOpp, setIsAnalyzingOpp] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
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
    if (!selectedTask || !submissionText.trim()) return;
    const session = storageService.getCurrentSession();
    storageService.submitTask(session.uid, selectedTask.id, submissionText);
    setUserTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'SUBMITTED' } : t));
    setSelectedTask(null);
    setSubmissionText('');
    playPositiveSound();
  };

  const handleRatingSubmit = (rating: ProgramRating) => {
    const session = storageService.getCurrentSession();
    if (session) {
      storageService.saveProgramRating(session.uid, rating);
      setHasRated(true);
      setShowRatingModal(false);
    }
  };

  const handleServiceRequest = () => {
    if (!selectedService || !selectedPackage) return;
    setIsRequesting(true);
    const session = storageService.getCurrentSession();
    
    setTimeout(() => {
      const newReq = storageService.requestService(session.uid, selectedService.id, selectedPackage.id, requestDetails);
      setUserRequests(prev => [...prev, newReq]);
      setIsRequesting(false);
      setSelectedService(null);
      setSelectedPackage(null);
      setRequestDetails('');
      playCelebrationSound();
      alert('تم إرسال طلب الخدمة بنجاح، سيقوم مستشارنا بالتواصل معك لمناقشة التفاصيل.');
    }, 1200);
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
    <div className={`min-h-screen flex ${isDark ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`} dir="rtl">
      <style>{`
        .sidebar-blur { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'}; }
        .dashboard-header { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(248, 250, 252, 0.7)'}; }
        .active-nav { background: #2563eb; color: white; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3); }
        .card-pro { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .card-pro:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); border-color: #3b82f6; }
        .timeline-bar { position: relative; }
        .timeline-bar::after { content: ''; position: absolute; top: 18px; left: 0; right: 0; height: 3px; background: ${isDark ? '#1e293b' : '#e2e8f0'}; z-index: 0; border-radius: 10px; }
        .timeline-fill { position: absolute; top: 18px; right: 0; height: 3px; background: #3b82f6; z-index: 1; transition: width 1s ease-in-out; border-radius: 10px; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
      `}</style>

      {/* Modern Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-80 lg:static transition-transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} sidebar-blur border-l ${isDark ? 'border-white/5' : 'border-slate-200'} flex flex-col`}>
        <div className="p-10 text-center space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-20 h-20 mx-auto relative bg-blue-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/10">
              {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-white text-3xl font-black">BD</span>}
            </div>
          </div>
          <div>
            <h2 className={`font-black text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{userProfile.startupName}</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Virtual Startup Core</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveNav(item.id); setIsMobileMenuOpen(false); playPositiveSound(); }} 
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${activeNav === item.id ? 'active-nav' : `text-slate-400 hover:bg-white/5 hover:text-white`}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl transition-transform group-hover:scale-110 ${activeNav === item.id ? '' : 'grayscale opacity-60'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-3">
          <button onClick={() => { const n = isDark ? 'light' : 'dark'; setThemeMode(n); localStorage.setItem('dashboard_theme_mode', n); }} className={`w-full p-4 rounded-2xl border ${isDark ? 'border-white/5 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'} text-[11px] font-black uppercase tracking-widest transition-all hover:border-blue-500`}>
             {isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
          </button>
          <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:text-rose-400 transition-colors">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 dashboard-header flex items-center justify-between px-10 border-b border-white/5 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{NAV_ITEMS.find(i => i.id === activeNav)?.label}</h2>
           </div>
           <div className="flex items-center gap-4">
              {isCustomizeMode && (
                <button 
                  onClick={handleAISuggest}
                  disabled={isAISuggesting}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isAISuggesting ? 'جاري التحليل...' : '✨ تحسين بالذكاء الاصطناعي'}
                </button>
              )}
              <button 
                onClick={() => { setIsCustomizeMode(!isCustomizeMode); playPositiveSound(); }}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isCustomizeMode ? 'bg-amber-100 border-amber-400 text-amber-700' : `${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-500'}`}`}
              >
                {isCustomizeMode ? '✨ جاري التخصيص...' : '🎨 تخصيص المسار'}
              </button>
              <button onClick={onOpenProAnalytics} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">تحليلات PRO</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
           {activeNav === 'home' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
                      <p className="text-[11px] font-black uppercase opacity-60 mb-2">إنجاز المسار التدريبي</p>
                      <h3 className="text-5xl font-black tracking-tighter">{Math.round(progress)}%</h3>
                      <div className="mt-8 bg-white/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                      </div>
                   </div>
                   <div className={`p-8 rounded-[2.5rem] card-pro ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>الأوسمة والدروع</p>
                      <h3 className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>🛡️ {completedCount}</h3>
                   </div>
                   <div className={`p-8 rounded-[2.5rem] card-pro ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>طلبات الخدمات</p>
                      <h3 className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>🛠️ {userRequests.length}</h3>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-4 px-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>خريطة النضج الاستراتيجي</h3>
                   </div>
                   <div className={`p-10 md:p-14 rounded-[3.5rem] card-pro ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
                      <div className="timeline-bar px-4">
                         <div className="timeline-fill" style={{ width: `${Math.max(0, (completedCount - 0.5) / 5.5) * 100}%` }}></div>
                         <div className="flex justify-between items-center relative z-10">
                            {levels.map((level, idx) => {
                              const colorSet = getLevelColorSet(level.customColor);
                              return (
                                <div key={level.id} className="flex flex-col items-center gap-6">
                                   <div 
                                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs border-4 transition-all duration-700
                                        ${level.isCompleted 
                                          ? `${colorSet.bg} border-white text-white shadow-xl scale-110` 
                                          : level.isLocked ? `${isDark ? 'bg-slate-800 border-slate-900 text-slate-600' : 'bg-slate-100 border-white text-slate-300'}` : `bg-white ${colorSet.border} ${colorSet.text} animate-pulse scale-125 shadow-lg shadow-blue-500/20`
                                        }
                                      `}
                                   >
                                      {level.isCompleted ? '✓' : idx + 1}
                                   </div>
                                   <div className="text-center max-w-[80px]">
                                      <p className={`text-[10px] font-black leading-tight uppercase ${level.isLocked ? 'text-slate-600' : (isDark ? 'text-white' : 'text-slate-900')}`}>
                                         {level.title.split(' ')[0]}
                                      </p>
                                   </div>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>المنهج التدريبي التفاعلي</h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{completedCount} من {levels.length} مكتمل</span>
                   </div>
                   
                   <div className={`rounded-[3.5rem] card-pro ${isDark ? 'bg-slate-900/50' : 'bg-white'} overflow-hidden`}>
                      <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                        {levels.map((level) => {
                          const colorSet = getLevelColorSet(level.customColor);
                          const canCustomize = level.id <= 5;
                          return (
                            <div 
                              key={level.id} 
                              onClick={() => !level.isLocked && !isCustomizeMode && onSelectLevel(level.id)} 
                              className={`p-6 flex items-center justify-between transition-all ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : (isCustomizeMode ? 'cursor-default' : 'cursor-pointer hover:bg-blue-600/[0.03]')} group`}
                            >
                               <div className="flex items-center gap-6 flex-1 min-w-0">
                                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-3xl shrink-0 transition-all shadow-sm ${level.isCompleted ? (colorSet.bg) + ' text-white' : (level.isLocked ? (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300') : colorSet.light + ' ' + colorSet.text)}`}>
                                     {level.isCompleted ? '✓' : level.icon}
                                  </div>
                                  <div className="truncate">
                                    <h4 className={`font-black text-lg transition-colors ${!level.isLocked ? 'group-hover:' + colorSet.text : ''}`}>
                                      <span className="text-slate-500 text-[11px] font-bold ml-2">LEVEL 0{level.id}</span>
                                      {level.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium truncate mt-1">{level.description}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-4 shrink-0 px-6">
                                  {(isCustomizeMode && canCustomize) ? (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingLevel(level); setCustomIcon(level.icon); setCustomColorName(level.customColor || 'أزرق'); playPositiveSound(); }}
                                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-black text-[10px] uppercase shadow-lg shadow-amber-500/20 active:scale-90 transition-all"
                                    >
                                      تعديل المظهر
                                    </button>
                                  ) : (
                                    <>
                                       {level.isLocked ? (
                                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                             <span className="text-[10px]">🔒</span>
                                             <span className="text-[9px] font-black uppercase tracking-tighter">مغلق</span>
                                          </div>
                                       ) : (
                                          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${level.isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20'}`}>
                                             <span className="text-[10px]">{level.isCompleted ? '●' : '→'}</span>
                                             <span className="text-[10px] font-black uppercase tracking-widest">{level.isCompleted ? 'مكتمل' : 'دخول'}</span>
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
             <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {userTasks.map(task => (
                     <div key={task.id} className={`p-8 rounded-[2.5rem] card-pro ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'} ${task.status === 'LOCKED' ? 'opacity-40 grayscale' : ''}`}>
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Level 0{task.levelId}</span>
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${task.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-600' : task.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{task.status}</span>
                        </div>
                        <h4 className="text-xl font-black mb-4">{task.title}</h4>
                        <p className="text-xs text-slate-500 mb-8">{task.description}</p>
                        {task.status === 'ASSIGNED' && (
                           <button 
                              onClick={() => setSelectedTask(task)} 
                              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                           >
                              تسليم المخرج
                           </button>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'opportunity_lab' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
                <div className="text-center space-y-6">
                   <h3 className="text-4xl font-black">مختبر الفرص والنمو (AI)</h3>
                   <p className="text-slate-500 max-w-2xl mx-auto font-medium">استخدم وكلاء Gemini لاكتشاف أسواق جديدة غير مخدومة لمشروعك.</p>
                </div>
                {!oppResult && (
                  <div className="flex flex-col items-center py-20 space-y-8">
                     <button onClick={handleRunOppAnalysis} disabled={isAnalyzingOpp} className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4">
                        {isAnalyzingOpp ? 'جاري التحليل الاستراتيجي...' : 'تفعيل مسح الفرص الاستراتيجي'}
                     </button>
                  </div>
                )}
                {oppResult && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
                    <div className="lg:col-span-2 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {oppResult.newMarkets.map((m, i) => (
                            <div key={i} className={`p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : ''}`}>
                               <h5 className="text-xl font-black text-blue-600 mb-4">{m.region}</h5>
                               <p className="text-sm text-slate-500 font-medium leading-relaxed">{m.reasoning}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3.5rem] shadow-2xl">
                          <h4 className="text-lg font-black mb-6">استراتيجية المحيط الأزرق</h4>
                          <p className="italic font-medium leading-loose opacity-95">"{oppResult.blueOceanIdea}"</p>
                       </div>
                    </div>
                  </div>
                )}
             </div>
           )}

           {activeNav === 'services' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
                <div className="text-center space-y-4">
                   <h3 className="text-4xl font-black">خدمات التنفيذ المتميزة</h3>
                   <p className="text-slate-500">فريق متخصص لنمذجة مخرجاتك الريادية بجودة عالمية.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {SERVICES_CATALOG.map(svc => (
                     <div key={svc.id} className={`p-10 rounded-[3rem] card-pro ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
                        <div className="text-5xl mb-6">{svc.icon}</div>
                        <h4 className="text-2xl font-black mb-4">{svc.title}</h4>
                        <p className="text-sm text-slate-500 mb-10 line-clamp-3">{svc.description}</p>
                        <button onClick={() => setSelectedService(svc)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">اكتشف الباقات</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'startup_profile' && (
             <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
                <div className={`p-12 rounded-[3.5rem] card-pro ${isDark ? 'bg-slate-900/50' : 'bg-white'} space-y-10`}>
                   <div className="flex flex-col md:flex-row gap-12 items-center">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                         <div className="w-40 h-40 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
                           {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-5xl">📁</span>}
                         </div>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </div>
                      <div className="flex-1 space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-xs font-black text-slate-500 uppercase">اسم المشروع</label>
                               <input className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50'}`} value={userProfile.startupName} onChange={e => setUserProfile({...userProfile, startupName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-black text-slate-500 uppercase">القطاع</label>
                               <select className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50'}`} value={userProfile.industry} onChange={e => setUserProfile({...userProfile, industry: e.target.value})}>
                                  {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">الوصف الاستراتيجي</label>
                            <textarea className={`w-full h-32 p-4 rounded-xl border outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50'} resize-none`} value={userProfile.startupDescription} onChange={e => setUserProfile({...userProfile, startupDescription: e.target.value})} />
                         </div>
                         <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">
                            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Modals placed correctly inside main container div but outside content scrolling area */}
        {editingLevel && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in" dir="rtl">
            <div className={`max-w-xl w-full p-12 rounded-[4rem] border shadow-3xl ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
              <h3 className="text-3xl font-black mb-10 text-center">تخصيص: المستوى {editingLevel.id}</h3>
              <div className="flex flex-col items-center gap-12">
                <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-7xl shadow-2xl transition-all duration-500 ${getLevelColorSet(customColorName).bg} text-white`}>
                  {customIcon || editingLevel.icon}
                </div>
                <div className="w-full space-y-8">
                  <div className="relative group">
                    <input 
                      className={`w-full p-6 text-4xl text-center rounded-[2rem] border-2 outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`} 
                      value={customIcon} 
                      onChange={e => setCustomIcon(e.target.value.substring(0,4))} 
                      placeholder="الأيقونة" 
                    />
                    <button 
                      onClick={handleAISuggestForSingleLevel}
                      disabled={isAISuggesting}
                      title="اقتراح أيقونة بالذكاء الاصطناعي"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
                    >
                      {isAISuggesting ? '⏳' : '✨'}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {PRESET_COLORS.map(color => (
                      <button key={color.name} onClick={() => setCustomColorName(color.name)} className={`w-10 h-10 rounded-xl ${color.bg} border-4 ${customColorName === color.name ? 'border-white ring-4 ' + color.ring : 'border-transparent opacity-40 hover:opacity-100 transition-all'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 w-full pt-6">
                  <button onClick={() => setEditingLevel(null)} className="flex-1 py-5 rounded-3xl font-black text-slate-500 hover:text-slate-700 transition-colors">إلغاء</button>
                  <button onClick={handleSaveCustomization} className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl active:scale-95 transition-all">حفظ التفضيلات</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md" dir="rtl">
            <div className={`max-w-xl w-full p-10 rounded-[3rem] ${isDark ? 'bg-slate-900 border border-white/5 text-white' : 'bg-white shadow-2xl text-slate-900'} text-right animate-fade-in-up`}>
              <h3 className="text-2xl font-black mb-4">تسليم: {selectedTask.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{selectedTask.description}</p>
              <textarea className={`w-full h-64 p-6 rounded-3xl border outline-none focus:border-blue-500 mb-8 font-medium ${isDark ? 'bg-white/5 border-white/5 focus:bg-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'} transition-all resize-none shadow-inner`} placeholder="الصق الرابط أو التفاصيل هنا..." value={submissionText} onChange={e => setSubmissionText(e.target.value)} />
              <div className="flex gap-4">
                <button onClick={() => setSelectedTask(null)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors">إلغاء</button>
                <button onClick={handleTaskSubmit} disabled={!submissionText.trim()} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl disabled:opacity-30 active:scale-95 transition-all">تأكيد التسليم</button>
              </div>
            </div>
          </div>
        )}

        {showRatingModal && <ProgramEvaluation onClose={() => setShowRatingModal(false)} onSubmit={handleRatingSubmit} />}
      </main>
    </div>
  );
};
