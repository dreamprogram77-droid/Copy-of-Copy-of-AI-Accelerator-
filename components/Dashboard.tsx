
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
  const [submissionText, setSubmissionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzingOpp, setIsAnalyzingOpp] = useState(false);
  const [oppResult, setOppResult] = useState<OpportunityAnalysis | null>(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [editingLevel, setEditingLevel] = useState<LevelData | null>(null);
  const [customIcon, setCustomIcon] = useState('');
  const [customColorName, setCustomColorName] = useState('أزرق');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white premium-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                      <p className="text-[11px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">إنجاز المسار التدريبي</p>
                      