
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
  tasks: TaskRecord[]; 
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

  const carouselItems = useMemo(() => {
    if (!content) return [];
    const pages = content.split('\n\n').filter(p => p.trim().length > 0);
    const items = pages.map(p => ({ type: 'content' as const, data: p }));
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
        .level-header { backdrop-filter: blur(24px); background: ${isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)'}; border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .reader-card { transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1); border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .article-pro p { font-size: 1.25rem; line-height: 2.4rem; margin-bottom: 2rem; font-weight: 400; opacity: 0.85; text-align: justify; }
        .article-pro h4 { font-size: 1.75rem; font-weight: 800; margin-bottom: 1.5rem; color: #2563eb; }
        .ai-insight-hub { border-right: 4px solid #3b82f6; background: ${isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.03)'}; }
        .insight-content { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); max-height: 0; opacity: 0; overflow: hidden; }
        .insight-content.open { max-height: 500px; opacity: 1; margin-top: 1.5rem; }
      `}</style>

      {/* Modern Header */}
      <header className="level-header sticky top-0 z-[60] px-8 py-5 flex justify-between items-center shadow-lg">
         <button onClick={onBack} className="p-3 glass rounded-2xl text-slate-400 hover:text-blue-500 transition-all active:scale-90 group">
            <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         </button>
         
         <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-5">
               <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]">{level.icon}</span>
               <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none">{level.title}</h2>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1.5">Intelligence Module: LVL 0{level.id}</p>
               </div>
            </div>
            <div className="w-64 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
               <div className={`h-full ${activeTheme.primary} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]`} style={{ width: `${(step / Step.COMPLETED) * 100}%` }}></div>
            </div>
         </div>

         <button onClick={() => { setIsDarkMode(!isDarkMode); localStorage.setItem('level_display_mode', !isDarkMode ? 'dark' : 'light'); }} className="p-3 glass rounded-2xl hover:bg-white/10 transition-all">
            {isDarkMode ? '☀️' : '🌙'}
         </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-20 flex flex-col items-center">
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-fade-in">
             <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-[12px] border-blue-500/5 rounded-full"></div>
                <div className={`absolute inset-0 border-[12px] ${activeTheme.primary} border-t-transparent rounded-full animate-spin`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-7xl animate-pulse">{level.icon}</div>
             </div>
             <div className="text-center space-y-3">
                <p className="text-2xl font-black text-slate-800 dark:text-white">جاري تحضير المحتوى الذكي...</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gemini Generative Engine Active</p>
             </div>
          </div>
        )}

        {step === Step.LEARN && (
           <div className="w-full space-y-16 animate-fade-in-up">
              <div className={`p-16 md:p-24 rounded-[4rem] premium-shadow reader-card relative overflow-hidden ${isDarkMode ? 'bg-slate-900/60' : 'bg-white'}`}>
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-600 to-indigo-500"></div>
                  
                  {carouselItems[currentContentPage]?.type === 'content' ? (
                     <div key={currentContentPage} className="animate-fade-in">
                        <article className={`article-pro ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} text-right`}>
                           {carouselItems[currentContentPage].data.split('\n').map((p, i) => {
                             if (p.startsWith('###')) return <h4 key={i}>{p.replace('###', '')}</h4>;
                             return <p key={i}>{p}</p>;
                           })}
                        </article>

                        <div 
                          onClick={() => toggleInsight(currentContentPage)}
                          className={`ai-insight-hub mt-16 p-10 rounded-[2.5rem] cursor-pointer transition-all duration-500 group
                             ${revealedInsights[currentContentPage] 
                               ? `${activeTheme.bg} border-blue-400/30 shadow-lg` 
                               : `hover:bg-blue-600/5 border-transparent`}
                          `}
                        >
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl text-white group-hover:rotate-6 transition-transform">🤖</div>
                                 <div>
                                    <h4 className="text-xl font-black mb-0 text-slate-900 dark:text-white">تحليل المستشار الذكي</h4>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Contextual AI Insight</p>
                                 </div>
                              </div>
                              <span className={`transition-transform duration-500 text-blue-400 ${revealedInsights[currentContentPage] ? 'rotate-180' : ''}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                              </span>
                           </div>
                           <div className={`insight-content ${revealedInsights[currentContentPage] ? 'open' : ''}`}>
                              <p className="text-xl font-medium leading-relaxed italic opacity-90 text-slate-600 dark:text-slate-400 pt-4 pr-4">
                                بناءً على مشروعك في قطاع {user.industry}، نوصيك بالتركيز على تطبيق هذه المبادئ في نموذج العمل الخاص بك لزيادة ميزتك التنافسية.
                              </p>
                           </div>
                        </div>
                     </div>
                  ) : (
                    <div className="text-center space-y-12 py-12 animate-fade-in">
                       <div className="w-32 h-32 bg-blue-600/10 rounded-[3rem] flex items-center justify-center mx-auto text-7xl shadow-inner animate-float">📥</div>
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">اكتمل المسار المعرفي</h3>
                          <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">أنت الآن جاهز للتطبيق العملي. قمنا بتوفير أدوات Gemini المساعدة لمشروعك في هذا المستوى لمساعدتك في بناء المخرج النهائي.</p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {['دليل التنفيذ (PDF)', 'نماذج العمل التقنية', 'أدوات Gemini المساعدة', 'أمثلة لشركات ناجحة'].map(m => (
                            <button key={m} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] font-black text-sm hover:bg-blue-600 hover:text-white transition-all border border-transparent hover:scale-105 active:scale-95 shadow-sm">تحميل {m}</button>
                          ))}
                       </div>
                    </div>
                  )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center gap-8">
                  <button disabled={currentContentPage === 0} onClick={() => { setCurrentContentPage(p => p - 1); playPositiveSound(); }} className="flex-1 py-6 glass text-slate-500 rounded-3xl font-black hover:text-blue-600 transition-all disabled:opacity-20 active:scale-95">السابق</button>
                  <div className="flex gap-4">
                     {carouselItems.map((_, i) => (
                       <div key={i} className={`h-2.5 rounded-full transition-all duration-700 ${i === currentContentPage ? 'w-14 bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]' : 'w-2.5 bg-slate-200 dark:bg-white/10'}`}></div>
                     ))}
                  </div>
                  {currentContentPage < carouselItems.length - 1 ? (
                    <button onClick={() => { setCurrentContentPage(p => p + 1); playPositiveSound(); }} className={`flex-[2] py-6 text-white rounded-3xl font-black shadow-2xl transition-all hover:brightness-110 active:scale-95 ${activeTheme.primary}`}>المتابعة</button>
                  ) : (
                    <button onClick={() => { startQuiz(); playPositiveSound(); }} className="flex-[2] py-6 bg-slate-900 text-white rounded-3xl font-black shadow-2xl animate-pulse active:scale-95">بدء الاختبار المعرفي ✏️</button>
                  )}
              </div>
           </div>
        )}

        {step === Step.LOADING_QUIZ && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
              <div className="w-20 h-20 border-[6px] border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-xl font-black text-slate-500">جاري صياغة أسئلة التقييم الذكية...</p>
           </div>
        )}

        {step === Step.QUIZ && (
           <div className="w-full max-w-2xl space-y-12 animate-fade-in-up">
              <div className="text-center space-y-3">
                 <h3 className="text-4xl font-black tracking-tight">تقييم استيعاب المحطة</h3>
                 <p className="text-slate-500 font-medium">أجب بشكل صحيح للانتقال لمرحلة تسليم المخرج التنفيذي</p>
              </div>
              <div className="space-y-10">
                 {quizQuestions.map((q, qIdx) => (
                    <div key={q.id} className={`p-12 rounded-[3.5rem] premium-shadow ${isDarkMode ? 'bg-slate-900/60' : 'bg-white'}`}>
                       <div className="flex items-center gap-4 mb-10">
                          <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">{qIdx + 1}</span>
                          <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-snug">{q.text}</h4>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          {q.options.map((opt, oIdx) => (
                             <button 
                                key={oIdx} 
                                onClick={() => { const a = [...quizAnswers]; a[qIdx] = oIdx; setQuizAnswers(a); playPositiveSound(); }}
                                className={`p-6 rounded-2xl border-2 text-right font-bold transition-all duration-300 relative overflow-hidden group
                                  ${quizAnswers[qIdx] === oIdx 
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-400 shadow-lg' 
                                    : 'border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30'}`}
                             >
                                <div className={`absolute top-0 right-0 w-1.5 h-full transition-all ${quizAnswers[qIdx] === oIdx ? 'bg-blue-600' : 'bg-transparent group-hover:bg-blue-200'}`}></div>
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
                 className="w-full py-7 bg-blue-600 text-white rounded-[2.2rem] font-black text-xl shadow-2xl shadow-blue-500/30 disabled:opacity-30 active:scale-95 transition-all hover:bg-blue-700"
              >
                 تأكيد الإجابات والمتابعة
              </button>
           </div>
        )}

        {step === Step.OFFICIAL_TASK && levelTask && (
           <div className="w-full max-w-3xl space-y-12 animate-fade-in-up">
              <div className={`p-14 md:p-20 rounded-[4rem] premium-shadow reader-card relative overflow-hidden ${isDarkMode ? 'bg-slate-900/60' : 'bg-white'}`}>
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <span className={`inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 text-blue-600`}>
                          المخرج التنفيذي المطلوب
                       </span>
                       <h3 className="text-5xl font-black mt-6 leading-tight tracking-tight">{levelTask.title}</h3>
                    </div>
                    <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-xl text-white transform -rotate-6">📝</div>
                 </div>
                 
                 <div className="space-y-10">
                    <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-inner">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">وصف المهمة التنفيذية:</h4>
                       <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic opacity-90">{levelTask.description}</p>
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Submission Portal</label>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-600/10 px-3 py-1 rounded-lg">نوع التسليم: {levelTask.deliverableType}</span>
                       </div>
                       <textarea 
                          className={`w-full h-72 p-10 border rounded-[3rem] outline-none focus:ring-8 transition-all duration-500 font-medium text-xl resize-none shadow-inner 
                            ${isDarkMode ? 'bg-slate-800 border-white/5 focus:ring-blue-500/10 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500'}`}
                          placeholder="الصق رابط المستند أو قم بكتابة مخرجاتك النهائية هنا..."
                          value={submissionText}
                          onChange={e => setSubmissionText(e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="mt-16 flex flex-col sm:flex-row gap-4">
                    <button onClick={onBack} className="flex-1 py-6 glass text-slate-500 rounded-[2.2rem] font-black text-sm hover:text-slate-900 transition-all active:scale-95">إكمال التسليم لاحقاً</button>
                    <button 
                       onClick={handleTaskSubmission}
                       disabled={!submissionText.trim()}
                       className="flex-[2.5] py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                       اعتماد المخرج وإنهاء المحطة 🚀
                    </button>
                 </div>
              </div>
           </div>
        )}

        {step === Step.COMPLETED && (
           <div className="flex flex-col items-center text-center space-y-16 animate-fade-in-up py-12">
              <div className="relative">
                 <div className="w-48 h-48 bg-emerald-500/10 rounded-full flex items-center justify-center text-9xl animate-bounce shadow-inner border-[12px] border-white dark:border-slate-800">✨</div>
                 <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl transform rotate-12 ring-8 ring-white dark:ring-slate-950">🏆</div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">إنجاز رائد!</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-2xl font-medium max-w-xl mx-auto leading-relaxed">
                    لقد أتممت بنجاح محطة "{level.title}". تم تسجيل المخرج في ملفك المهني وفتح المحطة التالية في مسار نمو مشروعك.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-8">
                 <button onClick={onComplete} className="px-20 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95">العودة للوحة القيادة</button>
                 {onRequestMentorship && (
                    <button onClick={onRequestMentorship} className="px-12 py-7 glass border-2 border-blue-600/20 text-blue-600 dark:text-blue-400 rounded-[2.5rem] font-black text-2xl hover:bg-blue-600/5 transition-all active:scale-95">طلب استشارة خاصة 🤝</button>
                 )}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};
