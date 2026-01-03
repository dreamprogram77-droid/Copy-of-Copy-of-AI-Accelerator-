
import React, { useState } from 'react';
import { ProgramRating } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface ProgramEvaluationProps {
  onClose: () => void;
  onSubmit: (rating: ProgramRating) => void;
}

export const ProgramEvaluation: React.FC<ProgramEvaluationProps> = ({ onClose, onSubmit }) => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [favoriteFeature, setFavoriteFeature] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const features = [
    'المستشار الذكي (AI)',
    'خريطة نضج المشروع',
    'أدوات مولد الأفكار',
    'الجلسات الإرشادية',
    'نظام التحديات والمهام'
  ];

  const handleSubmit = () => {
    if (stars === 0) return alert('يرجى اختيار عدد النجوم للتقييم.');
    
    const rating: ProgramRating = {
      stars,
      feedback,
      favoriteFeature,
      submittedAt: new Date().toISOString()
    };
    
    playCelebrationSound();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(rating);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
      <div className="bg-white rounded-[3.5rem] max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">
        {isSubmitted ? (
          <div className="p-16 text-center space-y-8">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl animate-bounce">✓</div>
            <h2 className="text-4xl font-black text-slate-900">شكراً لك!</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              تقييمك يساعدنا على تطوير "بيزنس ديفلوبرز" لتكون الوجهة الأفضل لرواد الأعمال العرب.
            </p>
          </div>
        ) : (
          <div className="p-10 md:p-14">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900">كيف كانت تجربتك؟</h3>
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest mt-2">Program Impact & Feedback</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">✕</button>
            </div>

            <div className="space-y-10">
              {/* Stars Selection */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">تقييمك العام للمسرعة</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => { setStars(star); playPositiveSound(); }}
                      className={`text-5xl transition-all transform hover:scale-125 active:scale-95 ${
                        star <= (hover || stars) ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Feature */}
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pr-2">أكثر ميزة أفادتك في المسار:</label>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFavoriteFeature(f); playPositiveSound(); }}
                      className={`px-5 py-3 rounded-2xl text-xs font-black border-2 transition-all ${
                        favoriteFeature === f 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pr-2">رأيك بصراحة (ماذا نحسن؟)</label>
                <textarea
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium resize-none shadow-inner"
                  placeholder="اكتب تعليقك هنا..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group"
                >
                  <span>إرسال التقييم</span>
                  <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
