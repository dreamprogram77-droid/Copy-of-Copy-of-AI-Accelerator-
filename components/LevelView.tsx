
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LevelData, UserProfile, Question, DIGITAL_SHIELDS, TaskRecord } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface LevelTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
  gradient: string;
}

const THEMES: Record<string, LevelTheme> = {
  'أزرق': { 
    id: 'blue', name: 'أزرق احترافي', 
    primary: 'bg-blue-600', secondary: 'bg-blue-50', accent: 'text-blue-600', 
    bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-700', ring: 'ring-blue-100',
    gradient: 'from-blue-600 to-indigo-700'
  },
  'أخضر': { 
    id: 'emerald', name: 'أخضر نمو', 
    primary: 'bg-emerald-600', secondary: 'bg-emerald-50', accent: 'text-emerald-600', 
    bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-100',
    gradient: 'from-emerald-600 to-teal-700'
  },
  'أحمر': { 
    id: 'rose', name: 'أحمر طموح', 
    primary: 'bg-rose-600', secondary: 'bg-rose-50', accent: 'text-rose-600', 
    bg: 'bg-rose-50/50', border: 'border-rose-100', text: 'text-rose-700', ring: 'ring-rose-100',
    gradient: 'from-rose-600 to-pink-700'
  },
  'بنفسجي': { 
    id: 'indigo', name: 'بنفسجي عصري', 
    primary: 'bg-indigo-600', secondary: 'bg-indigo-50', accent: 'text-indigo-600', 
    bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-100',
    gradient: 'from-indigo-600 to-purple-700'
  },
  'برتقالي': { 
    id: 'orange', name: 'برتقالي إبداعي', 
    primary: 'bg-orange-500', secondary: 'bg-orange-50', accent: 'text-orange-500', 
    bg: 'bg-orange-50/50', border: 'border-orange-100', text: 'text-orange-700', ring: 'ring-orange-100',
    gradient: 'from-orange-500 to-amber-600'
  },
  'ذهبي': { 
    id: 'amber', name: 'ذهبي ريادي', 
    primary: 'bg-amber-600', secondary: 'bg-amber-50', accent: 'text-amber-600', 
    bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-700', ring: 'ring-amber-100',
    gradient: 'from-amber-500 to-orange-600'
  },
  'وردي': { 
    id: 'pink', name: 'وردي ملهم', 
    primary: 'bg-pink-600', secondary: 'bg-pink-50', accent: 'text-pink-600', 
    bg: 'bg-pink-50/50', border: 'border-pink-100', text: 'text-pink-700', ring: 'ring-pink-100',
    gradient: 'from-pink-600 to-rose-600'
  },
  'سحابي': { 
    id: 'slate', name: 'سحابي متوازن', 
    primary: 'bg-slate-600', secondary: 'bg-slate-50', accent: 'text-slate-600', 
    bg: 'bg-slate-50/50', border: 'border-slate-100', text: 'text-slate-700', ring: 'ring-slate-100',
    gradient: 'from-slate-600 to-slate-800'
  }
};

const DEFAULT_THEMES = Object.values(THEMES);

interface LevelViewProps {
  level: LevelData;
  user: UserProfile;
  tasks: TaskRecord[]; // Linked tasks passed from App
  onComplete: () => void;
  onBack: () => void;
  onSubmitTask: (taskId: string, content: string) => void;
  onRequestMentorship?: () => void;
}

enum Step { LOADING_CONTENT, LEARN, EXERCISE, LOADING_QUIZ, QUIZ, OFFICIAL_TASK, COMPLETED }

