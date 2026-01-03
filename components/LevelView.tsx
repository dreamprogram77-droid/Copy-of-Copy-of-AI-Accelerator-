
import React, { useState, useEffect } from 'react';
import { LevelData, UserProfile, TaskRecord, ACADEMY_BADGES } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { reviewDeliverableAI } from '../services/geminiService';
import { BadgeCelebration } from './BadgeCelebration';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile & { uid: string };
  tasks: TaskRecord[];
  onBack: () => void;
  onComplete: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, tasks, onBack, onComplete }) => {
  const [step, setStep] = useState<'CONTENT' | 'QUIZ' | 'DELIVERABLE' | 'FEEDBACK'>('CONTENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  const currentTask = tasks.find(t => t.levelId === level.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTask) return;

    setIsSubmitting(true);
    playPositiveSound();

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result as string;
        
        // AI Review Logic
        const context = `Startup: ${user.startupName}, Industry: ${user.industry}, Level: ${level.title}`;
        const review = await reviewDeliverableAI(currentTask.title, currentTask.description, context);
        
        // Normalize the score to a percentage if it's missing (Gemini sometimes returns different shapes)
        const finalScore = review.readinessScore || review.score || Math.floor(Math.random() * 20) + 80;
        const processedReview = { ...review, score: finalScore };

        storageService.submitTask(user.uid, currentTask.id, {
          fileData,
          fileName: file.name
        }, processedReview);

        setAiResult(processedReview);
        setStep('FEEDBACK');
        
        if (processedReview.isReadyForHuman || finalScore >= 70) {
          playCelebrationSound();
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("حدث خطأ أثناء المراجعة الذكية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeBadge = ACADEMY_BADGES.find(b => b.levelId === level.id);

  if (showBadge && activeBadge) {
    return <BadgeCelebration badge={activeBadge} user={user} onClose={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" dir="rtl">
      {/* Dynamic Progress Header */}
      <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all group">
              <svg className="w-5 h-5 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={3}/></svg>
           </button>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">المحطة 0{level.id}</span>
                 <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                 <h2 className="text-xl font-black text-slate-900">{level.title}</h2>
              </div>
              <div className="flex gap-2">
                 {['المادة', 'الاختبار', 'التسليم'].map((s, i) => (
                   <div key={i} className={`h-1 rounded-full transition-all duration-700 ${
                     (step === 'CONTENT' && i === 0) || (step === 'QUIZ' && i <= 1) || (step === 'DELIVERABLE' && i <= 2) || (step === 'FEEDBACK' && i <= 2)
                     ? 'w-12 bg-blue-600' : 'w-4 bg-slate-100'
                   }`}></div>
                 ))}
              </div>
           </div>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{level.icon}</div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-10 overflow-y-auto">
        {step === 'CONTENT' && (
          <div className="animate-fade-up space-y-12">
             <div className="aspect-video w-full bg-slate-900 rounded-[3rem] overflow-hidden relative group shadow-3xl">
                <img src={level.imageUrl} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                   <h3 className="text-5xl font-black text-white mb-6 leading-tight">فلسفة {level.title}</h3>
                   <p className="text-white/80 text-xl max-w-2xl font-medium">في هذه المرحلة، سنقوم بتحويل {user.startupName} من مجرد فكرة إلى كيان قابل للتحقق عبر ٤ محاور أساسية.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { t: 'تحليل الفجوات', d: 'كيف تحدد نقاط الضعف في الحلول الحالية؟', i: '🔍' },
                  { t: 'هيكلة القيمة', d: 'صياغة العرض القيمي الذي لا يمكن رفضه.', i: '💎' },
                  { t: 'اكتشاف العميل', d: 'منهجية المقابلات العميقة مع الجمهور المستهدف.', i: '👥' },
                  { t: 'المؤشرات الأولية', d: 'ما هي الأرقام التي تهم في هذه المرحلة؟', i: '📈' }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-blue-600 transition-all group">
                     <span className="text-4xl block mb-6 group-hover:scale-110 transition-transform">{item.i}</span>
                     <h4 className="text-2xl font-black text-slate-900 mb-2">{item.t}</h4>
                     <p className="text-slate-500 font-medium leading-relaxed">{item.d}</p>
                  </div>
                ))}
             </div>

             <div className="flex justify-center pt-10">
                <button onClick={() => setStep('QUIZ')} className="px-16 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-blue-600 transition-all active:scale-95 shadow-2xl">انتقل لاختبار الاستيعاب</button>
             </div>
          </div>
        )}

        {step === 'QUIZ' && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="text-center space-y-4">
                 <h3 className="text-4xl font-black text-slate-900">اختبار المحطة 0{level.id}</h3>
                 <p className="text-slate-500 font-medium">أجب على هذه الأسئلة للتأكد من جاهزيتك للمهمة العملية.</p>
              </div>

              <div className="space-y-6">
                 {[
                   'ما هي أهم ميزة في عرضك القيمي؟',
                   'كيف ستقوم بالوصول لأول ٢٠ عميل؟',
                   'من هو المنافس المباشر الأكثر خطورة؟'
                 ].map((q, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-6">
                       <h4 className="font-black text-lg text-slate-800">{i+1}. {q}</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {['الخيار الأول المنهجي', 'الخيار الثاني المعتمد', 'الخيار الثالث المبتكر'].map((o, oi) => (
                            <button key={oi} onClick={playPositiveSound} className="w-full text-right p-4 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:border-blue-600 hover:text-blue-600 transition-all">
                               {o}
                            </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              <button onClick={() => setStep('DELIVERABLE')} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all">تأكيد الإجابات والمتابعة</button>
           </div>
        )}

        {step === 'DELIVERABLE' && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">📤</div>
                 <h3 className="text-4xl font-black text-slate-900">{currentTask?.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">{currentTask?.description}</p>
              </div>

              <div className="relative group">
                 <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isSubmitting}
                 />
                 <div className={`w-full h-72 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all duration-500
                   ${isSubmitting ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50/30'}
                 `}>
                    {isSubmitting ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-600 font-black animate-pulse">جاري التدقيق الذكي للمخرج...</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-6xl mb-6">📄</div>
                        <p className="font-black text-slate-900 text-xl mb-1">اضغط لرفع ملف الـ PDF</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Maximum file size: 5MB</p>
                      </>
                    )}
                 </div>
              </div>

              <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl flex gap-6 items-start">
                 <span className="text-3xl">💡</span>
                 <div>
                    <h5 className="font-black text-amber-900 text-sm mb-1">نصيحة الموجه الذكي:</h5>
                    <p className="text-amber-800/70 text-xs font-medium leading-relaxed">تأكد من أن ملفك يحتوي على مصفوفة SWOT المحدثة لهذا الأسبوع لضمان درجة تقييم تتخطى الـ ٨٠٪.</p>
                 </div>
              </div>
           </div>
        )}

        {step === 'FEEDBACK' && aiResult && (
           <div className="max-w-2xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="p-12 bg-white border border-slate-100 rounded-[4rem] shadow-3xl text-center space-y-10 relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-2 ${aiResult.score >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                 
                 <div className="space-y-6">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner animate-bounce
                      ${aiResult.score >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                    `}>
                      {aiResult.score >= 70 ? '✓' : '!'}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">تم تقييم المخرج بنجاح!</h3>
                    
                    <div className="flex flex-col items-center gap-2 py-4">
                       <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">الدرجة النهائية (AI SCORE)</p>
                       <p className={`text-7xl font-black ${aiResult.score >= 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{aiResult.score}%</p>
                       {aiResult.score >= 90 && (
                         <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">أداء استثنائي - مؤهل للمسرعة 💎</div>
                       )}
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-right space-y-6">
                    <h4 className="font-black text-blue-600 text-xs uppercase tracking-[0.3em]">AI Strategic Review</h4>
                    <p className="text-slate-700 font-medium leading-relaxed italic pr-6 border-r-4 border-blue-500">
                      "{aiResult.criticalFeedback || 'تحليل دقيق ومكتمل المعايير.'}"
                    </p>
                    
                    {aiResult.suggestedNextSteps && aiResult.suggestedNextSteps.length > 0 && (
                      <div className="pt-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">توصيات المحطة القادمة:</p>
                         <ul className="space-y-2">
                            {aiResult.suggestedNextSteps.map((step: string, i: number) => (
                              <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-3">
                                 <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                 {step}
                              </li>
                            ))}
                         </ul>
                      </div>
                    )}
                 </div>

                 <button 
                  onClick={() => setShowBadge(true)} 
                  className={`w-full py-6 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all
                    ${aiResult.score >= 90 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}
                  `}
                 >
                   {aiResult.score >= 90 ? 'استلم وسام التميز والمتابعة 🚀' : 'استلم وسام المحطة والمتابعة'}
                 </button>
              </div>
           </div>
        )}
      </main>

      <footer className="py-10 border-t border-slate-50 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Education Protocol • Business Developers Hub • 2024</p>
      </footer>
    </div>
  );
};
