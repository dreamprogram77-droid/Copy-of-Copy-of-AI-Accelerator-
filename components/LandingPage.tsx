
import React, { useState, useEffect } from 'react';

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
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPathFinder, onRoadmap, onTools, onAchievements, onMentorship, onIncubation, onMemberships, onLegalClick, onLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

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

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden scroll-smooth ${isDark ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-500`} dir="rtl">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .hero-glow {
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, ${isDark ? '0.15' : '0.1'}), transparent 70%);
        }
        .nav-blur { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)'}; }
        .feature-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .feature-card:hover { transform: translateY(-10px) scale(1.02); background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 1)'}; }
        .dark .feature-card:hover { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3); }
        .feature-card:hover { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 nav-blur border-b border-black/5 dark:border-white/5 shadow-2xl' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all group-hover:rotate-12">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tight leading-none uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>بيزنس ديفلوبرز</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">AI Virtual Accelerator</span>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8 items-center text-xs font-black uppercase tracking-widest">
            <button onClick={onIncubation} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">الاحتضان</button>
            <button onClick={onMemberships} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">الباقات</button>
            <button onClick={onRoadmap} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">الخارطة</button>
            <button onClick={onTools} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">الأدوات</button>
            <button onClick={onMentorship} className="text-slate-500 hover:text-blue-500 transition-all hover:-translate-y-0.5">الإرشاد</button>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
            
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button onClick={onLogin} className={`${isDark ? 'text-white' : 'text-slate-900'} hover:text-blue-500 transition-all`}>دخول</button>
            <button onClick={onStart} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95">ابدأ مجاناً</button>
          </div>

          <button className={`lg:hidden p-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50"></div>
        <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'} rounded-full blur-[120px] animate-pulse`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-500/5'} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10 text-right animate-fade-in-up">
            <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] font-black border uppercase tracking-widest ${isDark ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              مستقبل الشركات الناشئة المدعوم بالـ AI
            </div>
            
            <h1 className={`text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ابنِ مشروعك <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-500">بمعايير عالمية.</span>
            </h1>
            
            <p className={`text-xl max-w-xl leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              أول مسرعة أعمال افتراضية في الشرق الأوسط تدمج ذكاء Gemini 3 Pro في كل خطوة؛ من فحص الفكرة إلى إغلاق جولة الاستثمار.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-end">
              <button onClick={onStart} className="px-14 py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                <span>ابدأ رحلة الاحتضان</span>
                <svg className="w-7 h-7 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button onClick={onRoadmap} className={`px-12 py-6 border text-lg font-black rounded-[2.5rem] transition-all backdrop-blur-md active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}>
                استكشف المنهجية
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-[5rem] blur-3xl -z-10 opacity-50 animate-float"></div>
             <div className={`p-8 rounded-[5rem] border shadow-3xl backdrop-blur-2xl relative overflow-hidden group ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="absolute top-0 right-0 w-full h-full shimmer opacity-10 pointer-events-none"></div>
                <div className="p-12 space-y-12">
                   <div className="flex justify-between items-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className={`h-6 w-3/4 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>
                      <div className={`h-4 w-1/2 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}></div>
                      <div className={`h-32 w-full rounded-[2rem] border flex items-center justify-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                         <p className="text-slate-400 font-bold text-sm">AI Analyzing Market Data...</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className={`h-14 rounded-2xl border ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}></div>
                         <div className={`h-14 rounded-2xl border ${isDark ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}></div>
                      </div>
                   </div>

                   <div className={`pt-6 border-t flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Protocol Sync: 98%</span>
                      <span className="text-[10px] font-bold text-blue-500 animate-pulse">Neural Core Active</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Quick Grid */}
      <section className={`py-24 border-y ${isDark ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'شركة متخرجة', val: '185+', icon: '🚀' },
              { label: 'تمويل مستقطب', val: '$42M', icon: '💰' },
              { label: 'خبير ومرشد', val: '50+', icon: '👥' },
              { label: 'نسبة النجاح', val: '88%', icon: '📈' },
            ].map((s, i) => (
              <div key={i} className="text-center space-y-2 group">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">{s.icon}</div>
                <h4 className={`text-4xl font-black group-hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.val}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Explorer */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-8">
           <div className="text-center mb-24 space-y-4">
              <h2 className={`text-4xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>منظومة ذكية متكاملة</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">كل ما تحتاجه لبناء شركة ناشئة ناجحة في مكان واحد.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'تحليل الفكرة الفوري', desc: 'استخدم محرك Gemini لفحص جدوى فكرتك ورصد الثغرات قبل أن تبدأ.', icon: '💡', color: 'blue' },
                { title: 'مختبر فرص النمو', desc: 'اكتشف أسواقاً جديدة وشرائح عملاء غير مخدومة لمشروعك عبر AI.', icon: '🧭', color: 'indigo' },
                { title: 'مولد العرض الاستثماري', desc: 'حول بياناتك إلى Pitch Deck احترافي جاهز للمستثمرين في دقائق.', icon: '🚀', color: 'emerald' },
                { title: 'خريطة نضج المشروع', desc: 'تتبع تقدمك عبر 6 مستويات تفاعلية تنتهي بالحصول على شهادة تخرج.', icon: '📊', color: 'amber' },
                { title: 'شبكة المرشدين النخبة', desc: 'تواصل مع خبراء في التقنية والنمو والقانون لدعم مسارك الريادي.', icon: '🤝', color: 'rose' },
                { title: 'أدوات التنفيذ السريع', desc: 'وفر مئات الساعات عبر أدوات أتمتة المهام وبناء نماذج العمل الذكية.', icon: '🛠️', color: 'violet' }
              ].map((f, i) => (
                <div key={i} className={`feature-card p-12 rounded-[3.5rem] glass hover:border-blue-500/30 group ${!isDark ? 'bg-white shadow-sm' : ''}`}>
                   <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform ${isDark ? `bg-${f.color}-500/10` : `bg-${f.color}-50`}`}>
                      {f.icon}
                   </div>
                   <h3 className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
                   <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} leading-relaxed font-medium text-sm`}>{f.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-16 md:p-24 rounded-[5rem] text-center relative overflow-hidden shadow-[0_40px_100px_rgba(37,99,235,0.3)] group">
             <div className="absolute top-0 right-0 w-full h-full shimmer opacity-10"></div>
             <div className="relative z-10 space-y-12">
                <h3 className="text-4xl md:text-7xl font-black text-white leading-tight">جاهز لتغيير <br/> قواعد اللعبة؟</h3>
                <p className="text-blue-100/70 text-xl max-w-2xl mx-auto font-medium">انضم إلى مجتمع رواد الأعمال الأكثر ذكاءً في المنطقة وابدأ بناء مستقبلك اليوم.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button onClick={onStart} className="px-16 py-7 bg-white text-blue-900 text-2xl font-black rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all">ابدأ الآن - مجاناً</button>
                  <button onClick={() => onLegalClick('CONTACT')} className="px-12 py-7 bg-transparent border-2 border-white/20 text-white text-xl font-black rounded-[2.5rem] hover:bg-white/5 transition-all">تواصل مع مستشار</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-20 border-t ${isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-100'}`}>
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">BD</div>
                  <span className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>بيزنس ديفلوبرز</span>
               </div>
               <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <button onClick={onIncubation} className="hover:text-blue-500 transition-colors">الاحتضان</button>
                  <button onClick={onMemberships} className="hover:text-blue-500 transition-colors">العضويات</button>
                  <button onClick={onMentorship} className="hover:text-blue-500 transition-colors">الإرشاد</button>
                  <button onClick={onAchievements} className="hover:text-blue-500 transition-colors">الأثر</button>
                  <button onClick={() => onLegalClick('PRIVACY')} className="hover:text-blue-500 transition-colors">الخصوصية</button>
                  <button onClick={() => onLegalClick('TERMS')} className="hover:text-blue-500 transition-colors">الشروط</button>
               </div>
            </div>
            <div className="pt-12 mt-12 border-t border-black/5 dark:border-white/5 text-center">
               <p className="text-[9px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-[0.5em]">Business Developers Global • 2024 • Intelligence Reimagined</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
