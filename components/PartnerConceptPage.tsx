
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface PartnerConceptPageProps {
  onRegister: () => void;
  onBack: () => void;
}

export const PartnerConceptPage: React.FC<PartnerConceptPageProps> = ({ onRegister, onBack }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden" dir="rtl">
      <style>{`
        .concept-gradient { background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 45%); }
        .card-premium { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(30px); }
        .emerald-glow { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.3)); }
        @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal 1s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
      `}</style>
      
      <div className="fixed inset-0 concept-gradient pointer-events-none"></div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-center bg-[#020617]/40 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
           <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg emerald-glow">P</div>
          <div className="text-right">
             <span className="text-xl font-black tracking-tight block leading-none">برنامج الشركاء</span>
             <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Co-Founder Ecosystem</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-10 mb-32 animate-reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] border border-emerald-500/20">
            Growth & Equity Opportunities
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
            لا تبحث عن وظيفة، <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-600">ابحث عن حصة.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed px-4">
            منصة "شريك" هي جسرك للانضمام لشركات ناشئة واعدة تم التحقق من جديتها ذكياً. استثمر مهاراتك الفائقة مقابل حصص ملكية في مشاريع الغد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
           {[
             { title: 'مطابقة ذكية (AI)', desc: 'خوارزميات Gemini تحلل فجوات المؤسس وترشحك كـ "القطعة المفقودة" بناءً على بصمتك المهنية.', icon: '🧠', color: 'emerald' },
             { title: 'فترة تجربة محمية', desc: 'نظام "الـ 14 يوماً" يتيح لك وللمؤسس العمل معاً بتجربة واقعية قبل أي التزام قانوني نهائي.', icon: '⏳', color: 'teal' },
             { title: 'سمعة الشريك (Rep)', desc: 'نقوم بتوثيق إنجازاتك في كل مشروع تساهم فيه لرفع قيمة بروفايلك أمام المستثمرين.', icon: '📊', color: 'cyan' }
           ].map((f, i) => (
             <div key={i} className="card-premium p-12 rounded-[4rem] space-y-8 hover:border-emerald-500/30 transition-all group animate-reveal" style={{ animationDelay: `${0.2 * i}s` }}>
                <div className="w-20 h-20 bg-emerald-500/5 rounded-[2rem] flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform border border-emerald-500/10 shadow-inner">
                   {f.icon}
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black">{f.title}</h3>
                   <p className="text-slate-400 text-lg font-medium leading-relaxed">{f.desc}</p>
                </div>
                <div className="pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">المزيد من التفاصيل →</span>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[5rem] p-16 md:p-28 text-center space-y-16 shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -z-0 group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-8xl font-black leading-none">كن الشريك الذي <br/> ينتظره الجميع</h2>
              <p className="text-emerald-50 text-xl md:text-2xl font-medium max-w-3xl mx-auto opacity-80 leading-relaxed">
                سواء كنت خبيراً تقنياً (CTO)، مسوقاً (CMO)، أو عبقري تشغيل؛ هناك رائد أعمال الآن يملك الفكرة ويبحث عن مهاراتك ليبني الحلم.
              </p>
           </div>
           <button 
             onClick={() => { playPositiveSound(); onRegister(); }}
             className="relative z-10 px-20 py-8 bg-white text-emerald-900 text-3xl font-black rounded-[3rem] shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-6 mx-auto"
           >
             <span>سجل كشريك الآن</span>
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
        </div>
      </main>

      <footer className="py-24 text-center opacity-20">
        <p className="text-[11px] font-black uppercase tracking-[0.6em]">Business Developers Partner Hub • Unified Ecosystem 2024</p>
      </footer>
    </div>
  );
};
