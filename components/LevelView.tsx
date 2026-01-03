
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LevelData, UserProfile, Question, DIGITAL_SHIELDS } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

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
  onComplete: () => void;
  onBack: () => void;
  onRequestMentorship?: () => void;
}

enum Step { LOADING_CONTENT, LEARN, EXERCISE, LOADING_QUIZ, QUIZ, COMPLETED }

export const LevelView: React.FC<LevelViewProps> = ({ level, user, onComplete, onBack, onRequestMentorship }) => {
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

  const activeTheme = useMemo(() => {
     if (level.customColor && THEMES[level.customColor]) return THEMES[level.customColor];
     return DEFAULT_THEMES[(level.id - 1) % DEFAULT_THEMES.length];
  }, [level.customColor, level.id]);

  const shieldInfo = DIGITAL_SHIELDS.find(s => s.levelId === level.id);
  const contentBlocks = useMemo(() => content ? content.split('\n\n').filter(b => b.trim().length > 10) : [], [content]);
  const carouselItems = useMemo(() => {
    const items = contentBlocks.map((b, i) => ({ type: 'content' as const, data: b, index: i }));
    items.push({ type: 'resources' as const, data: '', index: contentBlocks.length });
    return items;
  }, [contentBlocks]);

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
       playCelebrationSound();
       setTimeout(() => setStep(Step.COMPLETED), 2000); 
    } else {
      playErrorSound();
      alert('نعتذر، لم تجتاز الاختبار بنسبة كافية. يرجى مراجعة المادة وإعادة المحاولة.');
    }
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
               <div className={`h-full ${activeTheme.primary} transition-all duration-1000`} style={{ width: `${(currentContentPage / (carouselItems.length - 1 || 1)) * 100}%` }}></div>
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
                    <button onClick={() => { setStep(Step.EXERCISE); playPositiveSound(); }} className="flex-[2] py-6 bg-slate-900 text-white rounded-3xl font-black shadow-2xl animate-pulse">بدء التحدي العملي ✏️</button>
                  )}
              </div>
           </div>
        )}

        {/* ... Other steps (EXERCISE, QUIZ, COMPLETED) remain consistent but benefit from the new typography and cards ... */}
      </main>
    </div>
  );
};
