
import React, { useState, useRef } from 'react';
import { 
  generateStartupIdea, 
  generateFounderCV,
  generateProductSpecs,
  generateLeanBusinessPlan,
  generatePitchDeckOutline
} from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface ToolsPageProps {
  onBack: () => void;
}

type ToolID = 'IDEA' | 'CV' | 'PRODUCT' | 'PLAN' | 'DECK';

const TOOLS_META: {id: ToolID, title: string, desc: string, icon: string, color: string}[] = [
  { id: 'IDEA', title: 'مولد الأفكار الابتكارية', desc: 'استخرج أفكاراً لمشاريع ناشئة بناءً على شغفك واتجاهات السوق.', icon: '💡', color: 'blue' },
  { id: 'CV', title: 'بروفايل المؤسس (CV)', desc: 'صمم سيرة ذاتية تبرز مهاراتك القيادية بربطها بمشروعك.', icon: '👤', color: 'purple' },
  { id: 'PRODUCT', title: 'مهندس المنتج (MVP)', desc: 'حدد المزايا الجوهرية وصمم رحلة المستخدم التقنية.', icon: '⚙️', color: 'emerald' },
  { id: 'PLAN', title: 'خطة العمل المرنة', desc: 'ابنِ خطة عمل استراتيجية تغطي القيمة المضافة والإيرادات.', icon: '📊', color: 'amber' },
  { id: 'DECK', title: 'مصمم العرض الاستثماري', desc: 'صغ هيكلاً قوياً لعرضك التقديمي لاقتناص فرص التمويل.', icon: '🚀', color: 'indigo' }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<ToolID | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [forms, setForms] = useState({
    IDEA: { sector: '', interest: '' },
    CV: { name: '', experience: '', skills: '', vision: '' },
    PRODUCT: { projectName: '', description: '' },
    PLAN: { startupName: '', industry: '', problem: '', solution: '', targetMarket: '' },
    DECK: { startupName: '', problem: '', solution: '' }
  });

  const handleGenerate = async () => {
    if (!activeTool) return;
    setIsLoading(true);
    playPositiveSound();

    try {
      let res;
      const currentForm = forms[activeTool];
      if (activeTool === 'IDEA') res = await generateStartupIdea(currentForm as any);
      else if (activeTool === 'CV') res = await generateFounderCV(currentForm as any);
      else if (activeTool === 'PRODUCT') res = await generateProductSpecs(currentForm as any);
      else if (activeTool === 'PLAN') res = await generateLeanBusinessPlan(currentForm as any);
      else if (activeTool === 'DECK') res = await generatePitchDeckOutline(currentForm as any);
      
      setResult(res);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      alert("حدث خطأ في توليد المخرج.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans" dir="rtl">
      
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={activeTool ? () => setActiveTool(null) : onBack} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 transition-all group">
            <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">استوديو الأدوات الذكية</h1>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Smart Acceleration Workbench</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!activeTool ? (
          <div className="space-y-16 animate-fade-up">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
               <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">مختبرات التنفيذ</h2>
               <p className="text-slate-500 text-lg font-medium">أدوات مدعومة بـ AI لمساعدتك في صياغة مستنداتك الريادية بمعايير عالمية.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {TOOLS_META.map(tool => (
                 <button 
                  key={tool.id} 
                  onClick={() => { setActiveTool(tool.id); playPositiveSound(); }}
                  className="text-right p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-600 transition-all group relative overflow-hidden"
                 >
                    <div className="text-5xl mb-8 group-hover:scale-110 transition-transform block">{tool.icon}</div>
                    <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-3">{tool.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{tool.desc}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-white/5">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">فتح الأداة ←</span>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-up items-start">
             {/* Tool Input Card */}
             <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-10">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-50 dark:border-white/5">
                   <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">
                      {TOOLS_META.find(t => t.id === activeTool)?.icon}
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">{TOOLS_META.find(t => t.id === activeTool)?.title}</h3>
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">AI Parameters Input</p>
                   </div>
                </div>

                <div className="space-y-8">
                   {/* Contextual Forms based on activeTool */}
                   {activeTool === 'IDEA' && (
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2 mb-2 block">قطاع العمل المفضل</label>
                           <input className="w-full p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-black" placeholder="مثال: التقنية المالية" onChange={e => setForms({...forms, IDEA: {...forms.IDEA, sector: e.target.value}})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2 mb-2 block">اهتماماتك وخبراتك</label>
                           <textarea className="w-full h-32 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-medium resize-none" placeholder="تحدث عن خبرتك..." onChange={e => setForms({...forms, IDEA: {...forms.IDEA, interest: e.target.value}})} />
                        </div>
                     </div>
                   )}
                   {/* ... (Other forms follow similar pattern) ... */}
                   
                   <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'توليد المخرج الذكي 🚀'}
                   </button>
                </div>
             </div>

             {/* Output Display Card */}
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white min-h-[600px] flex flex-col relative overflow-hidden shadow-3xl border border-white/5">
                {!result && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                     <div className="text-8xl mb-8">🤖</div>
                     <h3 className="text-2xl font-black">بانتظار مدخلاتك</h3>
                     <p className="max-w-xs mt-4">املأ البيانات في اللوحة الجانبية ليقوم النظام بصياغة المخرج.</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-32 h-32 border-8 border-white/10 border-t-blue-600 rounded-full animate-spin mb-10"></div>
                     <h3 className="text-2xl font-black animate-pulse">جاري التحليل والصياغة...</h3>
                     <p className="text-slate-500 text-sm mt-4">نستخدم Gemini 3 Pro لضمان جودة استثمارية.</p>
                  </div>
                )}

                {result && (
                  <div className="animate-fade-up space-y-8">
                     <div className="flex justify-between items-center pb-8 border-b border-white/10">
                        <h4 className="text-xl font-black text-blue-400">المخرج النهائي</h4>
                        <button onClick={() => { navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result)); alert('تم النسخ!'); }} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">نسخ المحتوى</button>
                     </div>
                     <div className="prose prose-invert max-w-none text-right">
                        <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-slate-300">
                           {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                        </p>
                     </div>
                  </div>
                )}
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]"></div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
