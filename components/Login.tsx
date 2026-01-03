
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';
import { playPositiveSound, playErrorSound } from '../services/audioService';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent, targetEmail?: string) => {
    if (e) e.preventDefault();
    
    const finalEmail = targetEmail || email;
    if (!finalEmail) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate small delay for UX feel
    setTimeout(() => {
      const result = storageService.loginUser(finalEmail);
      
      if (result) {
        const profile: UserProfile = {
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          startupName: result.startup.name,
          startupDescription: result.startup.description,
          industry: result.startup.industry,
          name: `${result.user.firstName} ${result.user.lastName}`,
          hasCompletedAssessment: result.startup.status === 'APPROVED'
        };
        
        playPositiveSound();
        onLoginSuccess(profile);
      } else {
        setError('عذراً، لم نجد حساباً مسجلاً بهذا البريد الإلكتروني.');
        playErrorSound();
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError(null);
    playPositiveSound();

    setTimeout(() => {
      const demoEmail = storageService.seedDemoAccount();
      setEmail(demoEmail);
      setPassword('demo123');
      const result = storageService.loginUser(demoEmail);
      
      if (result) {
        const profile: UserProfile = {
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          startupName: result.startup.name,
          startupDescription: result.startup.description,
          industry: result.startup.industry,
          name: `${result.user.firstName} ${result.user.lastName}`,
          hasCompletedAssessment: result.startup.status === 'APPROVED'
        };
        onLoginSuccess(profile);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans overflow-hidden text-white" dir="rtl">
      <style>{`
        .login-mesh {
          background-image: radial-gradient(at 0% 0%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, hsla(215, 98%, 61%, 0.05) 0px, transparent 50%);
        }
      `}</style>
      
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-center p-20 border-l border-white/5 overflow-hidden">
        <div className="absolute inset-0 login-mesh opacity-50"></div>
        <div className="relative z-10 space-y-12">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl animate-float">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="space-y-6">
            <h1 className="text-7xl font-black leading-tight tracking-tighter">أهلاً بك <br/><span className="text-blue-500">من جديد.</span></h1>
            <p className="text-2xl text-slate-400 max-w-lg leading-relaxed font-medium">سجل دخولك لمتابعة نضج مشروعك الريادي، أو استكشف المنصة عبر الحساب التجريبي المخصص للزوار.</p>
          </div>
        </div>
      </div>

      {/* Login Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="max-w-md w-full animate-fade-in-up space-y-12">
           <header className="space-y-4">
              <div className="lg:hidden w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">تسجيل الدخول</h2>
              <p className="text-slate-500 font-medium text-lg">الوصول إلى بوابة التسريع الذكي</p>
           </header>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">البريد الإلكتروني</label>
                 <div className="relative group">
                    <input 
                      type="email" 
                      required
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-bold text-lg placeholder-slate-700"
                      placeholder="name@startup.ai"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 text-xl group-focus-within:opacity-100 transition-opacity">📧</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center pr-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">كلمة المرور</label>
                    <button type="button" className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">نسيت السر؟</button>
                 </div>
                 <div className="relative group">
                    <input 
                      type="password" 
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-bold text-lg placeholder-slate-700"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 text-xl group-focus-within:opacity-100 transition-opacity">🔑</span>
                 </div>
              </div>

              {error && (
                <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 animate-shake">
                   <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">!</div>
                   <p className="text-sm font-bold text-rose-400">{error}</p>
                </div>
              )}

              <div className="pt-4 space-y-6">
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-900/30 transition-all transform active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                 >
                   {isLoading ? (
                     <div className="w-6 h-6 border-[3.5px] border-white/20 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>
                        <span>دخول للمسرعة</span>
                        <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </>
                   )}
                 </button>

                 <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-slate-950 px-6 text-slate-600">أو استكشف كزائر</span></div>
                 </div>

                 <button 
                   type="button" 
                   onClick={handleDemoLogin}
                   disabled={isLoading}
                   className="w-full py-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-2 border-dashed border-blue-500/30 text-blue-400 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-4 active:scale-95 group"
                 >
                   <span className="text-2xl group-hover:scale-125 transition-transform">👁️</span>
                   <span>الدخول بالحساب التجريبي</span>
                   <span className="text-[10px] bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 font-black uppercase tracking-widest">Instant Access</span>
                 </button>

                 <button 
                   type="button" 
                   onClick={onBack}
                   className="w-full py-4 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                 >
                   العودة للرئيسية
                 </button>
              </div>
           </form>

           <footer className="pt-20 text-center border-t border-white/5">
              <p className="text-slate-600 text-sm font-bold">ليس لديك حساب؟ <button onClick={onBack} className="text-blue-500 font-black hover:text-blue-400 transition-colors">سجل مشروعك الآن</button></p>
           </footer>
        </div>
      </div>
    </div>
  );
};
