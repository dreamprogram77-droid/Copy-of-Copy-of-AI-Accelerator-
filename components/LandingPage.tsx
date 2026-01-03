
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
  onMemberships: () => void; // مضافة حديثاً
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
}

interface JourneyStep {
  id: number;
  title: string;
  icon: string;
  goal: string;
  deliverables: string[];
  gradient: string;
  glow: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  { id: 1, title: 'التحقق من الفكرة', icon: '💡', goal: 'إثبات وجود مشكلة حقيقية واحتياج سوقي للحل المقترح.', deliverables: ['تحليل المشكلة بدقة', 'تحديد الجمهور المستهدف', 'صياغة عرض القيمة'], gradient: 'from-blue-500 to-cyan-400', glow: 'rgba(59, 130, 246, 0.1)' },
  { id: 2, title: 'نموذج العمل', icon: '📊', goal: 'تصميم محرك الربح وضمان استدامة المشروع وقابلية التوسع.', deliverables: ['مخطط BMC الاحترافي', 'قنوات التوزيع', 'هيكل الإيرادات'], gradient: 'from-indigo-500 to-purple-400', glow: 'rgba(99, 102, 241, 0.1)' },
  { id: 3, title: 'تحليل السوق', icon: '🔎', goal: 'دراسة المنافسين وتحديد الميزة التنافسية الفريدة في السوق.', deliverables: ['تحليل SWOT المعمق', 'حجم السوق TAM/SAM', 'مصفوفة التميز'], gradient: 'from-emerald-500 to-teal-400', glow: 'rgba(16, 185, 129, 0.1)' },
  { id: 4, title: 'بناء الـ MVP', icon: '🛠️', goal: 'إطلاق نسخة أولية لاختبار الحل مع عملاء حقيقيين بأقل التكاليف.', deliverables: ['تحديد المزايا الجوهرية', 'رسم رحلة المستخدم', 'خطة الاختبار'], gradient: 'from-amber-500 to-orange-400', glow: 'rgba(245, 158, 11, 0.1)' },
  { id: 5, title: 'الخطة المالية', icon: '💰', goal: 'بناء التوقعات المالية الواقعية وجذب اهتمام المستثمرين.', deliverables: ['توقعات التدفق النقدي', 'نقطة التعادل', 'التقييم الاستثماري'], gradient: 'from-rose-500 to-pink-400', glow: 'rgba(244, 63, 94, 0.1)' },
  { id: 6, title: 'عرض الاستثمار', icon: '🚀', goal: 'تجهيز ملف العرض النهائي وإغلاق أول جولة تمويلية ناجحة.', deliverables: ['Pitch Deck عالمي', 'مهارات الإلقاء', 'قائمة المستهدفين'], gradient: 'from-slate-700 to-slate-900', glow: 'rgba(30, 41, 59, 0.1)' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPathFinder, onRoadmap, onTools, onAchievements, onMentorship, onIncubation, onMemberships, onLegalClick, onLogin }) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden scroll-smooth text-slate-900" dir="rtl">
      <style>{`
        .glass-journey { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(226, 232, 240, 0.8); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .journey-line { background: linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899, #e2e8f0); }
        .bg-dot-pattern { background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px); background-size: 30px 30px; }
      `}</style>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase text-right">بيزنس ديفلوبرز</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 text-right">AI Virtual Accelerator</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-bold text-slate-500">
          <button onClick={onIncubation} className="hover:text-blue-600 transition-colors">برنامج الاحتضان</button>
          <button onClick={onMemberships} className="text-blue-600 font-black hover:text-blue-700 transition-colors">باقات العضوية</button>
          <button onClick={onRoadmap} className="hover:text-blue-600 transition-colors">خارطة الطريق</button>
          <button onClick={onTools} className="hover:text-blue-600 transition-colors">الأدوات</button>
          <button onClick={onMentorship} className="hover:text-blue-600 transition-colors">الإرشاد</button>
          <button onClick={onAchievements} className="hover:text-blue-600 transition-colors">إنجازاتنا</button>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <button onClick={onLogin} className="text-slate-900 hover:text-blue-600 transition-colors px-4">تسجيل الدخول</button>
          <button onClick={onStart} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">ابدأ مجاناً</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-dot-pattern">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-blue-50 rounded-bl-[10rem] -z-10 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up text-right">
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black border border-blue-100">
              <span className="animate-bounce">✨</span>
              <span className="uppercase tracking-widest text-[10px]">مستقبل ريادة الأعمال يبدأ هنا</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
              صمم مشروعك <br/>
              <span className="text-blue-600 relative inline-block">بذكاء فائق.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none">
                  <path d="M3 9C118.957 4.47226 239.043 4.47226 355 9" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              حوّل فكرتك إلى شركة ناشئة ناجحة وجاهزة للاستثمار من خلال أول مسار تدريبي ذكي في المنطقة معتمد على تقنيات Gemini AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-end">
              <button onClick={onStart} className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-95">
                <span>ابدأ رحلتك الآن</span>
                <svg className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button onClick={onMemberships} className="px-10 py-6 bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-900 hover:text-blue-600 text-lg font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm">
                تصفح الباقات
              </button>
            </div>
          </div>
          <div className="relative hidden lg:block animate-fade-in">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
            <div className="bg-white p-4 rounded-[4rem] border border-slate-100 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="bg-slate-50 rounded-[3rem] shadow-inner p-10 text-slate-900 min-h-[500px] flex flex-col justify-center text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-blue-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-4">بوابة المسرعة</h3>
                <p className="text-slate-500 font-medium mb-8 italic">"الوصول إلى أدوات الذكاء الاصطناعي الأكثر تقدماً لرواد الأعمال"</p>
                <div className="space-y-3">
                  <div className="h-12 bg-white rounded-xl border border-slate-100 w-full animate-pulse"></div>
                  <div className="h-12 bg-white rounded-xl border border-slate-100 w-3/4 mx-auto animate-pulse"></div>
                </div>
                <button onClick={onLogin} className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-colors shadow-lg">دخول الأعضاء</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 bg-white text-center">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-xl font-black text-slate-900 uppercase tracking-tight">بيزنس ديفلوبرز</span>
               </div>
               <div className="flex flex-wrap justify-center gap-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                 <button onClick={onIncubation} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">برنامج الاحتضان</button>
                 <button onClick={onMemberships} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">باقات العضوية</button>
                 <button onClick={onMentorship} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">الإرشاد</button>
                 <button onClick={onAchievements} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">إنجازاتنا</button>
                 <button onClick={() => onLegalClick('PRIVACY')} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">سياسة الخصوصية</button>
                 <button onClick={() => onLegalClick('TERMS')} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">الشروط والأحكام</button>
                 <button onClick={() => onLegalClick('CONTACT')} className="hover:text-blue-600 transition-colors underline-offset-8 hover:underline">تواصل معنا</button>
               </div>
            </div>
            <div className="pt-10 border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em]">Business Developers Hub • 2024 • Powered by Google Gemini AI</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