export const LevelView: React.FC<LevelViewProps> = ({ level, user, tasks, onComplete, onBack, onSubmitTask, onRequestMentorship }) => {
  const [step, setStep] = useState<Step>(Step.LOADING_CONTENT);
  const [content, setContent] = useState<string>('');
  const [exercisePrompt, setExercisePrompt] = useState<string>('');
  const [exerciseAnswer, setExerciseAnswer] = useState<string>('');
  const [exerciseFeedback, setExerciseFeedback] = useState<string>('');
  const [isExerciseSubmitting, setIsExerciseSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentContentPage, setCurrentContentPage] = useState(0);
  const [revealedInsights, setRevealedInsights] = useState<Record<number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('level_display_mode') === 'dark');
  const [submissionText, setSubmissionText] = useState('');

  const activeTheme = useMemo(() => {
     if (level.customColor && THEMES[level.customColor]) return THEMES[level.customColor];
     return DEFAULT_THEMES[(level.id - 1) % DEFAULT_THEMES.length];
  }, [level.customColor, level.id]);

  const levelTask = useMemo(() => tasks.find(t => t.levelId === level.id), [tasks, level.id]);

  // Fix: Added carouselItems memo to provide data for the learning carousel
  const carouselItems = useMemo(() => {
    if (!content) return [];
    // Split content by double newlines into distinct learning sections
    const pages = content.split('\n\n').filter(p => p.trim().length > 0);
    const items = pages.map(p => ({ type: 'content' as const, data: p }));
    // Append a summary/next-step item
    items.push({ type: 'summary' as const, data: '' });
    return items;
  }, [content]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await generateLevelMaterial(level.id, level.title, user);
        setContent(data.content);
        setExercisePrompt(data.exercise);
        setTimeout(() => setStep(Step.LEARN), 1500);
      } catch (err) { console.error(err); }
    };
    loadContent();
  }, [level.id, level.title, user]);

  const toggleInsight = (idx: number) => {
    setRevealedInsights(prev => ({ ...prev, [idx]: !prev[idx] }));
    if (!revealedInsights[idx]) playPositiveSound();
  };

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
      alert('نعتذر، لم تجتاز الاختبار بنسبة كافية. يرجى مراجعة المادة وإعادة المحاولة.');
    }
  };

  const handleTaskSubmission = () => {
    if (!levelTask || !submissionText.trim()) return;
    onSubmitTask(levelTask.id, submissionText);
    playCelebrationSound();
    setStep(Step.COMPLETED);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : activeTheme.bg + ' text-slate-900'} flex flex-col font-sans transition-colors duration-500 overflow-x-hidden`} dir="rtl">
      <style>{`
        .page-header { backdrop-filter: blur(20px); background: ${isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)'}; border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .content-card { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .prose-xl p { font-size: 1.5rem; line-height: 2.8rem; margin-bottom: 2rem; font-weight: 500; opacity: 0.9; }
        .insight-box { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); max-height: 0; opacity: 0; overflow: hidden; }
        .insight-box.open { max-height: 500px; opacity: 1; margin-top: 2rem; }
      `}</style>

      {/* Level Header */}
      <header className="page-header sticky top-0 z-[60] px-8 py-4 flex justify-between items-center">
         <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-blue-500 transition-all active:scale-95 group border border-white/5">
            <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         </button>
         
         <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2">
               <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{level.icon}</span>
               <h2 className="text-xl font-black">{level.title}</h2>
            </div>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
               <div className={`h-full ${activeTheme.primary} transition-all duration-1000`} style={{ width: `${(step / Step.COMPLETED) * 100}%` }}></div>
            </div>
         </div>

         <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            {isDarkMode ? '☀️' : '🌙'}
         </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-16 flex flex-col items-center">
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 animate-fade-in">
             <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                <div className={`absolute inset-0 border-8 ${activeTheme.primary} border-t-transparent rounded-full animate-spin`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl">{level.icon}</div>
             </div>
             <p className="text-xl font-black animate-pulse opacity-60">جاري استدعاء المحتوى الذكي لهذه المحطة...</p>
          </div>
        )}

        {step === Step.LEARN && (
           <div className="w-full space-y-12 animate-fade-in-up">
              <div className={`p-14 md:p-20 rounded-[4.5rem] shadow-3xl content-card relative overflow-hidden ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'}`}>
                  {carouselItems[currentContentPage]?.type === 'content' ? (
                     <div key={currentContentPage} className="animate-fade-in">
                        <article className={`prose-xl ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} text-right`}>
                           {carouselItems[currentContentPage].data.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                        </article>

                        <div 
                          onClick={() => toggleInsight(currentContentPage)}
                          className={`mt-12 p-8 rounded-[2.5rem] cursor-pointer border-2 transition-all group
                             ${revealedInsights[currentContentPage] 
                               ? `${activeTheme.bg} ${activeTheme.border}` 
                               : `bg-slate-800/5 border-dashed border-slate-500/20 hover:border-blue-500/50`}
                          `}
                        >
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <span className="text-3xl">🧠</span>
                                 <h4 className="text-xl font-black">رؤية استراتيجية مخصصة</h4>
                              </div>
                              <span className={`transition-transform duration-500 ${revealedInsights[currentContentPage] ? 'rotate-180' : ''}`}>▼</span>
                           </div>
                           <div className={`insight-box ${revealedInsights[currentContentPage] ? 'open' : ''}`}>
                              <p className="text-xl font-medium leading-relaxed italic opacity-80 pt-6">
                                بناءً على مشروعك في قطاع {user.industry}، نوصيك بالتركيز على تطبيق هذه المبادئ في نموذج العمل الخاص بك لزيادة ميزتك التنافسية.
                              </p>
                           </div>
                        </div>
                     </div>
                  ) : (
                    <div className="text-center space-y-10 py-10 animate-fade-in">
                       <div className="w-24 h-24 bg-slate-800/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-6xl">📥</div>
                       <h3 className="text-4xl font-black">اكتمل الجزء المعرفي</h3>
                       <p className="text-slate-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">أنت الآن جاهز للتطبيق العملي. قمنا بتوفير أدوات Gemini المساعدة لمشروعك في هذا المستوى.</p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {['دليل التنفيذ', 'ملفات العمل', 'أدوات AI', 'أمثلة سابقة'].map(m => (
                            <button key={m} className="p-6 bg-slate-800/5 rounded-3xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all border border-transparent hover:border-blue-400">تحميل {m}</button>
                          ))}
                       </div>
                    </div>
                  )}
              </div>

              <div className="flex justify-between items-center gap-6">
                  <button disabled={currentContentPage === 0} onClick={() => { setCurrentContentPage(p => p - 1); playPositiveSound(); }} className="flex-1 py-6 bg-slate-800/5 border border-white/5 text-slate-400 rounded-3xl font-black hover:text-blue-500 transition-all disabled:opacity-30">السابق</button>
                  <div className="flex gap-3">
                     {carouselItems.map((_, i) => (
                       <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentContentPage ? 'w-10 bg-blue-600' : 'w-2 bg-white/10'}`}></div>
                     ))}
                  </div>
                  {currentContentPage < carouselItems.length - 1 ? (
                    <button onClick={() => { setCurrentContentPage(p => p + 1); playPositiveSound(); }} className={`flex-[2] py-6 text-white rounded-3xl font-black shadow-2xl transition-all active:scale-95 ${activeTheme.primary}`}>المتابعة</button>
                  ) : (
                    <button onClick={() => { startQuiz(); playPositiveSound(); }} className="flex-[2] py-6 bg-slate-900 text-white rounded-3xl font-black shadow-2xl animate-pulse">بدء الاختبار المعرفي ✏️</button>
                  )}
              </div>
           </div>
        )}

        {step === Step.LOADING_QUIZ && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="font-black text-slate-500">جاري صياغة أسئلة التقييم...</p>
           </div>
        )}

        {step === Step.QUIZ && (
           <div className="w-full max-w-3xl space-y-10 animate-fade-in-up">
              <div className="text-center">
                 <h3 className="text-3xl font-black mb-2">اختبار المحطة {level.id}</h3>
                 <p className="text-slate-500">أجب بشكل صحيح للانتقال للمهمة التنفيذية</p>
              </div>
              <div className="space-y-8">
                 {quizQuestions.map((q, qIdx) => (
                    <div key={q.id} className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-xl'}`}>
                       <h4 className="text-xl font-bold mb-6">{qIdx + 1}. {q.text}</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {q.options.map((opt, oIdx) => (
                             <button 
                                key={oIdx} 
                                onClick={() => { const a = [...quizAnswers]; a[qIdx] = oIdx; setQuizAnswers(a); playPositiveSound(); }}
                                className={`p-5 rounded-2xl border-2 text-right font-medium transition-all ${quizAnswers[qIdx] === oIdx ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-blue-200'}`}
                             >
                                {opt}
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
              <button 
                 onClick={handleQuizSubmit}
                 disabled={quizAnswers.includes(-1)}
                 className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl disabled:opacity-30"
              >
                 تأكيد الإجابات والمتابعة
              </button>
           </div>
        )}

        {step === Step.OFFICIAL_TASK && levelTask && (
           <div className="w-full max-w-4xl space-y-12 animate-fade-in-up">
              <div className={`p-12 md:p-16 rounded-[4rem] shadow-3xl content-card relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTheme.primary} bg-white/5`}>
                          المخرج التنفيذي المطلوب
                       </span>
                       <h3 className="text-4xl font-black mt-4">{levelTask.title}</h3>
                    </div>
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">📝</div>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">وصف المهمة:</h4>
                       <p className="text-xl font-medium text-slate-700 leading-relaxed">{levelTask.description}</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">رابط المخرج أو النص التفصيلي</label>
                          <span className="text-[10px] font-bold text-blue-600">نوع التسليم: {levelTask.deliverableType}</span>
                       </div>
                       <textarea 
                          className="w-full h-64 p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all font-medium text-lg resize-none shadow-inner" 
                          placeholder="الصق رابط المستند أو قم بكتابة مخرجاتك هنا..."
                          value={submissionText}
                          onChange={e => setSubmissionText(e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="mt-12 flex gap-4">
                    <button onClick={onBack} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-sm hover:bg-slate-200 transition-all">العودة لاحقاً</button>
                    <button 
                       onClick={handleTaskSubmission}
                       disabled={!submissionText.trim()}
                       className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30 transition-all"
                    >
                       تسليم المخرج واعتماد المحطة 🚀
                    </button>
                 </div>
              </div>
           </div>
        )}

        {step === Step.COMPLETED && (
           <div className="flex flex-col items-center text-center space-y-12 animate-fade-in-up py-10">
              <div className="relative">
                 <div className="w-40 h-40 bg-emerald-100 rounded-full flex items-center justify-center text-8xl animate-bounce shadow-inner border-8 border-white">✨</div>
                 <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl transform rotate-12">🏆</div>
              </div>
              <div>
                 <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">إنجاز رائع!</h2>
                 <p className="text-slate-500 text-xl font-medium max-lg mx-auto leading-relaxed">
                    لقد أتممت بنجاح محطة "{level.title}". تم تسجيل المخرج في ملفك المهني وفتح المحطة التالية.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                 <button onClick={onComplete} className="px-16 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 transition-all">العودة للوحة التحكم</button>
                 {onRequestMentorship && (
                    <button onClick={onRequestMentorship} className="px-10 py-6 bg-white border-2 border-slate-100 text-blue-600 rounded-[2.5rem] font-black text-xl hover:bg-blue-50 transition-all">طلب استشارة خاصة 🤝</button>
                 )}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};
