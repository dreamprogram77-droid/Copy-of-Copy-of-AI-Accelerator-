
import React from 'react';
import { StartupRecord, FiltrationStage } from '../types';
import { playCelebrationSound } from '../services/audioService';

interface ScreeningPortalProps {
  startup: StartupRecord;
  onContinue: () => void;
  onRetry: () => void;
}

export const ScreeningPortal: React.FC<ScreeningPortalProps> = ({ startup, onContinue, onRetry }) => {
  const isApproved = startup.applicationStatus === 'APPROVED';
  const isElite = (startup.fitScore || 0) >= 90;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans text-white text-right" dir="rtl">
      <div className="max-w-4xl w-full bg-slate-900 rounded-[4rem] border border-white/5 shadow-3xl overflow-hidden animate-fade-in-up">
        
        <div className={`p-16 text-center space-y-10 relative overflow-hidden`}>
           {isApproved && <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>}
           
           <div className="space-y-6 relative z-10">
              <div className={`w-28 h-28 mx-auto rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl animate-bounce border-2
                ${isApproved ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-rose-500 border-rose-400 text-white'}
              `}>
                {isApproved ? '✓' : '!'}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tight">
                  {isApproved ? 'تم قبول طلبك بنجاح' : 'نعتذر عن عدم القبول حالياً'}
                </h2>
                <p className="text-slate-400 text-xl font-medium">مشروع: {startup.name}</p>
              </div>

              <div className="flex justify-center items-end gap-2 py-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Matching Score:</span>
                 <span className={`text-8xl font-black tabular-nums ${isElite ? 'text-emerald-400' : 'text-blue-500'}`}>{startup.fitScore}%</span>
              </div>
              
              {isElite && (
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full border border-emerald-500/20 text-sm font-black uppercase tracking-widest animate-pulse">
                   Elite Startup Qualification Unlocked 💎
                </div>
              )}
           </div>

           <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 text-right space-y-6 relative z-10">
              <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest">تحليل Gemini 3 Pro المتقدم:</h4>
              <p className="text-slate-200 text-xl leading-relaxed font-medium italic">"{startup.aiFeedback || 'جاري استرداد البيانات...'}"</p>
           </div>

           <div className="pt-10 flex gap-6 relative z-10">
              {isApproved ? (
                <button 
                  onClick={() => { playCelebrationSound(); onContinue(); }}
                  className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
                >
                   <span>دخول برنامج الاحتضان الآن</span>
                   <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              ) : (
                <div className="w-full space-y-6">
                   <div className="p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-rose-200 font-bold text-lg">
                      لم يحقق طلبك الحد الأدنى لدرجة الجدوى (٧٠٪). يرجى العمل على الملاحظات أعلاه وإعادة التقديم.
                   </div>
                   <button 
                    onClick={onRetry}
                    className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xl hover:bg-slate-100 transition-all"
                   >
                     تعديل الطلب وإعادة المحاولة
                   </button>
                </div>
              )}
           </div>
        </div>

        <footer className="bg-black/20 p-8 text-center border-t border-white/5 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Gatekeeper Protocol • Business Developers Hub • 2024</p>
        </footer>
      </div>
    </div>
  );
};
