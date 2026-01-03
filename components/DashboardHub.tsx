
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, ProgramRating, ACADEMY_BADGES, FiltrationStage } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { LevelView } from './LevelView';
import { ProgramEvaluation } from './ProgramEvaluation';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
  onNavigateToStage: (stage: any) => void;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout, onNavigateToStage }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'evaluation' | 'settings'>('roadmap');
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [existingRating, setExistingRating] = useState<ProgramRating | null>(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      setRoadmap(storageService.getCurrentRoadmap(user.uid));
      setTasks(storageService.getUserTasks(user.uid));
      setExistingRating(storageService.getProgramRating(user.uid));
      
      const users = storageService.getAllUsers();
      const currentUser = users.find((u: any) => u.uid === user.uid) as any;
      if (currentUser) {
        setEarnedBadgeIds(currentUser.earnedBadges || []);
      }
    };
    loadData();
    const interval = setInterval(loadData, 3000); 
    return () => clearInterval(interval);
  }, [user.uid]);

  const stats = useMemo(() => {
    const completed = roadmap.filter(l => l.isCompleted).length;
    const progress = Math.round((completed / roadmap.length) * 100);
    
    // Calculate aggregate AI Score
    const scoredTasks = tasks.filter(t => t.status === 'APPROVED' && t.aiReview?.score);
    const totalScore = scoredTasks.reduce((sum, t) => sum + (t.aiReview?.score || 0), 0);
    const avgScore = scoredTasks.length > 0 ? Math.round(totalScore / scoredTasks.length) : 0;
    
    return { progress, avgScore, completedCount: completed };
  }, [roadmap, tasks]);

  const handleEvaluationSubmit = (rating: ProgramRating) => {
    storageService.saveProgramRating(user.uid, rating);
    setExistingRating(rating);
    setActiveTab('roadmap');
    playPositiveSound();
  };

  if (selectedLevel) {
    return (
      <LevelView 
        level={selectedLevel} 
        user={user} 
        tasks={tasks}
        onBack={() => setSelectedLevel(null)} 
        onComplete={() => setSelectedLevel(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">BD</div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">بيزنس ديفلوبرز</h1>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المسار النشط</p>
              <p className="text-xs font-bold text-slate-900 truncate">{user.startupName}</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-1000" style={{width: `${stats.progress}%`}}></div>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
           {[
             { id: 'roadmap', label: 'خارطة الطريق', icon: '🛣️' },
             { id: 'tasks', label: 'مركز المخرجات', icon: '📥' },
             { id: 'evaluation', label: 'تقييم البرنامج', icon: '⭐' },
             { id: 'settings', label: 'الإعدادات', icon: '⚙️' }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all
                 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
               `}
             >
               <span className="text-xl">{item.icon}</span>
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === 'roadmap' ? 'منهج التسريع المكثف' : 
                 activeTab === 'tasks' ? 'تسليم المخرجات' : 
                 activeTab === 'evaluation' ? 'تقييم التجربة الريادية' : 'إعدادات الحساب'}
              </h2>
              <p className="text-slate-500 font-medium mt-1">أهلاً بك، {user.firstName}. إجمالي تقييم أداءك: <span className="text-blue-600 font-black">{stats.avgScore}%</span></p>
           </div>
           
           <div className="flex gap-3 items-center">
              <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">التقييم العام</p>
                 <p className={`text-xl font-black text-center ${stats.avgScore >= 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{stats.avgScore}%</p>
              </div>
              <div className="h-10 w-px bg-slate-200 mx-2"></div>
              <div className="flex gap-2">
                {ACADEMY_BADGES.map(badge => (
                  <div 
                    key={badge.id} 
                    title={badge.name}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-700 border
                      ${earnedBadgeIds.includes(badge.id) 
                        ? `bg-gradient-to-br ${badge.color} text-white shadow-lg border-transparent scale-105` 
                        : 'bg-slate-100 text-slate-300 border-slate-200 opacity-40 grayscale'}
                    `}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
           </div>
        </header>

        {/* Qualification Banner for Elite Admission */}
        {stats.avgScore >= 90 && stats.completedCount >= 1 && (
          <div className="mb-12 p-8 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-fade-in group">
             <div className="absolute top-[-20px] left-[-20px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-1000">💎</div>
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/30 mb-2">Elite Qualification Unlocked</div>
                   <h3 className="text-3xl font-black">أنت مؤهل للانتقال إلى مسار الاستثمار!</h3>
                   <p className="text-emerald-50 font-medium text-lg max-w-2xl">بناءً على نتائجك الاستثنائية (تجاوزت ٩٠٪)، قمنا بترشيحك لخدمة الانضمام إلى مسرعة الأعمال المباشرة (Direct In-Person/Pro Hybrid).</p>
                </div>
                <button 
                  onClick={() => { playCelebrationSound(); onNavigateToStage(FiltrationStage.INCUBATION_PROGRAM); }}
                  className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                   اطلب الانضمام للمسرعة الآن
                </button>
             </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
            {roadmap.map((level, i) => (
              <div 
                key={level.id}
                onClick={() => !level.isLocked && setSelectedLevel(level)}
                className={`group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 
                  ${level.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200'}
                `}
              >
                <div className="aspect-video relative overflow-hidden">
                   <img src={level.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-slate-900/40"></div>
                   <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-xl">{level.icon}</div>
                   {level.isCompleted && (
                     <div className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">مكتمل ✓</div>
                   )}
                </div>
                <div className="p-8 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">المحطة 0{level.id}</span>
                      {level.isLocked && <span className="text-slate-400 text-xs">🔒 مغلق</span>}
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{level.title}</h3>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">{level.description}</p>
                   <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">المدة المتوقعة: أسبوع</span>
                      {!level.isLocked && <span className="text-blue-600 font-black text-[10px] uppercase tracking-tighter group-hover:translate-x-[-4px] transition-transform">دخول المحطة ←</span>}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs remain unchanged */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-fade-up max-w-4xl">
             {tasks.map(task => (
               <div key={task.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-8">
                     <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-2xl shadow-inner 
                       ${task.status === 'LOCKED' ? 'bg-slate-50 text-slate-300' : 'bg-blue-50 text-blue-600'}
                     `}>
                        {task.status === 'APPROVED' ? '✅' : '📄'}
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-xl font-black text-slate-900">{task.title}</h4>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border 
                             ${task.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                               task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                               task.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                               'bg-slate-50 text-slate-400 border-slate-100'}
                           `}>
                              {task.status}
                           </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">{task.description}</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-3">
                     {task.status === 'ASSIGNED' && (
                       <button 
                        onClick={() => setSelectedLevel(roadmap.find(l => l.id === task.levelId) || null)}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                       >
                         رفع المخرج
                       </button>
                     )}
                     {task.status === 'APPROVED' && task.aiReview && (
                        <div className="text-left px-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نتيجة الذكاء الاصطناعي</p>
                           <p className="text-lg font-black text-emerald-600">{task.aiReview.score}%</p>
                        </div>
                     )}
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="max-w-3xl mx-auto">
             {existingRating ? (
               <div className="card-premium p-12 text-center space-y-8 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">✓</div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-black text-slate-900">شكراً لتقييمك الصادق!</h3>
                     <p className="text-slate-500 font-medium">لقد أعطيت البرنامج {existingRating.stars} نجوم.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ملاحظاتك المسجلة:</p>
                     <p className="text-slate-700 font-medium leading-relaxed italic">"{existingRating.feedback || 'لم تترك تعليقاً نصياً'}"</p>
                  </div>
                  <button onClick={() => setExistingRating(null)} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">تعديل التقييم</button>
               </div>
             ) : (
               <ProgramEvaluation 
                 onClose={() => setActiveTab('roadmap')} 
                 onSubmit={handleEvaluationSubmit} 
               />
             )}
          </div>
        )}
      </main>
    </div>
  );
};
