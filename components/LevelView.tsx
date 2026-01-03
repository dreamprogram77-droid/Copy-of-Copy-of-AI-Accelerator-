
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LevelData, UserProfile, Question, TaskRecord, AIReviewResult } from '../types';
import { generateLevelMaterial, generateLevelQuiz, reviewDeliverableAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile;
  tasks: TaskRecord[]; 
  onComplete: () => void;
  onBack: () => void;
  onSubmitTask: (taskId: string, submissionData: {fileData: string, fileName: string, aiReview?: AIReviewResult}) => void;
  onRequestMentorship?: () => void;
}

enum Step { LOADING_CONTENT, LEARN, LOADING_QUIZ, QUIZ, OFFICIAL_TASK, AI_REVIEWING, REVIEW_RESULT, COMPLETED }

export const LevelView: React.FC<LevelViewProps> = ({ level, user, tasks, onComplete, onBack, onSubmitTask, onRequestMentorship }) => {
  const [step, setStep] = useState<Step>(Step.LOADING_CONTENT);
  const [content, setContent] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentContentPage, setCurrentContentPage] = useState(0);
  const [submissionFile, setSubmissionFile] = useState<{data: string, name: string} | null>(null);
  const [aiReview, setAiReview] = useState<AIReviewResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const levelTask = useMemo(() => tasks.find(t => t.levelId === level.id), [tasks, level.id]);

  const carouselItems = useMemo(() => {
    if (!content) return [];
    const pages = content.split('\n\n').filter(p => p.trim().length > 0);
    return pages.map(p => ({ type: 'content' as const, data: p }));
  }, [content]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await generateLevelMaterial(level.id, level.title, user);
        setContent(data.content);
        setTimeout(() => setStep(Step.LEARN), 1500);
      } catch (err) { console.error(err); }
    };
    loadContent();
  }, [level.id, level.title, user]);

  const startQuiz = async () => {
    setStep(Step.LOADING_QUIZ);
    try {
      const questions = await generateLevelQuiz(level.id, level.title, user);
      setQuizQuestions(questions);
      setQuizAnswers(new Array(questions.length).fill(-1));
      setStep(Step.QUIZ);
    } catch (e) { setStep(Step.LEARN); }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => { if (q.correctIndex === quizAnswers[idx]) score++; });
    if (score >= Math.ceil(quizQuestions.length * 0.6)) {
       playPositiveSound();
       setStep(Step.OFFICIAL_TASK);
    } else {
      playErrorSound();
      alert('لم تجتاز الاختبار. أعد مراجعة المادة.');
    }
  };

  const handleTaskSubmission = async () => {
    if (!levelTask || !submissionFile) return;
    
    setStep(Step.AI_REVIEWING);
    try {
      const startupContext = `المشروع: ${user.startupName}, الوصف: ${user.startupDescription}`;
      const review = await reviewDeliverableAI(levelTask.title, levelTask.description, startupContext);
      setAiReview(review);
      setStep(Step.REVIEW_RESULT);
      playPositiveSound();
    } catch (e) {
      setStep(Step.OFFICIAL_TASK);
      alert("فشل فحص AI، حاول مجدداً.");
    }
  };

  const finalizeTask = () => {
    if (!levelTask || !submissionFile || !aiReview) return;
    onSubmitTask(levelTask.id, {
      fileData: submissionFile.data,
      fileName: submissionFile.name,
      aiReview: aiReview
    });
    playCelebrationSound();
    setStep(Step.COMPLETED);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans" dir="rtl">
      <header className="sticky top-0 z-50 px-8 py-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex justify-between items-center">
         <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">← العودة</button>
         <div className="text-center">
            <h2 className="text-xl font-black">{level.title}</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Level 0{level.id}</p>
         </div>
         <div className="w-10"></div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-10 md:p-20">
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in">
             <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-xl font-black animate-pulse">جاري استدعاء المادة المعرفية...</p>
          </div>
        )}

        {step === Step.LEARN && (
           <div className="space-y-12 animate-fade-in-up">
              <div className="p-12 md:p-20 bg-slate-900/50 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-1/2 h-1.5 bg-blue-600"></div>
                 <article className="prose prose-invert max-w-none text-right">
                    {carouselItems[currentContentPage]?.data.split('\n').map((p, i) => (
                      <p key={i} className="text-xl leading-relaxed text-slate-300 font-medium mb-6">{p}</p>
                    ))}
                 </article>
              </div>

              <div className="flex justify-between items-center gap-6">
                 <button disabled={currentContentPage === 0} onClick={() => setCurrentContentPage(p => p - 1)} className="flex-1 py-5 bg-white/5 rounded-2xl font-black disabled:opacity-20 transition-all">السابق</button>
                 <div className="flex gap-2">
                    {carouselItems.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentContentPage ? 'w-10 bg-blue-600' : 'w-2 bg-slate-800'}`}></div>
                    ))}
                 </div>
                 {currentContentPage < carouselItems.length - 1 ? (
                   <button onClick={() => setCurrentContentPage(p => p + 1)} className="flex-[2] py-5 bg-blue-600 rounded-2xl font-black">المتابعة</button>
                 ) : (
                   <button onClick={startQuiz} className="flex-[2] py-5 bg-emerald-600 rounded-2xl font-black animate-pulse">دخول الاختبار المعرفي</button>
                 )}
              </div>
           </div>
        )}

        {step === Step.QUIZ && (
           <div className="space-y-10 animate-fade-in-up">
              <h3 className="text-3xl font-black text-center mb-10">تقييم استيعاب المحطة</h3>
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-10 bg-slate-900 border border-white/5 rounded-[2.5rem]">
                   <h4 className="text-xl font-bold mb-8">{qIdx + 1}. {q.text}</h4>
                   <div className="grid grid-cols-1 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <button 
                          key={oIdx}
                          onClick={() => { const a = [...quizAnswers]; a[qIdx] = oIdx; setQuizAnswers(a); playPositiveSound(); }}
                          className={`p-5 text-right rounded-2xl border-2 transition-all ${quizAnswers[qIdx] === oIdx ? 'border-blue-600 bg-blue-600/10 text-blue-400' : 'border-white/5 hover:border-white/10'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>
              ))}
              <button onClick={handleQuizSubmit} disabled={quizAnswers.includes(-1)} className="w-full py-6 bg-blue-600 rounded-2xl font-black shadow-xl disabled:opacity-50">تأكيد الإجابات</button>
           </div>
        )}

        {step === Step.OFFICIAL_TASK && (
           <div className="space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                 <h3 className="text-4xl font-black">تسليم المخرج التنفيذي</h3>
                 <p className="text-slate-500">ارفع ملف الـ PDF الخاص بهذه المرحلة لمراجعته من قبل الموجه الرقمي.</p>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-80 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all
                  ${submissionFile ? 'bg-emerald-600/10 border-emerald-600' : 'bg-white/5 border-white/10 hover:border-blue-500/30'}
                `}
              >
                 <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSubmissionFile({ data: 'file_simulated', name: f.name });
                 }} />
                 {submissionFile ? (
                    <div className="text-center">
                       <span className="text-6xl mb-4 block">📄</span>
                       <p className="font-black text-emerald-400">{submissionFile.name}</p>
                    </div>
                 ) : (
                    <div className="text-center">
                       <span className="text-6xl mb-6 block opacity-20">📂</span>
                       <p className="font-black text-slate-400">انقر لرفع ملف المخرج (PDF)</p>
                    </div>
                 )}
              </div>

              <button onClick={handleTaskSubmission} disabled={!submissionFile} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black border border-white/10 shadow-2xl hover:bg-blue-600 transition-all disabled:opacity-30">
                 إرسال للمراجعة الذكية (AI Review)
              </button>
           </div>
        )}

        {step === Step.AI_REVIEWING && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-10 animate-fade-in">
              <div className="relative">
                 <div className="w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🤖</div>
              </div>
              <div className="text-center space-y-2">
                 <h4 className="text-2xl font-black">الموجه الرقمي يراجع ملفك...</h4>
                 <p className="text-slate-500">يتم تحليل المحتوى، الجودة، ومدى مطابقة المعايير.</p>
              </div>
           </div>
        )}

        {step === Step.REVIEW_RESULT && aiReview && (
           <div className="space-y-12 animate-fade-in-up">
              <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 space-y-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black">تقرير الموجه الرقمي</h3>
                    <div className={`px-6 py-2 rounded-full font-black text-sm ${aiReview.readinessScore >= 75 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                       مؤشر الجاهزية: {aiReview.readinessScore}%
                    </div>
                 </div>

                 <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">التقييم النقدي</p>
                    <p className="text-xl font-medium leading-relaxed italic">"{aiReview.criticalFeedback}"</p>
                 </div>

                 <div className="space-y-4">
                    <p className="font-black text-blue-400 text-sm uppercase">الخطوات المقترحة للتطوير:</p>
                    <ul className="space-y-3">
                       {aiReview.suggestedNextSteps.map((s, i) => (
                         <li key={i} className="flex gap-4 items-center text-sm font-bold text-slate-300">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {s}
                         </li>
                       ))}
                    </ul>
                 </div>

                 {aiReview.isReadyForHumanMentor && (
                   <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-center">
                      <p className="text-emerald-400 font-black">✨ ممتاز! مخرجك مؤهل لمراجعة مرشد بشري حقيقي.</p>
                   </div>
                 )}
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setStep(Step.OFFICIAL_TASK)} className="flex-1 py-5 bg-white/5 rounded-2xl font-black">تعديل المخرج</button>
                 <button onClick={finalizeTask} className="flex-[2] py-5 bg-blue-600 rounded-2xl font-black shadow-xl">اعتماد وإنهاء المحطة</button>
              </div>
           </div>
        )}

        {step === Step.COMPLETED && (
           <div className="text-center space-y-12 animate-fade-in-up py-10">
              <div className="w-40 h-40 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-9xl shadow-inner animate-bounce">✨</div>
              <div className="space-y-4">
                 <h2 className="text-6xl font-black tracking-tighter">محطة مكتملة!</h2>
                 <p className="text-slate-500 text-2xl font-medium">لقد أثبت جديتك وكفاءتك. تم فتح المحطة التالية لك.</p>
              </div>
              <button onClick={onComplete} className="px-20 py-6 bg-blue-600 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all">العودة للوحة القيادة</button>
           </div>
        )}
      </main>
    </div>
  );
};
