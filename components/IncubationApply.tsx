
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound } from '../services/audioService';
import { evaluateIncubationApplication } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface IncubationApplyProps {
  user: UserProfile & { uid: string; startupId?: string };
  onSubmitted: () => void;
}

export const IncubationApply: React.FC<IncubationApplyProps> = ({ user, onSubmitted }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    market: '',
    commitment: '20'
  });

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const result = await evaluateIncubationApplication({
        name: user.startupName,
        industry: user.industry,
        description: user.startupDescription,
        ...formData
      });

      storageService.updateStartupApplication(
        user.startupId!, 
        result.decision, 
        result.fitScore, 
        result.feedback
      );
      
      onSubmitted();
    } catch (e) {
      alert("حدث خطأ في النظام. يرجى المحاولة لاحقاً.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const inputClass = "w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-blue-600 transition-all font-medium text-lg shadow-inner resize-none h-40";

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-white text-center" dir="rtl">
        <div className="w-32 h-32 border-8 border-white/5 border-t-blue-600 rounded-full animate-spin mb-10"></div>
        <h2 className="text-4xl font-black mb-4">جاري تحليل طلب الاحتضان...</h2>
        <p className="text-slate-400 text-xl max-w-md mx-auto">يقوم محرك Gemini 3 Pro بمراجعة مدخلاتك ومطابقتها مع معايير القبول العالمية.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-3xl w-full bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">
        <header className="bg-slate-900 p-12 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-bl-full opacity-10"></div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Incubation Protocol v3.0</div>
              <h1 className="text-4xl font-black tracking-tight">طلب انضمام رسمي</h1>
              <p className="text-slate-400 font-bold mt-2">مشروع: {user.startupName}</p>
            </div>
            <div className="text-right">
              <span className="text-6xl opacity-20">📝</span>
            </div>
          </div>
        </header>

        <main className="p-12 space-y-12">
           {step === 1 && (
             <div className="space-y-8 animate-fade-in">
               <div className="space-y-4">
                 <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] pr-2">ما هي المشكلة السوقية التي تعالجها؟</label>
                 <textarea 
                   className={inputClass} 
                   placeholder="اشرح الألم الحقيقي الذي يعاني منه العميل..."
                   value={formData.problem}
                   onChange={e => setFormData({...formData, problem: e.target.value})}
                 />
               </div>
               <div className="space-y-4">
                 <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] pr-2">ما هو حلك المبتكر؟</label>
                 <textarea 
                   className={inputClass} 
                   placeholder="كيف ستنهي المشكلة بطريقة فريدة ومربحة؟"
                   value={formData.solution}
                   onChange={e => setFormData({...formData, solution: e.target.value})}
                 />
               </div>
               <button onClick={() => { setStep(2); playPositiveSound(); }} disabled={!formData.problem || !formData.solution} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all disabled:opacity-30">الخطوة التالية</button>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                 <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] pr-2">من هم عملاؤك المستهدفون؟</label>
                 <textarea 
                   className={inputClass} 
                   placeholder="حجم السوق المستهدف وشريحة العملاء الأولية..."
                   value={formData.market}
                   onChange={e => setFormData({...formData, market: e.target.value})}
                 />
               </div>
               <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <label className="text-sm font-black text-slate-700 block mb-6">ساعات الالتزام الأسبوعية بالبرنامج:</label>
                  <div className="grid grid-cols-4 gap-4">
                    {['10', '20', '30', '40+'].map(h => (
                      <button 
                        key={h} 
                        onClick={() => setFormData({...formData, commitment: h})}
                        className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${formData.commitment === h ? 'bg-white border-blue-600 text-blue-600 shadow-md' : 'bg-slate-100 border-transparent text-slate-400'}`}
                      >
                        {h} س
                      </button>
                    ))}
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black transition-all">عودة</button>
                  <button onClick={handleSubmit} disabled={!formData.market} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-30">تقديم طلب الاحتضان النهائي 🚀</button>
               </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};
